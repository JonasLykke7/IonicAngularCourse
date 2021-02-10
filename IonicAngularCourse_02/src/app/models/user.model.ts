export class User {
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) { }

  public get token() {
    if (!this._tokenExpirationDate || this._tokenExpirationDate <= new Date()) {
      return null;
    }

    return this._token;
  }

  public get tokenDuration() {
    if (!this.token) {
      return 0;
    }

    return this._tokenExpirationDate.getTime() - new Date().getTime();
  }
}
