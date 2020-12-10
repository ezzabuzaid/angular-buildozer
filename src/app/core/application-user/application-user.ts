import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '@core/constants';
import { SubjectFactory } from '@core/helpers/subject-factory';
import { TokenHelper } from '@core/helpers/token';
import { environment } from '@environments/environment';
import { NAVIGATOR } from '@shared/common';
import { PortalModel, ResponseModel } from '@shared/models';
import { from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
declare const biri: () => Promise<string>;
@Injectable({
  providedIn: 'root'
})

// FIXME: move it to models and the functions to auth.service // See FiberRush
export class ApplicationUser extends SubjectFactory<boolean> {

  constructor(
    private readonly http: HttpClient,
    private readonly tokenHelper: TokenHelper,
    private readonly router: Router,
    @Inject(NAVIGATOR) private readonly navigator: Navigator,
    @Inject(PLATFORM_ID) private readonly platformId: any,
  ) {
    super(tokenHelper.isAuthenticated);
  }

  public login(payload: PortalModel.ILoginRequest, rememberMe: boolean) {
    return this.http
      .post<PortalModel.ILoginResponse>(Constants.API.PORTAL.login, payload)
      .pipe(
        tap((data) => {
          this.notify(this.tokenHelper.isAuthenticated);
          this.tokenHelper.setToken(data.token, data.refreshToken, rememberMe);
        })
      );
  }

  register(payload: PortalModel.IRegister) {
    return this.http
      .configure({ FULL_RESPONSE: true })
      .post<ResponseModel<unknown>>(Constants.API.USERS.base, payload);
  }

  refreshToken() {
    return from(this.getDeviceUUID())
      .pipe(
        switchMap((uuid) => {
          return this.http
            .post<PortalModel.ILoginResponse>(Constants.API.PORTAL.refreshtoken, new PortalModel.RefreshToken(
              this.tokenHelper.token,
              this.tokenHelper.refreshToken,
            ));
        }),
        tap((data) => {
          this.tokenHelper.setToken(data.token, data.refreshToken, this.tokenHelper.oneTimeLogin);
        })
      );
  }

  public checkIfAccountIsExist(payload: PortalModel.IRegister) {
    return this.http.post<PortalModel.AccountVerifiedResponse>(Constants.API.PORTAL.ACCOUNT_VERIFIED, payload);
  }

  public sendPincode(payload: PortalModel.ISendPincode) {
    return this.http.post(Constants.API.PORTAL.SEND_PINCODE, payload);
  }

  public checkPincode(payload: PortalModel.ICheckPincode) {
    return this.http.post(Constants.API.PORTAL.CHECK_PINCODE, payload);
  }

  public resetPassword(payload: PortalModel.IResetPassword) {
    return this.http.post(Constants.API.PORTAL.RESET_PASSWORD, payload);
  }

  public sendVerificationEmail() {
    return this.http.get(Constants.API.PORTAL.sendverificationemail);
  }

  public async logout(redirectUrl = this.router.url) {
    if (this.isBrowser) {
      const blob = new Blob([JSON.stringify({})], {
        [Constants.Application.DEVICE_UUID as any]: await this.getDeviceUUID()
      });
      this.navigator.sendBeacon(`${ environment.endpointUrl }${ Constants.API.PORTAL.logout }`, blob);
    }
    this.router.navigate([Constants.Routing.LOGIN.withSlash], {
      queryParams: {
        [Constants.Application.REDIRECT_URL]: redirectUrl ?? undefined
      }
    });
    this.tokenHelper.deleteToken();
    this.notify(this.tokenHelper.isAuthenticated);
  }

  getDeviceUUID() {
    return Promise.resolve(this.navigator.userAgent);
  }

  oneTimeLogin() {
    return this.tokenHelper.oneTimeLogin;
  }

  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  get isAuthenticated() {
    return this.tokenHelper.isAuthenticated;
  }
}
