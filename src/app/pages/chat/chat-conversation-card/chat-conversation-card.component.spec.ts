import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChatConversationCardComponent } from './chat-conversation-card.component';


describe('ChatConversationCardComponent', () => {
  let component: ChatConversationCardComponent;
  let fixture: ComponentFixture<ChatConversationCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChatConversationCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatConversationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
