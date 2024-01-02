import { TestBed } from '@angular/core/testing';

import { HotelConfirmationService } from './hotel-confirmation.service';

describe('HotelConfirmationService', () => {
  let service: HotelConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
