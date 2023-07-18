import { TestBed } from '@angular/core/testing';

import { FlightCheckoutService } from './flight-checkout.service';

describe('FlightCheckoutService', () => {
  let service: FlightCheckoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightCheckoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
