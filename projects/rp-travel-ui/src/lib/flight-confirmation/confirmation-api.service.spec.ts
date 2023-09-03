import { TestBed } from '@angular/core/testing';

import { ConfirmationApiService } from './confirmation-api.service';

describe('ConfirmationApiService', () => {
  let service: ConfirmationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
