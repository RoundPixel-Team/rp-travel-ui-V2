import { Pipe, PipeTransform, Injectable, inject } from '@angular/core';
import { currencyModel } from '../../home-page/interfaces';
import { HomePageService } from '../../home-page/services/home-page.service';


@Pipe({
  name: 'exchange',
  pure:false
})
export class ExchangePipe implements PipeTransform {
  public home = inject(HomePageService)
  currentCurruncy:currencyModel = this.home.selectedCurrency;

  transform(value: any, args?: any): any {
    this.currentCurruncy = this.home.selectedCurrency;
    console.log("show me now bonded currency", this.currentCurruncy)
    if(!value || !args) {
      return value;
    }
    else {
      if(args == "value" && this.currentCurruncy.Currency_Code == 'KWD') {
        let total = value * this.currentCurruncy.rate ;
        return parseFloat((Math.round(total*1000)/1000).toFixed(3));
      }
      if(args == "value" && this.currentCurruncy.Currency_Code != 'KWD') {
        let total = value * this.currentCurruncy.rate;
        return parseFloat((Math.round(total*100)/100).toFixed(2));
      }
      if(args == "code") {
        return this.currentCurruncy.Currency_Code;
      }
    }

  }
  

}

