import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { AuthService } from '../services/authentication/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'videoflix_frontend';
  authReady$: any;

  constructor(private authService: AuthService) { }

  async ngOnInit() {
    this.authReady$ = this.authService.authReady$;
    this.authService.checkAuthStatusAndRefresh();
    this.authService.authReady$.subscribe(ready => {});
  }

}
