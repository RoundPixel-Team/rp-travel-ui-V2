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
    let form = JSON.parse(localStorage.getItem('form') as string);
    this.searchBox.initSearchForm(form);
  }
}
