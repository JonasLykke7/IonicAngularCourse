import { Component } from '@angular/core';

import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private authService: AuthService
  ) { }

  public onLogout(): void {
    this.authService.logout();
  }
}
