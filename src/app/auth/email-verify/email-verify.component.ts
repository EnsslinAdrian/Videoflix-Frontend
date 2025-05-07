import { Component } from '@angular/core';
import { TypographyComponent } from "../../ui-component/typography/typography.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/authentication/auth.service';

@Component({
  selector: 'app-email-verify',
  imports: [TypographyComponent, CommonModule],
  templateUrl: './email-verify.component.html',
  styleUrl: './email-verify.component.scss'
})
export class EmailVerifyComponent {
  isLoading = true;
  isError = false;
  isSuccess = false;
  angle: number = 124;
  error: string | null = null;

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute) {}

  /**
   * Starts the loading process by setting the loading state to true.
   * Resets error and success states to false.
   */
  startLoading() {
    this.isLoading = true;
    this.isError = false;
    this.isSuccess = false;
  }

  /**
   * Sets the component's state to indicate an error.
   * - `isLoading` is set to `false`.
   * - `isError` is set to `true`.
   * - `isSuccess` is set to `false`.
   */
  startFalse() {
    this.isLoading = false;
    this.isError = true;
    this.isSuccess = false;
  }

  /**
   * Sets the component's state to indicate a successful operation.
   * - `isLoading` is set to `false`.
   * - `isError` is set to `false`.
   * - `isSuccess` is set to `true`.
   */
  startTrue() {
    this.isLoading = false;
    this.isError = false;
    this.isSuccess = true;
  }

  /**
   * Lifecycle hook that is called after the component's view has been initialized.
   * This method retrieves the email verification token from the query parameters,
   * initiates the email verification process, and handles success or error states.
   * A delay of 1 second is applied before processing.
   */
  ngOnInit() {
    setTimeout(() => {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.startLoading();
      this.authService.verifyEmail(token).then(() => {
        this.startTrue();
        this.navigateToLogin();
      }).catch((error) => {
        this.error = error;
        this.startFalse();
      });
    } else {
      this.error = 'Kein Token gefunden.';
      this.startFalse();
    }
  }, 1000);
  }

  /**
   * Navigates the user to the login page after a delay of 3 seconds.
   */
  navigateToLogin() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 3000);
  }

}
