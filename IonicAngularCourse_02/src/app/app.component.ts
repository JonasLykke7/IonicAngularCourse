import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private _authSubscription: Subscription;
  private _previousAuthState: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this._authSubscription = this.authService.userIsAuthenticated.subscribe(isAuth => {
      if (!isAuth && this._previousAuthState !== isAuth) {
        this.router.navigate(['/auth']);
      }

      this._previousAuthState = isAuth;
    });
  }

  ngOnDestroy(): void {
    if (this._authSubscription) {
      this._authSubscription.unsubscribe();
    }
  }

  public onLogout(): void {
    this.authService.logout();
  }
}
