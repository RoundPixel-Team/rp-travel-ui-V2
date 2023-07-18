import { TestBed } from '@angular/core/testing';

import { FlightSearchApiService } from './flight-search-api.service';

describe('FlightSearchApiService', () => {
  let service: FlightSearchApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightSearchApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
