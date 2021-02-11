
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { UniversalInterceptor } from './universal.interceptor';

const configureTestModule = (request: Request) => {
    TestBed.configureTestingModule({
        imports: [HttpClientModule, HttpClientTestingModule],
        providers: [
            {
                provide: HTTP_INTERCEPTORS,
                useClass: UniversalInterceptor,
                multi: true
            },
            {
                provide: REQUEST,
                useValue: request
            }
        ]
    });
};

describe(`UniversalInterceptor`, () => {
    const protocol = 'testProtocol';
    const host = 'testHost';

    describe('absolute and protocol-relative url', () => {

        beforeEach(() => {
            configureTestModule({} as Request);
        });

        it('should not change absolute url', () => {
            const httpClient = TestBed.inject(HttpClient);
            const httpMock = TestBed.inject(HttpTestingController);

            const httpURL = 'http://test.com/api/users';
            const secureUrl = 'https://test.com/api/users';

            httpClient
                .get(httpURL)
                .subscribe();

            httpClient
                .get(secureUrl)
                .subscribe();

            httpMock.expectOne(httpURL);
            httpMock.expectOne(secureUrl);
        });

        it('should not change protocol relative url', () => {
            const httpClient = TestBed.inject(HttpClient);
            const httpMock = TestBed.inject(HttpTestingController);
            const protocolRelativeURL = '//test.com/api/users';

            httpClient
                .get(protocolRelativeURL)
                .subscribe();

            httpMock.expectOne(protocolRelativeURL);
        });
    });

    describe('relative url', () => {
        beforeEach(() => {
            configureTestModule({ protocol, host } as Request);
        });

        it('should update relative URL to absolute', () => {
            const httpClient = TestBed.inject(HttpClient);
            const httpMock = TestBed.inject(HttpTestingController);
            const firstRelative = 'api/users';
            const firstAbsolute = `${ protocol }://${ host }/${ firstRelative }`;
            const secondRelative = '/api/accounts';
            const secondAbsolute = `${ protocol }://${ host }${ secondRelative }`;

            httpClient
                .get(firstRelative)
                .subscribe();
            httpClient
                .get(secondRelative)
                .subscribe();

            httpMock.expectOne(firstAbsolute);
            httpMock.expectOne(secondAbsolute);
        });


    });
});
