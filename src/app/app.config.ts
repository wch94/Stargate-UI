import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { API_BASE_URL, Client } from './api/stargate-api-client';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([])),
    provideAnimationsAsync(),
    //{ provide: API_BASE_URL, useValue: 'http://192.168.50.223:5001/stargate-api' },
    { provide: API_BASE_URL, useValue: 'http://localhost:5204/stargate-api' },
    Client
  ]
};
