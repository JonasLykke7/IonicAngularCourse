import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { User } from '../../models/user.model';

export interface IAuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private _activeLogoutTimer: any;

  public get userIsAuthenticated(): Observable<boolean> {
    return this._user.asObservable().pipe(map((user: User) => {
      if (user) {
        return !!user.token;
      } else {
        return false;
      }
    }));
  }

  public get userID(): Observable<string> {
    return this._user.asObservable().pipe(map((user: User) => {
      if (user) {
        return user.id;
      } else {
        return null;
      }
    }));
  }

  public get token(): Observable<string> {
    return this._user.asObservable().pipe(map((user: User) => {
      if (user) {
        return user.token;
      } else {
        return null;
      }
    }));
  }

  constructor(
    private httpClient: HttpClient
  ) { }

  ngOnDestroy(): void {
    if (this._activeLogoutTimer) {
      clearTimeout(this._activeLogoutTimer);
    }
  }

  public autoLogin(): Observable<boolean> {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(map((storageData) => {
      if (!storageData || !storageData.value) {
        return null;
      }

      const parsedData: { userID: string, token: string, tokenExpirationDate: string, email: string } = JSON.parse(storageData.value);
      const expirationTime: Date = new Date(parsedData.tokenExpirationDate);

      if (expirationTime <= new Date()) {
        return null;
      }

      const user = new User(parsedData.userID, parsedData.email, parsedData.token, expirationTime);

      return user;
    }),
      tap((user) => {
        if (user) {
          this.autoLogout(user.tokenDuration);

          this._user.next(user);
        }
      }),
      map((user) => {
        return !!user;
      })
    );
  }

  public signup(email: string, password: string): Observable<IAuthResponseData> {
    return this.httpClient.post<IAuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(tap(this.setUserData.bind(this)));
  }

  public login(email: string, password: string): Observable<IAuthResponseData> {
    return this.httpClient.post<IAuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(tap(this.setUserData.bind(this)));
  }

  private setUserData(userData: IAuthResponseData): void {
    const expirationTime: Date = new Date(new Date().getTime() + (+userData.expiresIn * 1000));

    const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);

    this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);

    this._user.next(user);

    this.autoLogout(user.tokenDuration);
  }

  private storeAuthData(userID: string, token: string, tokenExpirationDate: string, email: string): void {
    const data: string = JSON.stringify({ userID: userID, token: token, tokenExpirationDate: tokenExpirationDate, email: email });

    Plugins.Storage.set({ key: 'authData', value: data });
  }

  public logout(): void {
    if (this._activeLogoutTimer) {
      clearTimeout(this._activeLogoutTimer);
    }

    Plugins.Storage.remove({ key: 'authData' });

    this._user.next(null);
  }

  private autoLogout(duration: number) {
    if (this._activeLogoutTimer) {
      clearTimeout(this._activeLogoutTimer);
    }

    this._activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }
}
