import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FlightResultComponent } from './components/flight-result/flight-result.component';
import { SearchboxComponent } from './components/searchbox/searchbox.component';
import { SearchBoxHotelComponent } from './components/search-box-hotel/search-box-hotel.component';
const routes: Routes = [
  {path:'checkout/:pId/:sId/:hotelId/:rooms/:package',component:CheckoutComponent},
  {path:'home',component:HomePageComponent},
  {path:'flightResult/:language/:currency/:SearchPoint/:flightType/:flightInfo/:searchId/:passengers/:Cclass/:directOnly',component:FlightResultComponent},
  {path:'searchbox',component:SearchboxComponent},
  {path:'searchboxhotel',component:SearchBoxHotelComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
