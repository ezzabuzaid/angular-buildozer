import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { MediaModel } from '@shared/models';
import { UploadService } from '@shared/services/upload';
import { PopupManager } from '@widget/popup';
import { switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-media-card',
  templateUrl: './media-card.component.html',
  styleUrls: ['./media-card.component.scss']
})
export class MediaCardComponent implements OnInit {
  @Input() file: MediaModel.IFile;
  @Output() onMarkChange = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @Input()
  @HostBinding('class.checked')
  checked = false;

  constructor(
    private popupManager: PopupManager,
    private uploadsService: UploadService
  ) { }

  ngOnInit() { }

  toggleChecking() {
    this.onMarkChange.emit(this.file);
    this.checked = !this.checked;
  }

  get isImage() {
    return [
      'image/jpg', 'image/JPG', 'image/jpeg', 'image/JPEG',
      'image/png', 'image/PNG', 'image/gif', 'image/GIF',
    ].includes(this.file.fullType);
  }

  deleteFile() {
    this.onDelete.emit(this.file._id);
  }

  renameFile() {
    this.popupManager.prompt({
      hasBackdrop: true,
      data: {
        confirm: 'Save',
        value: this.file.name
      }
    })
      .afterClosed()
      .pipe(
        filter(name => name !== this.file.name),
        switchMap(name => {
          this.file.name = name;
          return this.uploadsService.updateFile({ name, _id: this.file._id });
        }))
      .subscribe();
  };

}
