import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChatCreateCardComponent } from './chat-create-card.component';

describe('ChatCreateCardComponent', () => {
  let component: ChatCreateCardComponent;
  let fixture: ComponentFixture<ChatCreateCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatCreateCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatCreateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
