import { TestBed } from '@angular/core/testing';

import { UserManagmentApiService } from './user-managment-api.service';

describe('UserManagmentApiService', () => {
  let service: UserManagmentApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManagmentApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
