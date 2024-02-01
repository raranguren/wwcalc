import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { APP_BASE_HREF } from '@angular/common';

bootstrapApplication(AppComponent, {
  providers: [{ provide: APP_BASE_HREF, useValue: './' }]
})
  .catch((err) => console.error(err));
