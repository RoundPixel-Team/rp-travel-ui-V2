import { TestBed } from '@angular/core/testing';

import { HomePageApiService } from './home-page-api.service';

describe('HomePageApiService', () => {
  let service: HomePageApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomePageApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
