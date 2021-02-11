import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AsyncDatabase, IndexedDB } from '@ezzabuzaid/document-storage';
import { RequestOptionsModule } from '@ezzabuzaid/ngx-request-options';
import { IRequestOptions } from '@shared/common';
import { CACHE_DATABASE } from './helpers/cache';
import { AppUtils, DateUtils } from './helpers/utils';
import { CacheInterceptor } from './interceptors/cache/cache.interceptor';
import { CancellationInterceptor } from './interceptors/cancellation/cancellation.interceptor';
import { ConnectivityInterceptor } from './interceptors/connectivity/connectivity.interceptor';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { MapperInterceptor } from './interceptors/mapper/mapper.interceptor';
import { ProgressInterceptor } from './interceptors/progress/progress.interceptor';
import { TeardownInterceptor } from './interceptors/teardown/teardown.interceptor';
import { UniversalInterceptor } from './interceptors/universal/universal.interceptor';
import { UrlInterceptor } from './interceptors/url/url.interceptor';


@NgModule({
  imports: [
    CommonModule,
    RequestOptionsModule.forRoot<IRequestOptions>({
      SNACKBAR: false,
      PROGRESS_BAR: true,
      FORM_PROGRESS_BAR: true,
      FULL_RESPONSE: false,
      CACHE: {
        // TODO: Take the new one from crm
        category: 'local_cache',
        // provider: CACHE_DATABASE,
        ttl: DateUtils.duration(60)
      }
    }),
  ],
  providers: [
    {
      provide: CACHE_DATABASE,
      useValue: new AsyncDatabase(new IndexedDB('cache'))
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ConnectivityInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MapperInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UrlInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CancellationInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UniversalInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TeardownInterceptor,
      multi: true
    },
  ]
})
export class CoreModule { }
