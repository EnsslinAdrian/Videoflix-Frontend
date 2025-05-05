import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TypographyComponent } from "../../ui-component/typography/typography.component";
import { AuthService } from '../../../services/authentication/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    TypographyComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showIntro = false;
  showLogo = false;
  isFirstVisit = false;
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    const played = sessionStorage.getItem('animationPlayed');
    this.isFirstVisit = !played;

    if (played) {
      this.showLogo = true;
    } else {
      this.showIntro = true;

      setTimeout(() => {
        this.showIntro = false;
        this.showLogo = true;
        sessionStorage.setItem('animationPlayed', 'true');
      }, 3300);
    }
  }

  logout() {
    this.authService.logout()
  }
}
