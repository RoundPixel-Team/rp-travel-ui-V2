import { TestBed } from '@angular/core/testing';

import { RpTravelUiService } from './rp-travel-ui.service';

describe('RpTravelUiService', () => {
  let service: RpTravelUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RpTravelUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
