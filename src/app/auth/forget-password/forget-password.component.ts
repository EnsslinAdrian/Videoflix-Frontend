import { Component } from '@angular/core';
import { TypographyComponent } from "../../ui-component/typography/typography.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorToastComponent } from "../../ui-component/error-toast/error-toast.component";
import { AuthService } from '../../../services/authentication/auth.service';

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
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  onSubmit() {
    this.startOnSubmit();
    if (this.forgetPasswort.valid) {
      this.authService.resetPassword(this.forgetPasswort.value).subscribe({
        next: (response: any) => {
          this.isEmailCorrect(response);
        },
        error: (error: any) => {
          this.isEmailIncorrect(error);
        }
      });
    }
  }

  startOnSubmit() {
    this.isLoading = true;
    this.result = false;
    this.forgetPasswort.markAllAsTouched();
  }

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
