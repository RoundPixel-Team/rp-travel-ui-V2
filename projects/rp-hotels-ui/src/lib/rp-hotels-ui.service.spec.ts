import { TestBed } from '@angular/core/testing';

import { RpHotelsUiService } from './rp-hotels-ui.service';

describe('RpHotelsUiService', () => {
  let service: RpHotelsUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RpHotelsUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
