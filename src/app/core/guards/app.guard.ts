import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad,
  Route, Router, RouterStateSnapshot,



  UrlSegment, UrlTree
} from '@angular/router';
import { ApplicationUser } from '@core/application-user';
import { Logger } from '@core/helpers/logger';
import { TokenHelper } from '@core/helpers/token';
import { Observable, of } from 'rxjs';
import { catchError, mapTo } from 'rxjs/operators';
const logger = new Logger('AppGuard');
@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate, CanLoad, CanActivateChild {
  constructor(
    private tokenHelper: TokenHelper,
    private applicationUser: ApplicationUser,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authenticate(state.url);
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    const path = this.router.getCurrentNavigation().extractedUrl.toString();
    return this.authenticate(path);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticate(state.url);
  }

  public authenticate(redirectUrl?) {
    if (this.tokenHelper.isAuthenticated) {
      if (this.tokenHelper.isExpired) {
        return this.applicationUser.refreshToken().pipe(catchError(() => of(false)), mapTo(true));
      }
      return of(true);
    }
    this.applicationUser.logout(redirectUrl);
    return of(false);
  }
}
