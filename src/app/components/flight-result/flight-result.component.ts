import { Component, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { FlightResultService } from 'projects/rp-travel-ui/src/lib/flight-result/services/flight-result.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-flight-result',
  templateUrl: './flight-result.component.html',
  styleUrls: ['./flight-result.component.scss']
})
export class FlightResultComponent implements OnInit {
  FlightResultService = inject(FlightResultService)
  route = inject(ActivatedRoute)


  filterFormm: FormGroup  = this.FlightResultService.filterForm
  constructor() { }

  ngOnInit(): void {
    console.log('new lang', location.pathname)
    let url = location.href
    
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
        this.FlightResultService.getDataFromUrl(lang, currency, pointOfReservation, flightType, flightsInfo, serachId, passengers, Cclass, showDirect)
        console.log("ggfggf", this.FlightResultService.getDataFromUrl(lang, currency, pointOfReservation, flightType, flightsInfo, serachId, passengers, Cclass, showDirect))

      });
      console.log("sortData" ,this.FlightResultService.FilterData)
      console.log("Arrival", this.FlightResultService.arrivingMin, this.FlightResultService.arrivingMax);
      console.log("airlinesA", this.FlightResultService.airlinesA)
      console.log("airlinesA", this.FlightResultService.bookingSites)
     
      }

     
   
    
  sort(val: number) {
    if (this.FlightResultService.response != undefined) {
       this.FlightResultService.sortMyResult(val) 
       console.log("sortData" ,this.FlightResultService.FilterData)

      }

  }
}