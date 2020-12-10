import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MediaHubGateComponent } from './media-hub-gate.component';

describe('MediaHubGateComponent', () => {
  let component: MediaHubGateComponent;
  let fixture: ComponentFixture<MediaHubGateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaHubGateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaHubGateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
