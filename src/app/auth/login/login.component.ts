import { Component } from '@angular/core';
import { TypographyComponent } from "../../ui-component/typography/typography.component";
import { RouterLink, Router } from '@angular/router';
import { ErrorToastComponent } from "../../ui-component/error-toast/error-toast.component";
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/authentication/auth.service';
import { Login } from '../../../interfaces/auth';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    TypographyComponent,
    RouterLink,
    ErrorToastComponent,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  result: boolean = false;
  errorOrCorrect: 'error' | 'correct' = 'error';
  showPassword: boolean = false;
  isLoading = false;
  toastMessage: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  login = new FormGroup({
    email: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.pattern("^(?=.*[A-Z])(?=.*\\d).+$")]}),
  });

  /**
   * Handles the submission of the login form.
   * Validates the form, initiates the login process, and processes the response.
   */
  onSubmit() {
    this.startOnSubmit();
    if (this.login.valid) {
      const formValue: Login = this.login.getRawValue();
      this.authService.login(formValue).subscribe({
        next: (response: any) => {
          this.authService.setAccessToken(response.access);
          this.isLoginCorrect(response);
        },
        error: (error: any) => {
          this.isLoginIncorrect(error);
        }
      });
    }
  }

  /**
   * Handles the submission process for the login form.
   * Marks all form controls as touched, sets the loading state,
   * and resets the result flag.
   */
  startOnSubmit() {
    this.isLoading = true;
    this.result = false;
    this.login.markAllAsTouched();
  }

  /**
   * Handles the successful login response by displaying a success message,
   * resetting the login form, stopping the loading indicator, and navigating
   * to the home page after a short delay.
   *
   * @param response - The response object containing the login success message.
   */
  isLoginCorrect(response: any) {
    this.toastMessage = response.message;
    this.errorOrCorrect = 'correct';
    this.result = true;
    this.login.reset();
    this.isLoading = false;
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1500);
  }

  /**
   * Handles login errors by processing the error response, displaying a toast message,
   * resetting the password field, and updating the component state.
   *
   * @param error - The error object received from the login attempt.
   */
  isLoginIncorrect(error: any) {
    const errors = error.error || {};
    this.toastMessage = Object.values(errors)
      .flat()
      .join(' | ') || 'An unknown error occurred.';
    this.errorOrCorrect = 'error';
    this.result = true;
    this.login.get('password')?.reset();
    this.isLoading = false;
  }

  /**
   * Clears the error toast by resetting the result state to false.
   */
  clrearErrorToast() {
    this.result = false;
  }

  /**
   * Toggles the visibility of the password input field.
   *
   * @param boolean - A boolean value indicating whether to show or hide the password.
   */
  togglePasswordVisibility(boolean: boolean) {
    this.showPassword = boolean;
  }
}
