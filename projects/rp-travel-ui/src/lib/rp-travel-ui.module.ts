import { NgModule } from '@angular/core';
import { RpTravelUiComponent } from './rp-travel-ui.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    RpTravelUiComponent
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    RpTravelUiComponent,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers:[HttpClient]
})
export class RpTravelUiModule { }
