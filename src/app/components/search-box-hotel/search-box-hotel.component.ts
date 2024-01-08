import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { HomePageApiService } from 'projects/rp-hotels-ui/src/lib/home-page/services/home-page-api.service';
import { HotelSearchService } from 'projects/rp-hotels-ui/src/lib/hotel-search/services/hotel-search.service';


@Component({
  selector: 'app-search-box-hotel',
  templateUrl: './search-box-hotel.component.html',
  styleUrls: ['./search-box-hotel.component.scss']
})
export class SearchBoxHotelComponent implements OnInit {
  CitiesData:any;
  public SearchHotelService = inject(HomePageApiService)
  public searchBox = inject(HotelSearchService);

    constructor() {
     }
     applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      let filter = filterValue.trim().toLowerCase();
      this.SearchHotelService.getHotelsCities(filter).subscribe((x)=>{
        this.CitiesData= x;
        console.log("citiesData",this.CitiesData)
      })
    }
  ngOnInit(): void {
    let form = JSON.parse(localStorage.getItem('form') as string)
    this.searchBox.initSearchForm(form);
    this.SearchHotelService.getHotelsCities('').subscribe((x)=>{
      console.log("citiesData", x,this.searchBox.HotelSearchFormGroup.value)   });

    
   
  
  }
  onSubmit(){
    console.log("gg",  this.searchBox.HotelSearchFormGroup.get("location")?.value,  this.searchBox.HotelSearchFormGroup.value
    )
  }
   
  

}
