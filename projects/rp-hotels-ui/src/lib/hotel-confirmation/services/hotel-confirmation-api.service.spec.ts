import { TestBed } from '@angular/core/testing';

import { HotelConfirmationApiService } from './hotel-confirmation-api.service';

describe('HotelConfirmationApiService', () => {
  let service: HotelConfirmationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelConfirmationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
