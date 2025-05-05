import { Component } from '@angular/core';
import { TypographyComponent } from "../../ui-component/typography/typography.component";
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorToastComponent } from "../../ui-component/error-toast/error-toast.component";
import { passwordMatch } from '../../../validators/password.validator';
import { AuthService } from '../../../services/authentication/auth.service';


@Component({
  selector: 'app-sign-up',
  imports: [
    TypographyComponent,
    ReactiveFormsModule,
    CommonModule,
    ErrorToastComponent
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  result: boolean = false;
  errorOrCorrect: 'error' | 'correct' = 'error';
  toastMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  signUp = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[A-Z])(?=.*\\d).+$"), Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  },
    { validators: passwordMatch }
  );

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Sets the cached email value from the authentication service to the email form control.
   */
  ngOnInit() {
    this.signUp.get('email')?.setValue(this.authService.cacheEmail);
  }

  /**
   * Handles the submission of the sign-up form.
   * Validates the form and triggers the registration process via the AuthService.
   * On success, processes the response; on error, handles the error appropriately.
   */
  onSubmit() {
    this.startOnSubmit();
    if (this.signUp.valid) {
      this.authService.register(this.signUp.value).subscribe({
        next: (response: any) => {
          this.isRegisterCorrect(response);
        },
        error: (error: any) => {
          this.isRegisterIncorrect(error);
        }
      });
    }
  }

  /**
   * Handles the submission process for the sign-up form.
   *
   * - Sets the `isLoading` flag to `true` to indicate that the submission process has started.
   * - Resets the `result` property to `false`.
   * - Marks all form controls in the `signUp` form group as touched to trigger validation messages.
   */
  startOnSubmit() {
    this.isLoading = true;
    this.result = false;
    this.signUp.markAllAsTouched();
  }

  /**
   * Handles the successful registration response.
   * Updates the UI state to indicate success, resets the form,
   * and stops the loading indicator.
   *
   * @param response - The response object containing the registration message.
   */
  isRegisterCorrect(response: any) {
    this.toastMessage = response.message;
    this.errorOrCorrect = 'correct';
    this.result = true;
    this.signUp.reset();
    this.isLoading = false;
  }

  /**
   * Handles registration errors by processing the error response,
   * displaying a toast message, resetting password fields,
   * and updating the component state.
   *
   * @param error - The error object received from the registration attempt.
   */
  isRegisterIncorrect(error: any) {
    const errors = error.error || {};
    this.toastMessage = Object.values(errors)
      .flat()
      .join(' | ') || 'An unknown error occurred.';
    this.errorOrCorrect = 'error';
    this.result = true;
    this.signUp.get('password')?.reset();
    this.signUp.get('confirmPassword')?.reset();
    this.isLoading = false;
  }

  /**
   * Clears the error toast by resetting the result state to false.
   */
  clrearErrorToast() {
    this.result = false;
  }

  /**
   * Toggles the visibility of the password or confirm password field.
   *
   * @param field - Specifies which field's visibility to toggle.
   *                Accepts either 'password' or 'confirmPassword'.
   */
  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
