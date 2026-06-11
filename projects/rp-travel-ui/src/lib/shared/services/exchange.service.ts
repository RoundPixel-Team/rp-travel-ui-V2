import { Injectable } from '@angular/core';
import { HomePageService } from '../../home-page/services/home-page.service';
import { currencyModel } from '../../home-page/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  constructor(private home: HomePageService) {}

  private getCurrentCurrency(): currencyModel {
    return this.home.selectedCurrency;
  }

  convert(value: number): number {
    const currentCurrency = this.getCurrentCurrency();
    console.log('ExchangeService.convert called with value:', value);
    console.log('HomePageService instance:', this.home);
    console.log('currentCurrency (selectedCurrency):', currentCurrency);
    console.log('currentCurrency.rate:', currentCurrency?.rate);

    if (!value) {
      return value;
    }

    const rate = currentCurrency?.rate ?? 1;
    const total = value * rate;

    const currencyCode = currentCurrency?.Currency_Code ?? 'EGP';
    if (currencyCode === 'EGP') {
      return parseFloat((Math.round(total * 1000) / 1000).toFixed(3));
    }

    return parseFloat((Math.round(total * 100) / 100).toFixed(2));
  }

  getCurrencyCode(): string {
    return this.getCurrentCurrency().Currency_Code;
  }

  transform(value: any, args?: any): any {
    if (!value || !args) {
      return value;
    }

    if (args === 'value') {
      return this.convert(value);
    }

    if (args === 'code') {
      return this.getCurrencyCode();
    }

    return value;
  }
}
