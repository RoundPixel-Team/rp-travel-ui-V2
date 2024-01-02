import { TestBed } from '@angular/core/testing';

import { HotelResultsApiService } from './hotel-results-api.service';

describe('HotelResultsApiService', () => {
  let service: HotelResultsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelResultsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
