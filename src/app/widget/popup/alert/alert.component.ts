import { Component, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAlertPopup, PopupData } from '../popup.manager';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IAlertPopup,
    public dialogRef: MatDialogRef<AlertComponent>,
    private elementRef: ElementRef<HTMLElement>
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get element() {
    return this.elementRef.nativeElement;
  }

}
