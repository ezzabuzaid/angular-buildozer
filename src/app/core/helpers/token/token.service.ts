import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Constants } from '@core/constants';
import { LocalStorage, SessionStorage } from '@ezzabuzaid/document-storage';
import { PortalModel } from '@shared/models';
import { AppUtils } from '../utils';

const helper = new JwtHelperService();
const TOKEN_KEY = Constants.Application.TOKEN_KEY;
const REFRESH_TOKEN_KEY = Constants.Application.REFRESH_TOKEN_KEY;

@Injectable({
  providedIn: 'root'
})

export class TokenHelper {

  private get storage() {
    return this.oneTimeLogin ? this.session : this.local;
  }

  get token() {
    return this.storage.get<string>(TOKEN_KEY);
  }

  get refreshToken() {
    return this.storage.get<string>(REFRESH_TOKEN_KEY);
  }

  get decodedToken(): PortalModel.ITokenClaim {
    return this.isLogged ? helper.decodeToken(this.token) : {};
  }

  get isExpired(): boolean {
    return this.isLogged && helper.isTokenExpired(this.token);
  }

  get whenWillBeExpired() {
    return this.isLogged ? helper.getTokenExpirationDate(this.token) : Date.now();
  }

  get isLogged(): boolean {
    return AppUtils.notNullOrUndefined(this.token);
  }

  get oneTimeLogin() {
    return this.local.get<boolean>(Constants.Application.ONE_TIME);
  }

  set oneTimeLogin(value: boolean) {
    this.local.set(Constants.Application.ONE_TIME, AppUtils.inverse(value));
  }

  constructor(
    private readonly local: LocalStorage,
    private readonly session: SessionStorage,
  ) { }

  setToken(token: string, refreshToken: string, rememberMe = false) {
    this.oneTimeLogin = rememberMe;
    this.storage.set(REFRESH_TOKEN_KEY, refreshToken);
    this.storage.set(TOKEN_KEY, token);
  }

  deleteToken() {
    this.storage.delete(TOKEN_KEY);
    this.storage.delete(REFRESH_TOKEN_KEY);
    this.local.delete(Constants.Application.ONE_TIME);
  }

  public get isAuthenticated() {
    return this.isLogged;
  }

}
