import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRequestOptions } from '@shared/common';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

import { RequestOptions } from '@ezzabuzaid/ngx-request-options';
@Injectable()
export class UrlInterceptor implements HttpInterceptor {

  constructor(private readonly requestOptions: RequestOptions<IRequestOptions>) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url = request.url;
    console.log(this.requestOptions);
    if (this.requestOptions.get(request, 'DEFAULT_URL')) {
      url = environment.endpointUrl + request.url;
    }
    return next.handle(this.requestOptions.clone(request, { url }));
  }

}
