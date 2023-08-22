import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FlightResultComponent } from './components/flight-result/flight-result.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SearchboxComponent } from './components/searchbox/searchbox.component';

const routes: Routes = [
  {path:'checkout',component:CheckoutComponent},
  {path:'flightResult/:language/:currency/:SearchPoint/:flightType/:flightInfo/:searchId/:passengers/:Cclass/:directOnly',component:FlightResultComponent},

  {path:'home',component:HomePageComponent},

  {path:'checkout',component:CheckoutComponent},
  {path:'searchbox',component:SearchboxComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
