import { NgModule } from '@angular/core';
import { RpHotelsUiComponent } from './rp-hotels-ui.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CouncodePipe } from './shared/pipes/councode.pipe';
import { DurationToHourMinPipe } from './shared/pipes/duration-to-hour-min.pipe';
import { HighlighterPipe } from './shared/pipes/highlighter.pipe';
import { HotelecitesPipe } from './shared/pipes/hotelecites.pipe';
import { HourMinutePipe } from './shared/pipes/hour-minute.pipe';
import { LimitToPipe } from './shared/pipes/limit-to.pipe';
import { ExchangePipe } from './shared/pipes/exchange.pipe';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    RpHotelsUiComponent,
    CouncodePipe,
    DurationToHourMinPipe,
    HighlighterPipe,
    HotelecitesPipe,
    HourMinutePipe,
    LimitToPipe,
    ExchangePipe
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    RpHotelsUiComponent,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CouncodePipe,
    DurationToHourMinPipe,
    HighlighterPipe,
    HotelecitesPipe,
    HourMinutePipe,
    LimitToPipe,
    ExchangePipe
  ],
  providers:[HttpClient, DatePipe]
})
export class RpHotelsUiModule { }
