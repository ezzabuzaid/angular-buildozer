import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaHubRoutingModule } from './media-hub-routing.module';
import { MediaHubFoldersComponent } from './media-hub-folders/media-hub-folders.component';
import { MediaCardComponent } from './media-card/media-card.component';
import { MaterialModule } from '@shared/common';
import { MediaHubGateComponent } from './media-hub-gate/media-hub-gate.component';
import { MediaHubHeaderComponent } from './media-hub-header/media-hub-header.component';
import { MediaHubGridViewComponent } from './media-hub-grid-view/media-hub-grid-view.component';
import { MediaHubListViewComponent } from './media-hub-list-view/media-hub-list-view.component';
import { UploadFileModule } from '@widget/upload-file';
import { FileControlModule } from '@widget/file-control/file-control.module';
import { MediaHubManager } from './media-hub.manager';


@NgModule({
  declarations: [
    MediaHubFoldersComponent,
    MediaCardComponent,
    MediaHubGateComponent,
    MediaHubHeaderComponent,
    MediaHubGridViewComponent,
    MediaHubListViewComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MediaHubRoutingModule,
    UploadFileModule,
    FileControlModule
  ],
  providers: []
})
export class MediaHubModule { }
