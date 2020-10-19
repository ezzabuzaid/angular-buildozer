import { isPlatformBrowser } from '@angular/common';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Connectivity } from '@shared/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class ConnectivityInterceptor implements HttpInterceptor {

    constructor(
        private readonly snackbar: MatSnackBar,
        @Inject(PLATFORM_ID) private readonly platformId: any,
        private readonly connectivity: Connectivity,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (isPlatformBrowser(this.platformId)) {
            if (this.connectivity.isOffline) {
                this.snackbar.open('Internet connection is not active, please check your connection');
                return of();
            }
        } else {
            return of();
        }

        return next.handle(request);
    }

}
