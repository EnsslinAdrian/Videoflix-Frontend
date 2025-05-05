import { Component } from '@angular/core';
import { TypographyComponent } from "../../ui-component/typography/typography.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { passwordMatch } from '../../../validators/password.validator';
import { CommonModule } from '@angular/common';
import { ErrorToastComponent } from "../../ui-component/error-toast/error-toast.component";
import { AuthService } from '../../../services/authentication/auth.service';

@Component({
  selector: 'app-new-password',
  imports: [
    TypographyComponent,
    ReactiveFormsModule,
    CommonModule,
    ErrorToastComponent
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {
  result: boolean = false;
  errorOrCorrect: 'error' | 'correct' = 'error';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  toastMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  newPassword = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[A-Z])(?=.*\\d).+$")]),
    confirmPassword: new FormControl('', [Validators.required]),
  },
    { validators: passwordMatch }
  );

  onSubmit() {
    this.startOnSubmit();
    const uid = this.route.snapshot.queryParamMap.get('uid');
    const token = this.route.snapshot.queryParamMap.get('token');
    const newPassword = this.newPassword.get('password')?.value as string;
    if (this.newPassword.valid) {
      this.authService.confirmNewPassword(uid, token, newPassword).subscribe({
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
    this.newPassword.markAllAsTouched();
  }

  isEmailCorrect(response: any) {
    this.toastMessage = response.message;
    this.errorOrCorrect = 'correct';
    this.result = true;
    this.newPassword  .reset();
    this.isLoading = false;
    setTimeout(() => {
      this.router.navigate(['/login']);
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

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
