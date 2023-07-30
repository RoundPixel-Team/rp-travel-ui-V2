import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SearchboxComponent } from './components/searchbox/searchbox.component';

const routes: Routes = [
  {path:'checkout',component:CheckoutComponent},
  {path:'searchbox',component:SearchboxComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
