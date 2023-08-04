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
    this.searchBox.initSearchForm();
    console.log("DATEEE", this.searchBox.setRetDate(this.searchBox.searchFlight.controls['returnDate'].value));
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
    this.searchBox.onSubmit();
  }
}
