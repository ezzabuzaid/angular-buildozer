import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MediaHubFoldersComponent } from './media-hub-folders.component';

describe('MediaHubFoldersComponent', () => {
  let component: MediaHubFoldersComponent;
  let fixture: ComponentFixture<MediaHubFoldersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaHubFoldersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaHubFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
