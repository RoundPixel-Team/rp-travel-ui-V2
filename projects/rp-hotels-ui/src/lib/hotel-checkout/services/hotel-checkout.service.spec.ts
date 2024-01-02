import { TestBed } from '@angular/core/testing';

import { HotelCheckoutService } from './hotel-checkout.service';

describe('HotelCheckoutService', () => {
  let service: HotelCheckoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelCheckoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
