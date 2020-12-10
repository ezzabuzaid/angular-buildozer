import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PincodeBoxComponent } from './pincode-box.component';

describe('PincodeBoxComponent', () => {
  let component: PincodeBoxComponent;
  let fixture: ComponentFixture<PincodeBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PincodeBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PincodeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
