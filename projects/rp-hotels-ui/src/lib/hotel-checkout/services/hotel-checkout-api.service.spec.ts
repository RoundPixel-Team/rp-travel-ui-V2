import { TestBed } from '@angular/core/testing';

import { HotelCheckoutApiService } from './hotel-checkout-api.service';

describe('HotelCheckoutApiService', () => {
  let service: HotelCheckoutApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelCheckoutApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
