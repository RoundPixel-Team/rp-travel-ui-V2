import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RpTravelUiModule } from 'rp-travel-ui';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    CheckoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RpTravelUiModule
  ],
  providers: [],
  bootstrap: [AppComponent] 
})
export class AppModule { }
