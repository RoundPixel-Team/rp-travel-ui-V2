import { TestBed } from '@angular/core/testing';

import { FlightCheckoutApiService } from './flight-checkout-api.service';

describe('FlightCheckoutApiService', () => {
  let service: FlightCheckoutApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightCheckoutApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
