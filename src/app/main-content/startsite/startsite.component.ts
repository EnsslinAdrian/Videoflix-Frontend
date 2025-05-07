import { Component } from '@angular/core';
import { TypographyComponent } from "../../ui-component/typography/typography.component";
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/authentication/auth.service';

@Component({
  selector: 'app-startsite',
  imports: [
    CommonModule,
    TypographyComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './startsite.component.html',
  styleUrl: './startsite.component.scss'
})
export class StartsiteComponent {

  result: boolean = false;
  errorOrCorrect: 'error' | 'correct' = 'error';
  showPassword: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  startsite = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  /**
   * Handles the form submission for the startsite component.
   * Marks all form controls as touched, validates the form, 
   * caches the email value, and navigates to the sign-up page if valid.
   */
  onSubmit() {
    this.startsite.markAllAsTouched();
    if (this.startsite.valid) {
      this.authService.cacheEmail = this.startsite.value.email;
      this.router.navigate(['/sign-up']);
      return;
    }
  }

  /**
   * Clears the error toast by resetting the result state to false.
   */
  clrearErrorToast() {
    this.result = false;
  }
}
