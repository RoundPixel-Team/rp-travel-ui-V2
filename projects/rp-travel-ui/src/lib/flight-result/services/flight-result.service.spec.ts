import { TestBed } from '@angular/core/testing';

import { FlightResultService } from './flight-result.service';

describe('FlightResultService', () => {
  let service: FlightResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
