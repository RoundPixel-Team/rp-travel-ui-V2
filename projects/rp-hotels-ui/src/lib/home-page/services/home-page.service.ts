import { Injectable, inject } from '@angular/core';
import { HomePageApiService } from './home-page-api.service';
import { countries, currencyModel, pointOfSaleModel } from '../interfaces';
import { Subject, Subscription, switchMap, take, takeUntil, timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  api = inject(HomePageApiService);
  route = inject(ActivatedRoute);
  selectAllcities: any;
  subscription: Subscription = new Subscription();

  cityLoader: boolean = false;
  private cancelRequests$ = new Subject<void>();

  constructor() {}

  /**
   * here is all available currencies
   */
  allCurrency: currencyModel[] = [];

  /**
   * Here's the value of selected currency
   */
  selectedCurrency: currencyModel = {
    Currency_Code: 'KWD',
    Currency_Name: 'Kuwait Dinar',
    ID: 2027,
    Image_Url: 'https://images.khaleejgate.com/Content/Currencies/KWD.JPG',
    Is_Base_Currency: true,
    rate: 1,
  };
  /**
   * here is all available countries
   */
  allCountries: countries[] = [];

  /**
   * here is all available point of sale
   */
  pointOfSale!: pointOfSaleModel;

  /**
   * loading state ..
   */
  loader: boolean = false;

  /**
   *
   * @param baseCurrency
   * this is for fetching all currencies and update my all currencies state (allCurrency:currencyModel[])
   * also updates loader state (loader:boolean)
   */
  getCurrency(baseCurrency: string) {
    this.loader = true;
    this.subscription.add(
      this.api.currencyApi(baseCurrency).subscribe(
        (res: currencyModel[]) => {
          if (res) {
            this.allCurrency = res;
            this.loader = false;
          }
        },
        (err: any) => {
          console.log('get all currency error ->', err);
          this.loader = false;
        }
      )
    );
  }

  /**
   * set the default selected currency model according to point of sale
   * @param currencyModel
   */
  setSelectedCurrency(currency: currencyModel) {
    this.selectedCurrency = currency;
  }

  /**
   *
   * @param currentLang
   * this is for fetching all countries (allCountries :countries[]) based on current language
   * also updates loader state (loader:boolean)
   */
  getCountries(currentLang: string) {
    this.loader = true;
    this.subscription.add(
      this.api.getCountries(currentLang).subscribe(
        (res: countries[]) => {
          if (res) {
            this.allCountries = res;
            this.loader = false;
          }
        },
        (err: any) => {
          console.log('get all countires error ->', err);
          this.loader = false;
        }
      )
    );
  }

  /**
   * this is for fetching and updating Point of Sale (pointOfSale:pointOfSaleModel)
   *and also updates loader state
   */
  getPointOfSale() {
    this.loader = true;
    this.subscription.add(
      this.api.pointOfSale().subscribe(
        (res) => {
          if (res) {
            this.pointOfSale = res;
            this.loader = false;
          }
        },
        (err: any) => {
          console.log('get all pointofsales error ->', err);
          this.loader = false;
        }
      )
    );
  }

  /**
   *
   *get Cities based Key (country code )
   *
   */
  getCitiesById(key: string) {
    // Cancel any previous request
    this.cancelRequests$.next();

    // Clear cities if input is empty or less than 2 characters
    if (!key || key.length < 2) {
      this.cityLoader = false;
      this.selectAllcities = [];
      return;
    }

    this.cityLoader = true;

    // Create a new subscription with cancellation
    const searchSubscription = timer(300) // Add 300ms debounce
      .pipe(
        switchMap(() => {
          return this.api.getHotelsCities(key).pipe(
            takeUntil(this.cancelRequests$), // Cancel if new request comes
            take(1)
          );
        })
      )
      .subscribe({
        next: (res) => {
          this.cityLoader = false;
          this.selectAllcities = res;
        },
        error: (err) => {
          this.cityLoader = false;
          // Optionally handle error
          console.error('Error fetching cities:', err);
        },
      });

    // Add to subscriptions for cleanup
    this.subscription.add(searchSubscription);
  }

  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer() {
    this.subscription.unsubscribe();
  }
}
