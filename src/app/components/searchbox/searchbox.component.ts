import { Component, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FlightSearchService } from 'projects/rp-travel-ui/src/public-api';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit {
  compForm?: FormGroup;
  public searchBox = inject(FlightSearchService)

  constructor() { }

  ngOnInit() {
    // this.searchForm.initSearchForm();
    this.compForm = this.searchBox.searchFlight;
    this.searchBox.initSearchForm();

    console.log("herrrreeeee", this.compForm.value);
  }
  onSubmit(){
    this.searchBox.onSubmit();
  }

}
