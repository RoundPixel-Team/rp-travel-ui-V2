import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightCheckoutService, HomePageService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public flight = inject(FlightCheckoutService) 
  public home = inject(HomePageService)
  private route = inject(ActivatedRoute)
  
  subscription = new Subscription()

  constructor() { }

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParams.subscribe((params)=>{
        this.flight.getSelectedFlightData(params["sid"],+params["sequenceNum"],params["providerKey"]?params["providerKey"]:params["pkey"])
        this.flight.getAllOfflineServices(params["sid"],'KW',true)
        // this.flight.fetchLastPassengerData()
      })
    )

    this.subscription.add(this.flight.paymentLink.subscribe((res)=>{
      console.log("show me link update" , res)
    }))
    
  }

currCode : string = 'KWD'
  changeCurrency(){
    if(this.currCode == 'KWD'){
      this.home.selectedCurrency = {
        Currency_Code: "EGP",
        Currency_Name: "Egyptian Pound",
        ID: 2026,
        Image_Url: "https://images.khaleejgate.com/Content/Currencies/EGP.JPG",
        Is_Base_Currency: true,
        rate: 103
      }
    }
    else{
      this.home.selectedCurrency = {
        Currency_Code: "KWD",
        Currency_Name: "Kuwait Dinar" ,
        ID: 2027,
        Image_Url: "https://images.khaleejgate.com/Content/Currencies/KWD.JPG",
        Is_Base_Currency: true,
        rate: 1
      }
    }
    this.currCode  = this.currCode=='KWD'?'EGP':'KWD'
    
  }

}
