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

  /**
   * Lifecycle hook that is called after the component is initialized.
   * Determines whether to show the intro animation or directly display the logo
   * based on the presence of a session storage flag. If the animation has not
   * been played, it sets a timeout to transition from the intro to the logo
   * and updates the session storage.
   */
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

  /**
   * Logs the user out by invoking the logout method from the authentication service.
   */
  logout() {
    this.authService.logout()
  }
}
