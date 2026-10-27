import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { csrfInterceptor } from './core/interceptors/csrf.interceptor';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);
export const appConfig: ApplicationConfig = {
  
  providers: [provideRouter(routes),
  provideHttpClient(withFetch(),
  
    withInterceptors([authInterceptor, csrfInterceptor])),{ provide: LOCALE_ID, useValue: 'pt-BR' }]
    
};
