import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { AppUtils } from '@core/helpers/utils';
import { environment } from '@environments/environment';
import { apiUrl } from 'test/fixture';
import { UrlInterceptor } from './url.interceptor';

describe(`UrlInterceptor`, () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: UrlInterceptor,
                    multi: true
                },
            ],
        });
    });


    it('should prefix the incoming url with the url from the environment when the url does not start with http or https', fakeAsync(() => {
        // Arrange
        const http = TestBed.inject(HttpClient);
        const httpMock = TestBed.inject(HttpTestingController);
        const urlPortion = AppUtils.generateAlphabeticString();

        // Act
        http.get(urlPortion).subscribe();
        flush();

        // Assert
        const { request } = httpMock.expectOne(environment.endpointUrl + urlPortion);
        expect(request.url).toMatch(apiUrl(urlPortion));
    }));

    it('should not modify any url starts with http', fakeAsync(() => {
        // Arrange
        const http = TestBed.inject(HttpClient);
        const httpMock = TestBed.inject(HttpTestingController);
        const url = `http://${ AppUtils.generateAlphabeticString() }`;

        // Act
        http.get(url).subscribe();
        flush();

        // Assert
        const { request } = httpMock.expectOne(url);
        expect(request.url).toMatch(url);
    }));

    it('should not modify any url starts with https', fakeAsync(() => {
        // Arrange
        const http = TestBed.inject(HttpClient);
        const httpMock = TestBed.inject(HttpTestingController);
        const url = `https://${ AppUtils.generateAlphabeticString() }`;

        // Act
        http.get(url).subscribe();
        flush();

        // Assert
        const { request } = httpMock.expectOne(url);
        expect(request.url).toMatch(url);
    }));

    afterAll(() => {
        TestBed.inject(HttpTestingController).verify();
    });

});
