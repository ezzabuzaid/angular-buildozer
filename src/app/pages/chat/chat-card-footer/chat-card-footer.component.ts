import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TokenHelper } from '@core/helpers/token';
import { AppUtils, StringUtils } from '@core/helpers/utils';
import * as EmojiButton from '@joeattardi/emoji-button';
import { ChatModel } from '@shared/models';
import { MediaHubManager } from 'app/pages/media-hub/media-hub.manager';
import { filter } from 'rxjs/operators';
import { ChatManager } from '../chat.manager';
@Component({
  selector: 'app-chat-card-footer',
  templateUrl: './chat-card-footer.component.html',
  styleUrls: ['./chat-card-footer.component.scss'],
})
export class ChatCardFooterComponent implements OnInit {
  @Input() room: ChatModel.Room;
  @Input() external = false;
  @Output() onSendMessage = new EventEmitter();
  @Output() onActionBarVisibilityChange = new EventEmitter<HTMLElement>(true);

  files: File[] = [];
  base64Files = [];
  showActionBar = false;
  emojiPicker = new EmojiButton({
    position: 'top',
    autoHide: false,
    showSearch: false,
    autoFocusSearch: false,
    showRecents: false,
    showPreview: false,
    categories: ['smileys'],
    theme: 'auto'
  });
  messageFormControl = new FormControl('');

  constructor(
    private readonly chatManager: ChatManager,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly mediaHubManager: MediaHubManager,
    private readonly tokenService: TokenHelper
  ) { }

  ngOnInit() {
    this.emojiPicker.on('emoji', emoji => {
      this.messageFormControl.setValue(this.messageFormControl.value + emoji);
    });
    this.messageFormControl.valueChanges
      .subscribe(value => {
        this.onActionBarVisibilityChange.emit(this.element);
      });
  }

  openEmojiPicker(event) {
    this.emojiPicker.showPicker(this.element);
  }

  @HostListener('click')
  closeEmojiPicker() {
    if (this.emojiPicker.pickerVisible) {
      this.emojiPicker.hidePicker();
    }
  }

  sendMessage() {
    if (AppUtils.notEmpty(this.files)) {
      for (const file of this.files) {
        this.chatManager.sendLocalMessage(this.createFileMessage(file));
      }
      this.hideActionBar();
    }

    const text = this.messageFormControl.value as string;
    if (AppUtils.isTruthy(text)) {
      this.messageFormControl.setValue('', { emitEvent: false });
      if (this.external) {
        this.onSendMessage.emit(text);
      } else {
        this.chatManager.sendLocalMessage(this.createMessage(text));
      }
    }
  }

  createMessage(text: string) {
    return new ChatModel.Message({
      text,
      rawFile: null,
      user: this.tokenService.decodedToken.id,
      room: this.room._id,
    });
  }

  createFileMessage(file: File = null) {
    return new ChatModel.Message({
      text: null,
      rawFile: file,
      user: this.tokenService.decodedToken.id,
      room: this.room._id,
    });
  }

  openActionBar() {
    this.showActionBar = !this.showActionBar;
    if (!this.showActionBar) {
      this.files = [];
      this.base64Files = [];
    }
  }

  uploadFiles(files: FileList) {
    this.files = Array.from(files);
    this.base64Files = this.files.map(file => AppUtils.readFile(file));
  }

  disposeFile(index: number) {
    this.base64Files.splice(index, 1);
    this.files.splice(index, 1);
    if (AppUtils.isEmpty(this.base64Files)) {
      this.showActionBar = false;
    }
  }

  openMediaPicker() {
    this.mediaHubManager.openMediaPicker(this.room._id)
      .afterClosed()
      .pipe(filter(AppUtils.notEmpty))
      .subscribe((files) => {
        files.forEach(file => {
          this.chatManager.sendLocalMessage(this.createMessage(file.path));
        });
      });
  }

  get element() {
    return this.elementRef.nativeElement;

  }

  isImage(type: string) {
    return StringUtils.isImage(type);
  }

  hideActionBar() {
    this.showActionBar = false;
    this.files = [];
    this.base64Files = [];
  }

}
