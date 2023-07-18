import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpTravelUiComponent } from './rp-travel-ui.component';

describe('RpTravelUiComponent', () => {
  let component: RpTravelUiComponent;
  let fixture: ComponentFixture<RpTravelUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RpTravelUiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RpTravelUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
