import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { UrlsService } from '../urls/urls.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const urlsService = inject(UrlsService);
  const http = inject(HttpClient);

  const token = authService.getAccessToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.includes('/auth/refresh/')) {
        return http.post<{ access: string }>(urlsService.refreshUrl, {}, {
          withCredentials: true
        }).pipe(
          switchMap(res => {
            authService.setAccessToken(res.access);
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.access}` }
            });
            return next(retryReq);
          }),
          catchError(() => throwError(() => err))
        );
      }
      return throwError(() => err);
    })
  );
};
