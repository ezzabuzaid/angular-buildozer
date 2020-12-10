import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MasonryItemComponent } from './masonry-item.component';

describe('MasonryItemComponent', () => {
  let component: MasonryItemComponent;
  let fixture: ComponentFixture<MasonryItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MasonryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasonryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
