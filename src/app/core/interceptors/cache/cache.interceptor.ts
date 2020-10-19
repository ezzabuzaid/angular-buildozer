import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpCacheHelper } from '@core/helpers/cache';
import { Logger } from '@core/helpers/logger';
import { AppUtils } from '@core/helpers/utils';
import { RequestOptions } from '@ezzabuzaid/ngx-request-options';
import { REQUEST_OPTIONS_DEFAULT } from '@ezzabuzaid/ngx-request-options';
import { IRequestOptions } from '@shared/common';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
const log = new Logger('CacheInterceptor');
@Injectable()
export class CacheInterceptor implements HttpInterceptor {

    constructor(
        private cacheHelper: HttpCacheHelper,
        private requestOptions: RequestOptions<IRequestOptions>,
        @Inject(REQUEST_OPTIONS_DEFAULT) private defaultRequestOptions: IRequestOptions
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const cacheConfig = this.requestOptions.get(req, 'CACHE');
        if (AppUtils.not(cacheConfig)) {
            return next.handle(req);
        }

        this.cacheHelper.populate(cacheConfig.category ?? this.defaultRequestOptions.CACHE.category);

        return this.cacheHelper.get(req.urlWithParams)
            .pipe(switchMap(response => {
                if (AppUtils.isNullorUndefined(response)) {
                    return next.handle(req)
                        .pipe(map((event) => {
                            if (event instanceof HttpResponse) {
                                this.cacheHelper.set(req.urlWithParams, event.clone(), cacheConfig.ttl ?? this.defaultRequestOptions.CACHE.ttl);
                            }
                            return event;
                        }));
                } else {
                    log.debug(`${ req.method } Request for ${ req.urlWithParams } fetched from cache`);
                    return of(response);
                }
            }));
    }
}
