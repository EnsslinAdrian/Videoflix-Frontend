import { Component } from '@angular/core';
import { TypographyComponent } from "../../ui-component/typography/typography.component";
import { RouterLink, Router } from '@angular/router';
import { ErrorToastComponent } from "../../ui-component/error-toast/error-toast.component";
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/authentication/auth.service';

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
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[A-Z])(?=.*\\d).+$")]),
  });

  onSubmit() {
    this.startOnSubmit();
    if (this.login.valid) {
      this.authService.login(this.login.value).subscribe({
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

  startOnSubmit() {
    this.isLoading = true;
    this.result = false;
    this.login.markAllAsTouched();
  }

  isLoginCorrect(response: any) {
    this.toastMessage = response.message;
    this.errorOrCorrect = 'correct';
    this.result = true;
    this.login.reset();
    this.isLoading = false;
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 2000);
  }

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

  clrearErrorToast() {
    this.result = false;
  }

  togglePasswordVisibility(boolean: boolean) {
    this.showPassword = boolean;
  }
}
