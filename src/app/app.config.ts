import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BaseUrl } from './interceptors/baseurl.interceptors';
import { AddJwt } from './interceptors/addjwt.interceptors';
import Aura from '@primeng/themes/aura'
import { customPreset } from './custom-preset';
import { loggingInterceptor } from './interceptors/logging.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset:customPreset,
        options:{
          darkModeSelector: false,
        }
      }
    }),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([BaseUrl,AddJwt,loggingInterceptor])),
  ],
};
