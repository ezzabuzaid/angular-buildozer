import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MediaPickerComponent } from './media-picker.component';

describe('MediaPickerComponent', () => {
  let component: MediaPickerComponent;
  let fixture: ComponentFixture<MediaPickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
