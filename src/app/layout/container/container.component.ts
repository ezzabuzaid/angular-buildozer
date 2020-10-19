import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MEDIA_BREAKPOINTS } from '@shared/common';
import { ChatModel } from '@shared/models';
import { ChatService } from '@shared/services/chat';
import { RegisterdSidebar, SidebarManager } from '@widget/sidebar';
import { ChatCardManager, ChatConversationCardComponent, ChatGroupCardComponent } from 'app/pages/chat';
import { ChatCreateCardComponent } from 'app/pages/chat/chat-create-card/chat-create-card.component';
import { ChatFloatingButtonComponent } from 'app/pages/chat/chat-floating-button/chat-floating-button.component';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ transform: 'translateX(-100%)' })
        ],
          { optional: true }
        ),
        query(':leave', animateChild(), { optional: true }),
        group([
          query(':leave', [
            animate('200ms ease-in-out', style({ transform: 'translateX(100%)' }))
          ], { optional: true }),
          query(':enter', [
            animate('300ms ease-in-out', style({ transform: 'translateX(0)' }))
          ], { optional: true })
        ]),
        query(':enter',
          animateChild(),
          { optional: true }
        ),
      ])
    ])
  ]
})
export class ContainerComponent implements OnInit, AfterViewInit {
  public $groups = this.chatService.getGroups();
  public $conversations = this.chatService.getConversations();

  constructor(
    private readonly chatCardManager: ChatCardManager,
    private readonly chatService: ChatService,
    private readonly sidebarService: SidebarManager,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    if (this.breakpointObserver.isMatched(MEDIA_BREAKPOINTS.DOWN('md'))) {
      this.sidebarService.getSidebar(RegisterdSidebar.CHAT).close();
    } else {
    }
    // FIXME: mobile design should make fill the card to the whole screen so the button is not needed then
    // FIXME: a search input should be at the top for the user to search across the user lists
    this.chatCardManager.setButtonComponent(ChatFloatingButtonComponent);
  }

  openChatCard(conversation: ChatModel.Room) {
    this.chatCardManager.open(ChatConversationCardComponent, {
      id: conversation._id,
      data: conversation
    });
    // this.sidebarService.getSidebar(RegisterdSidebar.CHAT).close();
  }

  openGroupChatCard(room: ChatModel.Room) {
    this.chatCardManager.open(ChatGroupCardComponent, {
      id: room._id,
      data: room
    });
  }

  openCreateChatCard() {
    this.chatCardManager.open(ChatCreateCardComponent, {
      withButton: false
    });
  }

}
