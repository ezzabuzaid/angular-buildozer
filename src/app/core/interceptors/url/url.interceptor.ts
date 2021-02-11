import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestOptions } from '@ezzabuzaid/ngx-request-options';
import { IRequestOptions } from '@shared/common';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class UrlInterceptor implements HttpInterceptor {

    constructor(
        private requestOptions: RequestOptions<IRequestOptions>
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let url = request.url;
        if (!/^(http|https):/i.test(request.url)) {
            url = environment.endpointUrl + request.url;
        }
        return next.handle(this.requestOptions.clone(request, { url }));
    }

}
