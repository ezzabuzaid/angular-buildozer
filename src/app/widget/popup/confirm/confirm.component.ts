import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IConfirmPopup } from '../popup.manager';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  public result = null;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IConfirmPopup,
    public dialogRef: MatDialogRef<ConfirmComponent>,
  ) { }

  onNoClick(value: boolean): void {
    this.result = value;
    this.dialogRef.close(value);
  }

  ngOnInit() { }


}
