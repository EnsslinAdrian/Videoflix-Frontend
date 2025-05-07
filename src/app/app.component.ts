import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { AuthService } from '../services/authentication/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'videoflix_frontend';
  authReady$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.authReady$ = this.authService.authReady$;
  }

  /**
  * Lifecycle hook that is called after Angular has initialized the component.
  * Sets up the authentication readiness observable and triggers an authentication status check.
  * Subscribes to the authentication readiness observable for further handling.
  *
  * @returns {Promise<void>} A promise that resolves when the initialization is complete.
  */
  async ngOnInit(): Promise<void> {
    this.authService.checkAuthStatusAndRefresh();
    this.authService.authReady$.subscribe(ready => { });
  }

}
