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

  /**
   * Determines if a route can be activated based on the user's authentication status.
   * Waits for the authentication service to be ready, then checks if the user is logged in.
   * Redirects to the '/startsite' route if the user is not authenticated.
   *
   * @returns An observable that emits `true` if the user is authenticated, otherwise `false`.
   */
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


