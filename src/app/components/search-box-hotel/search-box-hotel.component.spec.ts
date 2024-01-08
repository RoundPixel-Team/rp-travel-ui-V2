import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBoxHotelComponent } from './search-box-hotel.component';

describe('SearchBoxHotelComponent', () => {
  let component: SearchBoxHotelComponent;
  let fixture: ComponentFixture<SearchBoxHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchBoxHotelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBoxHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
