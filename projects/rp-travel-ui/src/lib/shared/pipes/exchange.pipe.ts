import { Pipe, PipeTransform, inject } from '@angular/core';
import { currencyModel } from '../../home-page/interfaces';
import { HomePageService } from '../../home-page/services/home-page.service';

@Pipe({
  name: 'exchange',
  pure: false,
})
export class ExchangePipe implements PipeTransform {
  public home = inject(HomePageService);
  currentCurruncy: currencyModel = this.home.selectedCurrency;

  transform(value: any, args?: any, currency?: string): any {
    this.currentCurruncy = this.home.selectedCurrency;
    if (value === null || value === undefined || value === '' || !args || !this.currentCurruncy) {
      return value;
    }

    if (args == 'code') {
      this.remember(value);
      return this.currentCurruncy.Currency_Code;
    }

    if (args != 'value') {
      return value;
    }

    this.remember(currency);
    const amount = Number(value);
    if (Number.isNaN(amount)) return value;

    const source = this.currencyCode(currency) || this.home.responseCurrency;
    if (!source || source === this.currentCurruncy.Currency_Code) {
      return amount;
    }

    return this.round(this.convert(amount, source));
  }

  private remember(code: unknown) {
    const currency = this.currencyCode(code);
    if (currency) this.home.responseCurrency = currency;
  }

  private currencyCode(code: unknown): string {
    return typeof code === 'string' && /^[A-Z]{3}$/.test(code) ? code : '';
  }

  private convert(amount: number, source: string): number {
    const sourceRate = this.rate(source);
    const targetRate = Number(this.currentCurruncy.rate);
    if (!sourceRate || !targetRate) return amount;
    return (amount / sourceRate) * targetRate;
  }

  private rate(code: string): number {
    const found = Number(this.home.allCurrency?.find((currency) => currency.Currency_Code === code)?.rate);
    if (found > 0) return found;
    if (code === this.currentCurruncy.Currency_Code && Number(this.currentCurruncy.rate) > 0) {
      return Number(this.currentCurruncy.rate);
    }
    return 0;
  }

  private round(amount: number): number {
    const base = Number(this.currentCurruncy.rate) === 1;
    const factor = base ? 1000 : 100;
    return parseFloat((Math.round(amount * factor) / factor).toFixed(base ? 3 : 2));
  }
}
