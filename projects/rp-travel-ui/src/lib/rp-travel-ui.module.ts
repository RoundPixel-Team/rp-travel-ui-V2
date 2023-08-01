import { NgModule } from '@angular/core';
import { RpTravelUiComponent } from './rp-travel-ui.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CodToCityPipe } from './shared/pipes/cod-to-city.pipe';
import { CouncodePipe } from './shared/pipes/councode.pipe';
import { DurationToHourMinPipe } from './shared/pipes/duration-to-hour-min.pipe';
import { FilterCityPipe } from './shared/pipes/filter-city.pipe';
import { HighlighterPipe } from './shared/pipes/highlighter.pipe';
import { HotelecitesPipe } from './shared/pipes/hotelecites.pipe';
import { HourMinutePipe } from './shared/pipes/hour-minute.pipe';
import { LimitToPipe } from './shared/pipes/limit-to.pipe';



@NgModule({
  declarations: [
    RpTravelUiComponent,
    CodToCityPipe,
    CouncodePipe,
    DurationToHourMinPipe,
    FilterCityPipe,
    HighlighterPipe,
    HotelecitesPipe,
    HourMinutePipe,
    LimitToPipe,
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
    CodToCityPipe,
    CouncodePipe,
    DurationToHourMinPipe,
    FilterCityPipe,
    HighlighterPipe,
    HotelecitesPipe,
    HourMinutePipe,
    LimitToPipe,
  ],
  providers:[HttpClient]
})
export class RpTravelUiModule { }
