import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChatFloatingButtonComponent } from './chat-floating-button.component';

describe('ChatFloatingButtonComponent', () => {
  let component: ChatFloatingButtonComponent;
  let fixture: ComponentFixture<ChatFloatingButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatFloatingButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatFloatingButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
