import { Component } from '@angular/core';
import { TypographyComponent } from "../../ui-component/typography/typography.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorToastComponent } from "../../ui-component/error-toast/error-toast.component";
import { AuthService } from '../../../services/authentication/auth.service';
import { ResetPassword } from '../../../interfaces/auth';

@Component({
  selector: 'app-forget-password',
  imports: [
    ReactiveFormsModule,
    TypographyComponent,
    CommonModule,
    ErrorToastComponent
],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  result: boolean = false;
  errorOrCorrect: 'error' | 'correct' = 'error';
  toastMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  forgetPasswort = new FormGroup({
    email: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
  });

  /**
   * Handles the form submission for the forget password functionality.
   * Validates the form and triggers the password reset process via the AuthService.
   * On success, processes the response to check email correctness.
   * On error, handles incorrect email scenarios.
   */
  onSubmit() {
    this.startOnSubmit();
    if (this.forgetPasswort.valid) {
      const formValue: ResetPassword = this.forgetPasswort.getRawValue();
      this.authService.resetPassword(formValue).subscribe({
        next: (response: any) => {
          this.isEmailCorrect(response);
        },
        error: (error: any) => {
          this.isEmailIncorrect(error);
        }
      });
    }
  }

  /**
   * Handles the submission process for the forget password form.
   * Marks all form controls as touched, sets the loading state,
   * and resets the result flag.
   */
  startOnSubmit() {
    this.isLoading = true;
    this.result = false;
    this.forgetPasswort.markAllAsTouched();
  }

  /**
   * Handles the response for email validation during the forget password process.
   * Updates the UI state, resets the form, and logs the user out after a delay.
   *
   * @param response - The response object containing the validation message.
   */
  isEmailCorrect(response: any) {
    this.toastMessage = response.message;
    this.errorOrCorrect = 'correct';
    this.result = true;
    this.forgetPasswort.reset();
    this.isLoading = false;
    setTimeout(() => {
      this.authService.logout()
    }, 3000);
  }

  /**
   * Handles email validation errors by extracting error messages,
   * updating the toast message, and setting the error state.
   *
   * @param error - The error object containing validation details.
   */
  isEmailIncorrect(error: any) {
    const errors = error.error || {};
    this.toastMessage = Object.values(errors)
      .flat()
      .join(' | ') || 'An unknown error occurred.';
    this.errorOrCorrect = 'error';
    this.result = true;
    this.isLoading = false;
  }

  clrearErrorToast() {
    this.result = false;
  }
}
