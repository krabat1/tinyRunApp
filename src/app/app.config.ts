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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

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
    provideAnimations(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"tinyrunapp","appId":"1:877702984813:web:6fe2f4eff91e95be397b64","storageBucket":"tinyrunapp.appspot.com","apiKey":"AIzaSyCK_Ox3WwraJu6QlAD8z0qrh7RlPJJgm1k","authDomain":"tinyrunapp.firebaseapp.com","messagingSenderId":"877702984813"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideDatabase(() => getDatabase())), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync()
  ]
};
