import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPromptPopup } from '../popup.manager';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {
  constructor(
    private readonly dialogRef: MatDialogRef<PromptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPromptPopup,
  ) { }

  ngOnInit() { }

  onNoClick(): void {
    this.dialogRef.close(this.data.value.trim());
  }

}
