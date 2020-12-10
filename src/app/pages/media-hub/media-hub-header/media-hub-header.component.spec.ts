import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MediaHubHeaderComponent } from './media-hub-header.component';

describe('MediaHubHeaderComponent', () => {
  let component: MediaHubHeaderComponent;
  let fixture: ComponentFixture<MediaHubHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaHubHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaHubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
