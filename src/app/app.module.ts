import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AuthMasterComponent } from './auth/auth-master/auth-master.component';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { AuthHttpInterceptor } from './services/http-interceptor';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [AppComponent, AuthMasterComponent, LoginPageComponent],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
