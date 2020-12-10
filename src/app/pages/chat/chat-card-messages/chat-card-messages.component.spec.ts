import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChatCardMessagesComponent } from './chat-card-messages.component';

describe('ChatCardMessagesComponent', () => {
  let component: ChatCardMessagesComponent;
  let fixture: ComponentFixture<ChatCardMessagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatCardMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatCardMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
