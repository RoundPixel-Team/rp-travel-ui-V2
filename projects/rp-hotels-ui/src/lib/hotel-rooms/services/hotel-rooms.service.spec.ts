import { TestBed } from '@angular/core/testing';

import { HotelRoomsService } from './hotel-rooms.service';

describe('HotelRoomsService', () => {
  let service: HotelRoomsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelRoomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
