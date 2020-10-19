import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class CancellationInterceptor implements HttpInterceptor {
    subscription = new Subject();

    constructor(
        router: Router
    ) {
        router.events.subscribe(event => {
            if (event instanceof ActivationEnd) {
                this.subscription.next();
            }
        });
    }

    intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
        return next.handle(req).pipe(takeUntil(this.subscription));
    }
}
