import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { environment } from '@environments/environment';
import { TranslateLoader } from '@ngx-translate/core';
import { LanguageService } from './language.service';

@Injectable()
export class LanguageLoader implements TranslateLoader {

    constructor(
        private readonly injector: Injector
    ) { }

    getTranslation() {
        const http = this.injector.get(HttpClient);
        const languageService = this.injector.get(LanguageService);
        return http
            .configure({
                CACHE: environment.production
                    ? { category: 'language' }
                    : null,
            })
            .get(`assets/i18n/${ languageService.language }.json`);
    }
}
