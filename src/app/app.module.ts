import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RpTravelUiModule } from 'rp-travel-ui';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchboxComponent } from './components/searchbox/searchbox.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    CheckoutComponent,
    SearchboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RpTravelUiModule,
    NgxSliderModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent] 
})
export class AppModule { }
