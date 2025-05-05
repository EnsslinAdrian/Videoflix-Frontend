import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {
  baseUrl = 'https://api.adrianensslin.de/'
  baseAuthUrl = 'https://api.adrianensslin.de/api/auth/'

  registerUrl = this.baseAuthUrl + 'register/'
  loginUrl = this.baseAuthUrl + 'login/';
  passwordResetUrl = this.baseAuthUrl + 'password-reset/'
  passwordResetConfirmUrl = this.baseAuthUrl + 'password-reset/confirm/'
  logoutUrl = this.baseAuthUrl + 'logout/'
  meUrl = this.baseAuthUrl + 'me/'
  emailVerifyUrl = this.baseAuthUrl + 'verify-email/'
  authStatusUrl = this.baseAuthUrl + 'status/'
  refreshUrl = this.baseAuthUrl + 'refresh/'

  moviesUrl = this.baseUrl + 'api/movie/'
}

