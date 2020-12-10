import { TestBed, waitForAsync } from '@angular/core/testing';

import { MatProgressBar } from '@angular/material/progress-bar';
import { MaterialModule } from '@shared/common';
import { isObservable } from 'rxjs';
import { skip } from 'rxjs/operators';
import { TestUtility } from 'test/fixture';
import { ProgressBarComponent } from './progress-bar.component';
import { ProgressBarManager } from './progress-bar.manager';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let testUtility: TestUtility<ProgressBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressBarComponent],
      imports: [MaterialModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testUtility = new TestUtility(TestBed.createComponent(ProgressBarComponent));
    component = testUtility.fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ISOLATE', () => {
    it('[visible] property should be an Observable', () => {
      expect(isObservable(component)).toBeTruthy();
    });

    it('[visible] property should hold [distinctUntilChanged] operator', () => {
      expect(component.visible).toBeTruthy();
    });

    it('[visible] property should listen to progress bar manager', (done) => {
      component.visible
        .pipe(skip(1))
        .subscribe(value => {
          expect(value).toBe(true);
          done();
        });
      TestBed.inject(ProgressBarManager).notify(true);
    });
  });

  describe('#SHADOW', () => {
    describe('<mat-progress-bar>', () => {
      it('should not be presented if the value of [visible] is false', () => {
        TestBed.inject(ProgressBarManager).hide();
        testUtility.detectChanges();

        const matProgressBar = testUtility.getComponentDebug(MatProgressBar);
        expect(matProgressBar).toBeFalsy();
      });
      it('should be presented if the value of [visible] is true', () => {
        TestBed.inject(ProgressBarManager).show();
        testUtility.detectChanges();

        const matProgressBar = testUtility.getComponentDebug(MatProgressBar);
        expect(matProgressBar).toBeTruthy();
      });
      it('should have a mode equal to indeterminate', () => {
        TestBed.inject(ProgressBarManager).show();
        testUtility.detectChanges();

        const matProgressBar = testUtility.getComponent(MatProgressBar);
        expect(matProgressBar.mode).toMatch('indeterminate');
      });
      it('should have a color equal to accent', () => {
        TestBed.inject(ProgressBarManager).show();
        testUtility.detectChanges();

        const matProgressBar = testUtility.getComponent(MatProgressBar);
        expect(matProgressBar.color).toMatch('accent');
      });
    });
  });

});

describe('ProgressBarManager', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgressBarManager],
    });
  });

  it('[show] should call [notify] with true as argument', () => {
    const service = TestBed.inject(ProgressBarManager);
    spyOn(service, 'notify');

    service.show();

    expect(service.notify).toHaveBeenCalledTimes(1);
    expect(service.notify).toHaveBeenCalledWith(true);
  });

  it('[hide] should call [notify] with false as argument', () => {
    const service = TestBed.inject(ProgressBarManager);
    spyOn(service, 'notify');

    service.hide();

    expect(service.notify).toHaveBeenCalledTimes(1);
    expect(service.notify).toHaveBeenCalledWith(false);
  });

});
