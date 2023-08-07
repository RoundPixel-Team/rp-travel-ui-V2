import { Component, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FlightSearchService } from 'projects/rp-travel-ui/src/public-api';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css'],
})
export class SearchboxComponent implements OnInit {

  public searchBox = inject(FlightSearchService);

  constructor() {}

  ngOnInit() {
//JSON.parse(localStorage.getItem('form')as string)
    let form = JSON.parse(localStorage.getItem('form') as string)
    this.searchBox.initSearchForm(form);

    // console.log("DATEEE", this.searchBox.getAirportCode(0,'-','KWI-DXB'));
    // console.log("FLIGHT INFO", this.searchBox.getFlightInfo(1,'-'));
    // console.log("FLIGHT INFOoooo", this.searchBox.flightInfoFormatter(this.searchBox.getFlightInfo(1,'-')));
    // console.log("PASSENGER", this.searchBox.searchFlight.get('passengers')?.value);
    // console.log("PASSENGER", this.searchBox.passengerFormatter(this.searchBox.searchFlight.get('passengers')?.value));
    // console.log("RESULT LINK", this.searchBox.getSearchresultLink('en','KWD','EG',1,'-'));
    // this.searchBox.setDepCity('2023-03-15');
    // this.compForm = this.searchBox.searchFlight;
    // this.searchBox.initSearchForm();
    // console.log("herrrreeeee", this.compForm.value);
    // this.searchBox.addFlight();
    // this.searchBox.changeAdultPassenger(4);
    // this.searchBox.changeChildPassenger(3);
    // console.log(this.searchBox.changeInfentPassenger(4));
  }
  onSubmit() {
    console.log("SUBMIT", this.searchBox.searchFlight.valid);
    console.log("FORM form", this.searchBox.flightsArray);
    
    console.log("FINAL RESULT", this.searchBox.onSubmit('en','KWD','EG',1,'-'));
    if(this.searchBox.onSubmit('en','KWD','EG',1,'-')){
      localStorage.setItem('form', JSON.stringify(this.searchBox.searchFlight.value))
    }
  }
}
