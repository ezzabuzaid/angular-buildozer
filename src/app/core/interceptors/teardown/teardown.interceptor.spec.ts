import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationUser } from '@core/application-user';
import { TokenHelper } from '@core/helpers/token';
import { AppUtils } from '@core/helpers/utils';
import { TeardownInterceptor } from './teardown.interceptor';

describe(`TeardownInterceptor`, () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: TeardownInterceptor,
                    multi: true
                },
            ],
        });

    });

    it('should add authorization header to the request', () => {
        // Arrange
        const urlPortion = AppUtils.generateAlphabeticString();
        const token = AppUtils.generateAlphabeticString();
        spyOnProperty(TestBed.inject(TokenHelper), 'token', 'get').and.returnValue(token);

        // Act
        TestBed.inject(HttpClient)
            .get(urlPortion)
            .subscribe(() => { }, () => { });

        // Assert
        const mockRequest = TestBed
            .inject(HttpTestingController)
            .expectOne(urlPortion);
        mockRequest.flush(null);

        expect(mockRequest.request.headers.get('Authorization')).toMatch(token);

    });

    it('should show a snackbar with custom message if request status is 500', (() => {
        // Arrange
        const urlPortion = AppUtils.generateAlphabeticString();
        spyOn(TestBed.inject(MatSnackBar), 'open');
        // Act
        TestBed.inject(HttpClient)
            .get(urlPortion)
            .subscribe(() => { }, () => { });

        // Assert
        TestBed
            .inject(HttpTestingController)
            .expectOne(urlPortion)
            .flush({}, new HttpErrorResponse({
                status: 500,
                statusText: 'Server Error',
            }));
        expect(TestBed.inject(MatSnackBar).open).toHaveBeenCalledWith('Internal server error. Please try again later.');
    }));

    it('should show a snackbar with custom message if request status is 0', (() => {
        // Arrange
        const urlPortion = AppUtils.generateAlphabeticString();
        spyOn(TestBed.inject(MatSnackBar), 'open');
        // Act
        TestBed.inject(HttpClient)
            .get(urlPortion)
            .subscribe(() => { }, () => { });

        // Assert
        TestBed
            .inject(HttpTestingController)
            .expectOne(urlPortion)
            .flush({}, new HttpErrorResponse({
                status: 0,
                statusText: 'Unknown Error',
            }));
        expect(TestBed.inject(MatSnackBar).open).toHaveBeenCalledWith('Please check youre internet or VPN then try again.');
    }));

    // TODO: rewrite the test case
    it('should retry to refresh the token if the request status is 401', (() => {
        // Arrange
        const urlPortion = AppUtils.generateAlphabeticString();
        spyOn(getTeardownInterceptor(), 'tryRefreshToken');

        // Act
        TestBed.inject(HttpClient)
            .get(urlPortion)
            .subscribe(() => { }, () => { });

        // Assert
        TestBed
            .inject(HttpTestingController)
            .expectOne(urlPortion)
            .flush({}, new HttpErrorResponse({ status: 401, statusText: 'Unauthorised' }));

        expect(getTeardownInterceptor().tryRefreshToken).toHaveBeenCalledTimes(1);
    }));

    afterAll(() => {
        TestBed.inject(HttpTestingController).verify();
    });

    function getTeardownInterceptor() {
        return (TestBed.inject(HTTP_INTERCEPTORS)[0] as TeardownInterceptor);
    }

});
