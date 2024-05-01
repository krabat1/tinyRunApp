import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { environment } from '../environments/environment.development'
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    //importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebaseConfig))),
    //importProvidersFrom(provideAuth(() => getAuth())),
    //importProvidersFrom(provideFirestore(() => getFirestore())),
    //importProvidersFrom(provideDatabase(() => getDatabase())),
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideDatabase(() => getDatabase())
    ]),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
    // https://stackoverflow.com/a/71821658/4279940
    provideAnimations()
  ]
};
