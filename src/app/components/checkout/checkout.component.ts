import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightCheckoutService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public flight = inject(FlightCheckoutService) 
  private route = inject(ActivatedRoute)
  
  subscription = new Subscription()

  constructor() { }

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParams.subscribe((params)=>{
        this.flight.getSelectedFlightData(params["sid"],+params["sequenceNum"],params["providerKey"]?params["providerKey"]:params["pkey"])
        this.flight.getAllOfflineServices(params["sid"],'KW')

      })
    )
    console.log("show me lenght",this.flight.usersArray.length)
    
  }

}
