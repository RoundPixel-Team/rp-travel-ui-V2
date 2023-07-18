import { Component, OnInit, inject } from '@angular/core';
import { HomePageService } from 'rp-travel-ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  title = 'rp-travel-ui-V2';
  public service1 = inject(HomePageService)


  ngOnInit(): void { 
    this.service1.getCurrency('KWD')
  }  

}
