import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from '../urls/urls.service';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface DecodedToken {
  exp: number;
  iat: number;
  user_id: number;
  re_auth_until?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  cacheEmail: any = '';
  private accessToken: string | null = null;
  private userSubject = new BehaviorSubject<DecodedToken | null>(null);
  public user$ = this.userSubject.asObservable();
  private authReadySubject = new BehaviorSubject<boolean>(false);
  authReady$ = this.authReadySubject.asObservable();


  constructor(
    private urls: UrlsService,
    private http: HttpClient,
    private router: Router
  ) { }

  async initializeAuth(): Promise<void> {
    await this.checkAuthStatusAndRefresh();
    this.authReadySubject.next(true);
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    try {
      const decoded: DecodedToken = jwtDecode(token);
      this.userSubject.next(decoded);
    } catch (e) {
      this.userSubject.next(null);
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getCurrentUser(): DecodedToken | null {
    return this.userSubject.value;
  }

  clearToken() {
    this.accessToken = null;
    this.userSubject.next(null);
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  hasValidReauth(): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.re_auth_until) return false;

    const now = Date.now() / 1000;
    return user.re_auth_until > now;
  }

  async checkAuthStatusAndRefresh(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ authenticated: boolean, user_id?: number }>(this.urls.authStatusUrl, {
          withCredentials: true
        })
      );

      if (response.authenticated) {
        await this.refreshAccessToken();
      } else {
        this.clearToken();
      }
    } catch (err) {
      console.error("Fehler beim Auth-Status prüfen:", err);
      this.clearToken();
    } finally {
      // GANZ WICHTIG: immer ready setzen, auch bei Fehlern!
      this.authReadySubject.next(true);
    }
  }

  async refreshAccessToken(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ access: string }>(this.urls.refreshUrl, {}, {
          withCredentials: true
        })
      );
      this.setAccessToken(response.access);
    } catch (err) {
      this.clearToken();
    }
  }

  register(data: any) {
    return this.http.post(this.urls.registerUrl, data);
  }

  login(data: any) {
    return this.http.post<{ access: string }>(this.urls.loginUrl, data, { withCredentials: true });
  }

  resetPassword(data: any) {
    return this.http.post(this.urls.passwordResetUrl, data)
  }

  confirmNewPassword(uid: any, token: any, newPassword: string) {
    return this.http.post(this.urls.passwordResetConfirmUrl, { uid, token, new_password: newPassword })
  }

  async verifyEmail(token: string) {
    const safeToken = encodeURIComponent(token);
    return this.http.get(this.urls.emailVerifyUrl + '?token=' + safeToken).toPromise()
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {
        console.error('Fehler beim Verifizieren:', error);
        throw error.error?.message || 'Verifizierung fehlgeschlagen.';
      });
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(this.urls.logoutUrl, {}, { withCredentials: true }));
    } catch (e) {
      console.warn("Logout-Fehler:", e);
    }
    this.clearToken();
    this.router.navigate(['/login']);
  }

}

