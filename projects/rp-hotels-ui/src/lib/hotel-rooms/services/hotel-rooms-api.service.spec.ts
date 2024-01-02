import { TestBed } from '@angular/core/testing';

import { HotelRoomsApiService } from './hotel-rooms-api.service';

describe('HotelRoomsApiService', () => {
  let service: HotelRoomsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelRoomsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
