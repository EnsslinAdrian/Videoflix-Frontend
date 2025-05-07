import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {
// Base URLs
  baseUrl: string = 'https://api.adrianensslin.de/'
  baseAuthUrl: string = 'https://api.adrianensslin.de/api/auth/'

// Authentication URLs
  registerUrl: string = this.baseAuthUrl + 'register/'
  loginUrl: string = this.baseAuthUrl + 'login/';
  passwordResetUrl: string = this.baseAuthUrl + 'password-reset/'
  passwordResetConfirmUrl: string = this.baseAuthUrl + 'password-reset/confirm/'
  logoutUrl: string = this.baseAuthUrl + 'logout/'
  meUrl: string = this.baseAuthUrl + 'me/'
  emailVerifyUrl: string = this.baseAuthUrl + 'verify-email/'
  authStatusUrl: string = this.baseAuthUrl + 'status/'
  refreshUrl: string = this.baseAuthUrl + 'refresh/'

// Movie URLs
  moviesUrl: string = this.baseUrl + 'api/movie/'
  trailer: string = this.baseUrl + 'media/trailer/spingVideo_web_jSukF3F.mp4';
  trailerCover: string = this.baseUrl + 'media/trailer/spring_0brOkmO.png';
  trailerMovieId: number = 13;


}

