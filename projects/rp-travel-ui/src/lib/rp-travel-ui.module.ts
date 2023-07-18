import { NgModule } from '@angular/core';
import { RpTravelUiComponent } from './rp-travel-ui.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    RpTravelUiComponent
  ],
  imports: [
    HttpClientModule
  ],
  exports: [
    RpTravelUiComponent,
    HttpClientModule
  ],
  providers:[HttpClient]
})
export class RpTravelUiModule { }
