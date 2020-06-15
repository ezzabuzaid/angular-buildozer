import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TokenHelper } from '@core/helpers/token';
import { UserService } from '@shared/account';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate, CanLoad, CanActivateChild {
  constructor(
    private readonly tokenHelper: TokenHelper,
    private readonly userService: UserService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authenticate(state.url);
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.authenticate();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticate(state.url);
  }


  public authenticate(redirectUrl?: string) {
    if (!this.tokenHelper.isAuthenticated) {
      this.userService.logout(redirectUrl);
      return false;
    }
    return true;
  }

}
