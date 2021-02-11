import { HttpClient, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { CACHE_DATABASE, HttpCacheHelper } from '@core/helpers/cache';
import { AppUtils } from '@core/helpers/utils';
import { AsyncDatabase, IndexedDB } from '@ezzabuzaid/document-storage';
import { asyncData } from 'test/fixture';
import { CacheInterceptor } from './cache.interceptor';

describe(`CacheInterceptor`, () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: CacheInterceptor,
                    multi: true
                },
                {
                    provide: CACHE_DATABASE,
                    useValue: new AsyncDatabase(new IndexedDB('cache')) // unused in test
                },
            ]
        });
    });

    it('should pass off if the request is not cachable', fakeAsync(() => {
        // Arrange
        const httpClient = TestBed.inject(HttpClient);
        const cacheHelper = TestBed.inject(HttpCacheHelper);
        spyOn(TestBed.inject(HttpCacheHelper), 'populate');


        // Act
        httpClient
            .configure({ CACHE: null })
            .delete('http://test.com/api/users')
            .subscribe();

        flush();

        // Assert
        expect(cacheHelper.populate).not.toHaveBeenCalled();
    }));

    it('should get the cache category from headers', fakeAsync(() => {
        // Arrange
        const httpClient = TestBed.inject(HttpClient);
        const cacheHelper = TestBed.inject(HttpCacheHelper);
        const CACHE_CATEGORY = AppUtils.generateAlphabeticString();
        spyOn(TestBed.inject(HttpCacheHelper), 'get').and.returnValue(asyncData(null));
        spyOn(TestBed.inject(HttpCacheHelper), 'populate');

        // Act
        httpClient
            .configure({
                CACHE: null,
            })
            .get('http://test.com/api')
            .subscribe();

        flush();

        // Assert
        expect(cacheHelper.populate).toHaveBeenCalledWith(CACHE_CATEGORY);
    }));

    it('should save the request response in the cache if it is not there {null, undefined}', fakeAsync(() => {
        // Arrange
        const httpClient = TestBed.inject(HttpClient);
        const cacheHelper = TestBed.inject(HttpCacheHelper);
        const httpMock = TestBed.inject(HttpTestingController);
        spyOn(TestBed.inject(HttpCacheHelper), 'get').and.returnValue(asyncData(null));
        spyOn(TestBed.inject(HttpCacheHelper), 'populate');
        const setSpy = spyOn(TestBed.inject(HttpCacheHelper), 'set');

        const url = `http://test.com/api?${ AppUtils.generateAlphabeticString() }=${ AppUtils.generateAlphabeticString() }`;

        // Act
        httpClient
            .configure({
                CACHE: {
                    category: AppUtils.generateAlphabeticString()
                }
            })
            .get(url)
            .subscribe();

        flush();

        const body = new Object();
        const mockRequest = httpMock.expectOne(url);
        mockRequest.flush(body);

        const [outgoingUrl, response] = setSpy.calls.argsFor(0);
        expect(outgoingUrl).toEqual(url);
        expect(response.body).toEqual(body);
    }));

    it('should get the request from the cache if it is there, not{null, undefined}', ((done) => {
        // Arrange
        const body = new Object();
        spyOn(TestBed.inject(HttpCacheHelper), 'get')
            .and.returnValue(asyncData(new HttpResponse({ body })));
        spyOn(TestBed.inject(HttpCacheHelper), 'populate');

        const url = `http://test.com/api?${ AppUtils.generateAlphabeticString() }=${ AppUtils.generateAlphabeticString() }`;

        // Act
        TestBed
            .inject(HttpClient)
            .configure({
            })
            .get(url)
            .subscribe((response) => {
                // Assert
                expect(response).toEqual(body);
                done();
            });

    }));
});
