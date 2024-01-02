import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpHotelsUiComponent } from './rp-hotels-ui.component';

describe('RpHotelsUiComponent', () => {
  let component: RpHotelsUiComponent;
  let fixture: ComponentFixture<RpHotelsUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RpHotelsUiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RpHotelsUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
