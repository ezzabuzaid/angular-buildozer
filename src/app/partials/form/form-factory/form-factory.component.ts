import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IField, EFieldType } from '../field-factory';

@Component({
  selector: 'app-field-factory',
  templateUrl: './form-factory.component.html',
  styleUrls: ['./form-factory.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FieldFactoryComponent),
    multi: true
  }]
})

export class FieldFactoryComponent implements OnInit {
  @Input() field: IField<any>;
  types = EFieldType;

  constructor() { }

  ngOnInit() {
  }

}
