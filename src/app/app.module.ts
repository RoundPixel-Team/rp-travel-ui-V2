import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RpTravelUiModule } from 'rp-travel-ui';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FlightResultComponent } from './components/flight-result/flight-result.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    CheckoutComponent,
    FlightResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RpTravelUiModule,
    NgxSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent] 
})
export class AppModule { }
