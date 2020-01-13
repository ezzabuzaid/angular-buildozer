import { Injectable, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '@environments/environment';
import { DOCUMENT } from '@angular/common';
import { Constants } from '@core/constants';
import { LocalStorage } from '@ezzabuzaid/document-storage';

export enum Direction {
  LTR = 'ltr',
  RTL = 'rtl'
}

export enum ELanguage {
  EN = 'en',
  AR = 'ar'
}

export interface LanguageChange {
  lang: ELanguage;
  dir: Direction;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private directionSubject = new Subject<LanguageChange>();
  private supportedLanguage = environment.supportedLanguages;
  private defaultLanguage = environment.defaultLanguage as ELanguage;
  constructor(
    private translateService: TranslateService,
    private localStorage: LocalStorage,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.translateService.addLangs(this.supportedLanguage);
  }

  populate(defaulLanguage: ELanguage = this.defaultLanguage) {
    this.translateService.setDefaultLang(this.defaultLanguage);
    const languageToUsed = this.language || defaulLanguage || (this.translateService.getBrowserCultureLang().split('-')[0] as ELanguage);
    return this.changeLanguage(languageToUsed);
  }

  /**
   *
   * @param language Language to use | eg. 'en' or 'ar'
   */
  changeLanguage(language: ELanguage): LanguageChange {
    this.language = language;
    this.translateService.use(language);
    this.document.dir = this.direction;
    this.document.body.dir = this.direction;
    const returnValue = { dir: this.direction, lang: language };
    this.directionSubject.next(returnValue);
    return returnValue;
  }

  onChange(): Observable<LanguageChange> {
    return this.directionSubject.asObservable();
  }

  set language(language: ELanguage) {
    this.localStorage.set(Constants.Application.LANGUAGE_KEY, language);
  }

  get language() {
    return (this.localStorage.get(Constants.Application.LANGUAGE_KEY) || this.defaultLanguage) as ELanguage;
  }

  get direction(): Direction {
    return this.language === ELanguage.EN ? Direction.LTR : Direction.RTL;
  }

  get isRtl() {
    return this.direction === Direction.RTL;
  }

}
