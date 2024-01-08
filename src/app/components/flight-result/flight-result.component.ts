import { Component, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { FlightResultService } from 'projects/rp-travel-ui/src/lib/flight-result/services/flight-result.service';
import { HotelResultsService } from 'rp-hotels-ui';
import { filter } from 'rxjs';

@Component({
  selector: 'app-flight-result',
  templateUrl: './flight-result.component.html',
  styleUrls: ['./flight-result.component.scss']
})
export class FlightResultComponent implements OnInit {
  FlightResultService = inject(FlightResultService)
  route = inject(ActivatedRoute)
  hotelResults = inject(HotelResultsService)

  starRating:Array<string>=['','','','',''];
  filterFormm: FormGroup  = this.FlightResultService.filterForm

  constructor() { }

  ngOnInit(): void {

    console.log("Hotel Ratess Array",this.hotelResults.hotelRatesArray.value)
    this.hotelResults.getHotelDataFromUrl();
    console.log('new lang', location.pathname)
    
    setTimeout(() => {
      console.log("Before Filtered Data", this.hotelResults.filteredHotels)
      this.hotelResults.priceSorting('Low');
      console.log("After Filtered Data", this.hotelResults.filteredHotels)
    }, 3000);

    
    this.route.params.subscribe(
      (params: Params) => {
        console.log("lang", params['language'], params['directOnly'])
        let lang = params['language']
        let currency = params['currency'];
        let pointOfReservation = params['SearchPoint'];
        let flightType = params['flightType'];
        let flightsInfo = params['flightInfo'];

        let serachId = params['searchId'];
        let passengers = params['passengers'];
        let Cclass = params['Cclass'];
        let showDirect: boolean;

        if (params['directOnly'] == 'false') {
          showDirect = false;
        }
        else {
          showDirect = true;
        }
        this.FlightResultService.getDataFromUrl(lang, currency, pointOfReservation, flightType, flightsInfo, serachId, passengers, Cclass, showDirect,4,2)
        console.log("ggfggf", this.FlightResultService.getDataFromUrl(lang, currency, pointOfReservation, flightType, flightsInfo, serachId, passengers, Cclass, showDirect,4,2))

      });     
      }

     
      
      sort(val: number) {
        if (this.FlightResultService.response != undefined) {
          this.FlightResultService.sortMyResult(val) 
          console.log("sortData" ,this.FlightResultService.FilterData)
          
        }
        
      }
      starsRating(rate:number){
        this.hotelResults.formValueChanged();
      }
}