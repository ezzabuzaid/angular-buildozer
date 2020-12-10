import { TestBed, waitForAsync } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@shared/common';
import { TestUtility } from 'test/fixture';
import { FavoriteCheckboxComponent } from './favorite-checkbox.component';

describe('FavoriteCheckboxComponent', () => {
  let component: FavoriteCheckboxComponent;
  let testUtility: TestUtility<FavoriteCheckboxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FavoriteCheckboxComponent],
      imports: [MaterialModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testUtility = new TestUtility(TestBed.createComponent(FavoriteCheckboxComponent));
    component = testUtility.fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ISOLATE', () => {
    it('should have false as initial checked value ', () => {
      expect(component.checked).toBe(false);
    });
    it('should have false as initial readonly value ', () => {
      expect(component.readonly).toBe(false);
    });
    it('should have id property', () => {
      expect(component.id).toBeDefined();
    });

    describe('[onChange]', () => {
      it('should assign the passed argument to checked property', () => {
        component.readonly = false;
        component.checked = false;

        component.onChange(true);

        expect(component.checked).toBe(true);
      });
      it('should not assign the passed argument to checked property if the readonly property true', () => {
        component.readonly = true;
        component.checked = false;

        component.onChange(true);

        expect(component.checked).toBe(false);
      });
    });

  });

  describe('#SHADOW', () => {
    describe('<input>[type="checkbox"]', () => {
      let inputElement: HTMLInputElement;

      beforeEach(() => {
        inputElement = testUtility.querySelector('input');
      });

      it('should have checkbox type', () => {
        expect(inputElement.type).toMatch('checkbox');
      });

      it('should have an id attribute with the value bounded from the component', () => {
        testUtility.detectChanges();

        expect(inputElement.id).toMatch(component.id);
      });

      it('should have a checked attribute with the value bounded from the component', () => {
        testUtility.detectChanges();

        expect(inputElement.checked).toBe(component.checked);
      });

      it('should have a hidden attribute', () => {
        testUtility.detectChanges();

        expect(inputElement.hidden).toBe(true);
      });

      it('should call [onChange] when the value changed with input value as argument', () => {
        inputElement.checked = true;
        spyOn(component, 'onChange');

        inputElement.dispatchEvent(new Event('change', {
          bubbles: true,
          cancelable: true,
        }));

        expect(component.onChange).toHaveBeenCalledTimes(1);
        expect(component.onChange).toHaveBeenCalledWith(inputElement.checked);
      });

    });
    describe('<label>', () => {
      let labelElement: HTMLLabelElement;

      beforeEach(() => {
        labelElement = testUtility.querySelector('label');
      });

      it('should have [for] attribute with the value bounded from the component', () => {
        testUtility.detectChanges();

        expect(labelElement.getAttribute('for')).toMatch(component.id);
      });

      it('should have a favorite icon if the [checked] value is true', () => {
        component.checked = true;

        testUtility.detectChanges();

        expect(labelElement.textContent).toBe('favorite');
      });

      it('should have a favorite_border icon if the [checked] value is false', () => {
        component.checked = false;

        testUtility.detectChanges();

        expect(labelElement.textContent).toBe('favorite_border');
      });

    });
  });

});
