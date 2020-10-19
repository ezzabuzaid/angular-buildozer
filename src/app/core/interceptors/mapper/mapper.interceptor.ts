import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUtils } from '@core/helpers/utils';
import { RequestOptions } from '@ezzabuzaid/ngx-request-options';
import { IRequestOptions } from '@shared/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MapperInterceptor implements HttpInterceptor {

    constructor(
        private readonly requestData: RequestOptions<IRequestOptions>
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request)
            .pipe(
                map((response) => {
                    const fullResponse = this.requestData.get(request, 'FULL_RESPONSE');
                    const defaultUrl = this.requestData.get(request, 'DEFAULT_URL');
                    if (response instanceof HttpResponse && defaultUrl && AppUtils.not(fullResponse)) {
                        return response.clone({ body: response.body.data });
                    }
                    return response;
                })
            );
    }


}
