import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { authenInterceptor } from './auth.interceptor.service';
import { AuthService } from '../authentication/auth.service';
import { UrlsService } from '../urls/urls.service';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { of } from 'rxjs';

describe('authenInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let urlsService: UrlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: HTTP_INTERCEPTORS, useValue: authenInterceptor, multi: true },
        {
          provide: AuthService,
          useValue: {
            getAccessToken: () => 'FAKE_TOKEN',
            setAccessToken: jasmine.createSpy('setAccessToken'),
          },
        },
        {
          provide: UrlsService,
          useValue: {
            refreshUrl: '/auth/refresh/'
          },
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    urlsService = TestBed.inject(UrlsService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header if token exists', () => {
    http.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer FAKE_TOKEN');

    req.flush({});
  });

  it('should attempt token refresh on 401 error', () => {
    http.get('/protected').subscribe({
      error: () => {}
    });

    const req = httpMock.expectOne('/protected');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    const refreshReq = httpMock.expectOne('/auth/refresh/');
    expect(refreshReq.request.method).toBe('POST');

    refreshReq.flush({ access: 'NEW_FAKE_TOKEN' });
  });
});
