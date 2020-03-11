import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/common';
import { GravatarModule } from 'ngx-gravatar';
import { TimeagoModule } from 'ngx-timeago';
import { ChatCardManager } from './chat-card.manager';
import { UserCardComponent } from './user-card/user-card.component';
import { GroupCharCardComponent } from './group-chat-card/group-chat-card.component';
import { GroupChatCreateComponent } from './group-chat-create/group-chat-create.component';
import { FormModule } from '@partials/form';
import { UploadFileModule } from '@widget/upload-file';
import { ChatMembersComponent } from './chat-members/chat-members.component';

import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@NgModule({
  declarations: [
    UserCardComponent,
    GroupCharCardComponent,
    GroupChatCreateComponent,
    ChatMembersComponent
  ],
  exports: [
    UserCardComponent,
    GroupCharCardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    GravatarModule,
    FormModule,
    TimeagoModule,
    UploadFileModule,
    PickerModule,
    EmojiModule
  ],
  providers: [
    ChatCardManager
  ]
})
export class ChatCardModule { }
