import { TestBed } from '@angular/core/testing';

import { FlightResultApiService } from './flight-result-api.service';

describe('FlightResultApiService', () => {
  let service: FlightResultApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightResultApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
