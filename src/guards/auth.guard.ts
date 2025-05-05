import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.authReady$.pipe(
      filter(ready => ready), 
      switchMap(() => {
        return this.authService.isAuthenticated().pipe(
          map(isLoggedIn => {
            if (isLoggedIn) {
              return true;
            } else {
              this.router.navigate(['/startsite']);
              return false;
            }
          })
        );
      }),
      take(1)
    );
  }
}


