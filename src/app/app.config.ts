import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject,
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { authInterceptor } from './interceptors/auth-interceptor';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),
    provideNativeDateAdapter(),

    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),

    importProvidersFrom(
      TranslateModule.forRoot({
        fallbackLang: 'en',
        loader: provideTranslateHttpLoader({
          prefix: './i18n/',
          suffix: '.json',
        }),
      }),
    ),

    provideAppInitializer(() => {
      const translate = inject(TranslateService);

      const lang = localStorage.getItem('lang') || 'en';

      translate.setFallbackLang('en');
      translate.use(lang);
    }),
  ],
};
