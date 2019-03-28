import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private router: Router) {}

  inflightAuthRequest = null;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // exempt some paths from authentication
    if (req.headers.get('authExempt') === 'true') {
      return next.handle(req);
    }

    const authService = this.injector.get(AuthService);

    this.inflightAuthRequest = authService.getToken();

    return this.inflightAuthRequest.pipe(
      switchMap((token: string) => {
        // unset request inflight
        this.inflightAuthRequest = null;

        // clone request and attach token attached
        const authReq = req.clone({
          headers: req.headers.set('Auhtorization', `Bearer ${token}`)
        });

        // switch to using cloned request
        return next.handle(authReq);
      }),
      catchError(error => {
        // checks if a url is to an admin api or not
        if (error.status === 401) {
          // check if the response is from the token refresh end point
          const isFromRefreshTokenEndpoint = !!error.headers.get(
            'unableToRefreshToken'
          );

          if (isFromRefreshTokenEndpoint) {
            localStorage.clear();
            this.router.navigate(['/auth/signin']);
            return throwError(error);
          }

          if (!this.inflightAuthRequest) {
            this.inflightAuthRequest = authService.refreshToken();

            if (!this.inflightAuthRequest) {
              // remove existing tokens
              localStorage.clear();
              this.router.navigate(['/auth/signin']);
              return throwError(error);
            }
          }

          return this.inflightAuthRequest.pipe(
            switchMap((newToken: string) => {
              // unset inflight request
              this.inflightAuthRequest = null;

              // clone the original request
              const authReqRepeat = req.clone({
                headers: req.headers.set('token', newToken)
              });

              // resend the request
              return next.handle(authReqRepeat);
            })
          );
        } else {
          return throwError(error);
        }
      })
    );
  }
}
