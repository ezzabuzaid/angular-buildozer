import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ELanguage, LanguageService } from '@core/helpers/language';
import { Logger } from '@core/helpers/logger';
import { ServiceWorkerUtils } from '@core/helpers/service-worker/service-worker-update.service';
import { AppUtils } from '@core/helpers/utils';
import { environment } from '@environments/environment';
import { UserService } from '@shared/account';
import { Connectivity, NAVIGATOR } from '@shared/common';
import { AnalyticsService } from '@shared/services/analytics';
import { SeoService } from '@shared/services/seo/seo.service';
import { partition } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private readonly languageService: LanguageService,
    private readonly renderer: Renderer2,
    private readonly seoService: SeoService,
    private readonly snackbar: MatSnackBar,
    private readonly serviceWorkerUtils: ServiceWorkerUtils,
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: any,
    @Inject(NAVIGATOR) private readonly navigator: Navigator,
    private readonly analyticService: AnalyticsService,
    private readonly userService: UserService,
    private readonly connectivity: Connectivity
  ) {

    // STUB if requestSubscription reject the subscribeToPushNotification result must be false
    // STUB if requestSubscription reject the pushNotificationService.subscribe must not be called

    // STUB if requestSubscription success the subscribeToPushNotification result must be true
    // STUB if requestSubscription success the pushNotificationService.subscribe must be called

    // const subscribeToPushNotification = () => from(this.serviceWorkerPushService
    // .requestSubscription({ serverPublicKey: environment.vapidPublicKey }))
    //     .pipe(
    //         tap((subscription) => {
    //             console.log('Subscription => ', subscription);
    //         }),
    //         switchMap((subscription) => this.pushNotificationService.subscribe(subscription)),
    //         mapTo(true),
    //         catchError(() => of(false)),
    //     );

    // STUB if requestSubscription reject the subscribeToPushNotification result must be false
    // STUB if requestSubscription reject the pushNotificationService.subscribe must not be called

    // STUB if requestSubscription success the subscribeToPushNotification result must be true
    // STUB if requestSubscription success the pushNotificationService.subscribe must be called

    // this.serviceWorkerPushService.subscription
    //     .pipe(
    //         takeUntil(this._unsubscribeAll),
    //         switchMap((subscription) => {
    //             console.log('Subscription => ', subscription);
    //             return tryOrComplete<any>(
    //                 AppplicationUtils.isNullorUndefined(subscription),
    //                 () => subscribeToPushNotification(),
    //                 true
    //             );
    //         }),
    //         tap((notificationEnabled) => console.log('notificationEnabled', notificationEnabled)),
    //         filter((notificationEnabled) => notificationEnabled),
    //         switchMap(() => this.serviceWorkerPushService.messages)
    //     )
    //     .subscribe((message) => {
    //         console.log('Message from SWpush => ', message);
    //         // the service worker should focus the opened if it was in foreground
    //         // after that sh
    //     });
    this.renderer.addClass(this.document.body, 'default-theme');
    this.seoService.populate({
      title: 'Angular Buildozer Boilerplate',
      description: 'Angular made easy',
      image: 'https://www.archer.ie/wp-content/uploads/2019/05/Angular_2.jpg',
      keywords: ['angular', 'backbone', 'ezzabuzaid', 'buildozer', 'boilerplate', 'angular starter', 'seed', 'angular seed'].join(',')
    });

  }

  ngOnInit() {
    if (environment.production) {
      Logger.enableProductionMode();
    }

    if (this.isBrowser && environment.production) {
      this.analyticService.recordPageNavigation();

      this.serviceWorkerUtils.checkEveryHour(0.001).subscribe();
      this.serviceWorkerUtils.updateAvailable
        .pipe(switchMap(() => this.snackbar.open('An update is available', 'Activate!').onAction()))
        .subscribe(() => {
          location.reload();
        });
      this.serviceWorkerUtils.updateActivated
        .subscribe((updte) => {
          this.snackbar.open('The application has been updated');
        });
    }

    if (this.isBrowser) {

      this.languageService.populate(ELanguage.EN);

      // TODO PWA Checks if install popup should be appear
      const isIos = () => /iphone|ipad|ipod/.test(this.navigator.userAgent.toLowerCase());
      const isInStandaloneMode = () => ('standalone' in this.navigator) && (this.navigator['standalone']);
      if (isIos() && !isInStandaloneMode()) {
        // Popup function!!
      }

      const [$offline, $online] = partition(this.connectivity.observe(), AppUtils.isFalsy);
      const noConnectionClass = 'backdrop';
      const affectedElement = this.document.body;
      $online.subscribe(() => {
        this.snackbar.dismiss();
        this.renderer.removeClass(affectedElement, noConnectionClass);
      })
      $offline.pipe(
        switchMap(() => {
          this.renderer.addClass(affectedElement, noConnectionClass);
          return this.snackbar.open(
            'No connection, please check you internet!',
            'Refresh!',
            { duration: 1000 * 1000 })
            .onAction();
        }),
        tap(() => location.reload())
      )
        .subscribe()
    }

  }

  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  @HostListener('window:unload')
  ngOnDestroy() {
    if (this.userService.oneTimeLogin()) {
      this.userService.logout();
      return '';
    }
  }

}

