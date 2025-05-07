import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlsService } from '../urls/urls.service';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Login, Register, ResetPassword } from '../../interfaces/auth';

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

  /**
   * Initializes the authentication process by checking the current authentication status
   * and refreshing it if necessary. Notifies subscribers when authentication is ready.
   *
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   */
  async initializeAuth(): Promise<void> {
    await this.checkAuthStatusAndRefresh();
    this.authReadySubject.next(true);
  }

  /**
   * Sets the access token and updates the user subject with the decoded token.
   * If decoding fails, the user subject is set to null.
   *
   * @param token - The JWT access token to be set.
   */
  setAccessToken(token: string) {
    this.accessToken = token;
    try {
      const decoded: DecodedToken = jwtDecode(token);
      this.userSubject.next(decoded);
    } catch (e) {
      this.userSubject.next(null);
    }
  }

  /**
   * Retrieves the current access token.
   *
   * @returns The access token as a string, or `null` if not available.
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Retrieves the currently authenticated user's decoded token.
   *
   * @returns {DecodedToken | null} The decoded token of the current user, or null if no user is authenticated.
   */
  getCurrentUser(): DecodedToken | null {
    return this.userSubject.value;
  }

  /**
   * Clears the stored access token and resets the user state.
   * Sets the access token to null and notifies subscribers by emitting a null value.
   */
  clearToken() {
    this.accessToken = null;
    this.userSubject.next(null);
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  /**
   * Checks if the current user has a valid re-authentication session.
   *
   * @returns {boolean} `true` if the user's re-authentication session is still valid, otherwise `false`.
   */
  hasValidReauth(): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.re_auth_until) return false;

    const now = Date.now() / 1000;
    return user.re_auth_until > now;
  }

  /**
   * Checks the authentication status of the user and refreshes the access token if authenticated.
   * If the user is not authenticated or an error occurs, clears the token.
   * Notifies subscribers when the authentication check is complete.
   *
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
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
      this.clearToken();
    } finally {
      this.authReadySubject.next(true);
    }
  }

  /**
   * Refreshes the access token by making a POST request to the refresh URL.
   * If successful, updates the access token. If an error occurs, clears the token.
   *
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
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

  /**
   * Sends a registration request to the server with the provided user data.
   *
   * @param data - The registration data to be sent in the request body.
   * @returns An Observable of the HTTP response.
   */
  register(data: Register) {
    return this.http.post(this.urls.registerUrl, data);
  }

  /**
   * Sends a login request to the server with the provided credentials.
   *
   * @param data - The login credentials to be sent in the request body.
   * @returns An observable containing the server's response with an access token.
   */
  login(data: Login) {
    return this.http.post<{ access: string }>(this.urls.loginUrl, data, { withCredentials: true });
  }

  /**
   * Sends a request to reset the user's password.
   *
   * @param data - The payload containing the necessary information for password reset.
   * @returns An Observable of the HTTP response.
   */
  resetPassword(data: ResetPassword) {
    return this.http.post(this.urls.passwordResetUrl, data)
  }

  /**
   * Confirms and sets a new password for a user.
   *
   * @param uid - The unique identifier of the user.
   * @param token - The reset token for password confirmation.
   * @param newPassword - The new password to be set for the user.
   * @returns An Observable of the HTTP POST request.
   */
  confirmNewPassword(uid: any, token: any, newPassword: string) {
    return this.http.post(this.urls.passwordResetConfirmUrl, { uid, token, new_password: newPassword })
  }

  /**
   * Verifies the user's email using the provided token.
   * Sends a GET request to the email verification URL with the token as a query parameter.
   *
   * @param token - The email verification token.
   * @returns A promise resolving to the server's response.
   * @throws An error message if the verification fails.
   */
  async verifyEmail(token: string) {
    const safeToken = encodeURIComponent(token);
    return this.http.get(this.urls.emailVerifyUrl + '?token=' + safeToken).toPromise()
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {
        throw error.error?.message || 'Verifizierung fehlgeschlagen.';
      });
  }

  /**
   * Logs the user out by sending a logout request to the server,
   * clears the authentication token, and navigates to the login page.
   *
   * @returns {Promise<void>} A promise that resolves when the logout process is complete.
   */
  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(this.urls.logoutUrl, {}, { withCredentials: true }));
    } catch (e) {
    }
    this.clearToken();
    this.router.navigate(['/login']);
  }

}

