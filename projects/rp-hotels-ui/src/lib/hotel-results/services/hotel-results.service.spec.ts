import { TestBed } from '@angular/core/testing';

import { HotelResultsService } from './hotel-results.service';

describe('HotelResultsService', () => {
  let service: HotelResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
