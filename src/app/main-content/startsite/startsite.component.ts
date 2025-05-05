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

  onSubmit() {
    this.startsite.markAllAsTouched();
    if (this.startsite.valid) {
      this.authService.cacheEmail = this.startsite.value.email;
      this.router.navigate(['/sign-up']);
      return;
    }
  }

  clrearErrorToast() {
    this.result = false;
  }
}
