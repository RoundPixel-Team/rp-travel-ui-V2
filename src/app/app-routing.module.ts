import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FlightResultComponent } from './components/flight-result/flight-result.component';

const routes: Routes = [
  {path:'checkout',component:CheckoutComponent},
  {path:'flightResult/:language/:currency/:SearchPoint/:flightType/:flightInfo/:searchId/:passengers/:Cclass/:directOnly',component:FlightResultComponent},

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
