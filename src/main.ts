import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {IonicModule} from "@ionic/angular";
import {importProvidersFrom} from '@angular/core';
import {provideRouter} from "@angular/router";
import {routes} from "./app/app.routes";

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(IonicModule.forRoot()),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
