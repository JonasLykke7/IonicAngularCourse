import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated: boolean = true;
  private _userID: string = 'xyz';

  public get userIsAuthenticated(): boolean {
    return this._userIsAuthenticated;
  }

  public get userID(): string {
    return this._userID;
  }

  constructor(
    private router: Router
  ) { }

  public login(): void {
    this._userIsAuthenticated = true;

    this.router.navigateByUrl('/places/tabs/discover');
  }

  public logout(): void {
    this._userIsAuthenticated = false;

    this.router.navigateByUrl('/auth');
  }
}
