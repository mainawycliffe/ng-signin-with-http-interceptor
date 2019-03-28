import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { share, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  refreshTokenURL = ''; // SET REFRESH TOKEN
  loginURL = ''; // SET LOGIN URL

  refreshToken(): Observable<string> {
    // append refresh token if you have one
    const refreshToken = localStorage.getItem('refreshAuthorization');
    const expiredToken = localStorage.getItem('authorization');

    return this.http
      .get(this.refreshTokenURL, {
        headers: new HttpHeaders()
          .set('refreshAuthorization', refreshToken)
          .set('authorization', expiredToken),
        observe: 'response'
      })
      .pipe(
        share(),
        map(res => {
          const token = res.headers.get('authorization');
          const newRefreshToken = res.headers.get('refreshAuthorization');

          // store the new tokens
          localStorage.setItem('refreshAuthorization', newRefreshToken);
          localStorage.setItem('authorization', token);

          return token;
        })
      );
  }

  getToken(): Observable<string> {
    return of(localStorage.getItem('authorization'));
  }

  login(fd: FormData): Observable<any> {
    return this.http.post(this.loginURL, fd, { observe: 'response' }).pipe(
      tap(res => {
        // save the token from the server to local storage or somewhere else
        // asuming the token is in the header
        const authorization: string = res.headers.get('Authorization');
        const refreshAuthorization: string = res.headers.get(
          'refreshAuthorization'
        );

        localStorage.setItem('authorization', authorization);
        localStorage.setItem('refreshAuthorization', refreshAuthorization);
      })
    );
  }
}
