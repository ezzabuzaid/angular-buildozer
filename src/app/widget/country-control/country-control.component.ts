import { ChangeDetectionStrategy, Component, forwardRef, Inject, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IField } from '@partials/form';
import { WINDOW } from '@shared/common';

@Component({
  selector: 'app-country-control',
  templateUrl: './country-control.component.html',
  styleUrls: ['./country-control.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CountryControlComponent),
    multi: true
  }],
})
export class CountryControlComponent implements OnInit, ControlValueAccessor {

  set value(value) {
    this._value = value;
    this.currentCountry = this.getCountry();
    this.notifyValueChange();
  }

  get value() {
    return this._value;
  }

  private _value: string;
  @Input() public formControl: IField<any> = null;
  public countries = [];
  public currentCountry = null;

  onChange: (value) => {};
  onTouched: () => {};

  constructor(
    @Inject(WINDOW) private readonly window: Window
  ) { }

  notifyValueChange() {
    if (this.onChange) {
      this.onChange(this.value);
    }
  }

  ngOnInit() {
    this.countries = this.window.intlTelInputGlobals.getCountryData()
  }

  public updateModel(value: string) {
    this.value = value;
  }

  public getCountry() {
    return this.countries.find(el => el.iso2 === this.formControl.value);
  }

  writeValue(value: string) {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}
