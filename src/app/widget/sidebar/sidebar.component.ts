import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { AppUtils } from '@core/helpers/utils';
import { WINDOW } from '@shared/common';
import { SidebarManager } from './sidebar.manager';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  get element() {
    return this.elementRef.nativeElement;
  }

  get direction() {
    return this.right ? 'right' : 'left';
  }

  get drawer() {
    return this.element.querySelector('[sidebar-drawer]') as HTMLElement;
  }

  get resizer() {
    return this.element.querySelector('.resizer') as HTMLElement;
  }

  private initialTouchPos;
  @Input() @HostBinding('class.opened') public opened = false;
  @Input() @HostBinding('class.right') public right = false;
  @Input() resizable = true;
  @HostBinding('class.resizing') public resizing = false;
  @Input() public minWidth = 0;
  @Input() public maxWidth = 0;
  @Input() public name = '';

  @Output() onToggle = new EventEmitter<ISidebarToggle>();
  @Output() maxWidthExceeded = new EventEmitter<number>();
  @Output() minWidthExceeded = new EventEmitter<number>();
  constructor(
    private readonly sidebarService: SidebarManager,
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private readonly platformId: any,
    @Inject(WINDOW) private readonly window: Window,
  ) { }

  ngOnInit() {
    this.sidebarService.registerSidebar(this.name, this);
  }

  ngAfterViewInit() {
    if (this.resizable && isPlatformBrowser(this.platformId)) {
      const cursor = this.right ? 'w-resize' : 'e-resize';
      this.resizer.style.setProperty('cursor', cursor);
      this.setResizerPosition({
        direction: this.direction,
        offset: this.formatWidthValue(this.window.getComputedStyle(this.element).getPropertyValue('--width'))
      });
      this.attachEvents(this.resizer);
    }
  }

  toggle(value?: boolean) {
    this.opened = value ?? !this.opened;
    this.onToggle.next({ toggle: this.opened });
  }

  open() {
    this.toggle(true);
  }

  close() {
    this.toggle(false);
  }

  private attachEvents(element: HTMLElement) {
    // Check if pointer events are supported.
    if (this.window['PointerEvent']) {
      // Add Pointer Event Listener
      element.addEventListener('pointerdown', this.handleGestureStart.bind(this), true);
      element.addEventListener('pointermove', this.handleGestureMove.bind(this), true);
      element.addEventListener('pointerup', this.handleGestureEnd.bind(this), true);
      element.addEventListener('pointercancel', this.handleGestureEnd.bind(this), true);
    } else {
      // Add Touch Listener
      element.addEventListener('touchstart', this.handleGestureStart.bind(this), true);
      element.addEventListener('touchmove', this.handleGestureMove.bind(this), true);
      element.addEventListener('touchend', this.handleGestureEnd.bind(this), true);
      element.addEventListener('touchcancel', this.handleGestureEnd.bind(this), true);

      // Add Mouse Listener
      element.addEventListener('mousedown', this.handleGestureStart.bind(this), true);
    }
  }

  private handleGestureStart(evt) {
    evt.preventDefault();
    console.log('handleGestureStart');
    this.resizing = true;

    if (evt.touches && evt.touches.length > 1) {
      return;
    }

    // Add the move and end listeners
    if (this.window['PointerEvent']) {
      evt.target.setPointerCapture(evt.pointerId);
    } else {
      // Add Mouse Listeners
      document.addEventListener('mousemove', this.handleGestureMove.bind(this), true);
      document.addEventListener('mouseup', this.handleGestureEnd.bind(this), true);
    }

    this.initialTouchPos = this.getVector(evt);
  }

  private handleGestureEnd(evt) {
    evt.preventDefault();
    console.log('handleGestureEnd');
    this.resizing = false;

    if (evt.touches && evt.touches.length > 0) {
      return;
    }

    // Remove Event Listeners
    if (this.window['PointerEvent']) {
      evt.target.releasePointerCapture(evt.pointerId);
    } else {
      document.removeEventListener('mousemove', this.handleGestureMove.bind(this), true);
      document.removeEventListener('mouseup', this.handleGestureEnd.bind(this), true);
    }

    const vector = this.getVector(evt);
    if (this.isExceededMaxWidth(vector.offset)) {
      this.maxWidthExceeded.emit();
    }
    if (this.isExceededMinWidth(vector.offset)) {
      this.minWidthExceeded.emit();
    }

    this.element.style.setProperty('--width', `${ vector.offset }px`);

    this.initialTouchPos = null;
  }

  private handleGestureMove(evt) {
    evt.preventDefault();

    if (AppUtils.isNullorUndefined(this.initialTouchPos)) {
      return;
    }
    const vector = this.getVector(evt);
    if (
      this.isExceededMaxWidth(vector.offset)
      ||
      this.isExceededMinWidth(vector.offset)
    ) {
      return;
    }

    this.setResizerPosition(vector);

  }

  setResizerPosition(vector: Vector) {
    this.resizer.style.setProperty(vector.direction, `${ vector.offset - this.resizer.clientWidth }px`);
  }

  private getVector(evt): Vector {
    const point = { x: evt.x, y: evt.y };
    let element = this.element;
    let maxOffsetLeft = 0;
    let maxOffsetTop = 0;
    while (element.offsetParent) {
      maxOffsetLeft += element.offsetLeft;
      maxOffsetTop += element.offsetTop;
      element = element.offsetParent as HTMLElement;
    }

    point.x -= maxOffsetLeft;
    point.y -= maxOffsetTop;
    point.x = this.right ? this.element.offsetWidth - point.x : point.x;

    const maxWidth = this.getDrawerOffset('maxWidth') || this.element.offsetWidth;
    const minWidth = this.getDrawerOffset('minWidth') || 0;

    if (point.x >= maxWidth) {
      point.x = maxWidth;
    }
    if (point.x < minWidth) {
      point.x = minWidth;
    }
    return {
      direction: this.direction,
      offset: point.x
    };
  }

  // @ts-ignore
  private pxToPercentege(pixels: number) {
    const screenWidth = this.window.screen.width;
    return pixels / screenWidth * 100;
  }

  private percentegeToPx(percentge: number) {
    return percentge * this.element.clientWidth / 100;
  }

  private isExceededMaxWidth(pixels: number) {
    const maxWidth = this.getDrawerOffset('maxWidth') || false;
    return maxWidth && pixels >= maxWidth;
  }

  private isExceededMinWidth(pixels: number) {
    return pixels < this.getDrawerOffset('minWidth');
  }

  private getDrawerOffset(property: keyof CSSStyleDeclaration) {
    return this.formatWidthValue(this.cssValue(this.drawer, property));
  }

  private formatWidthValue(width: string): number {
    let value = width as any;
    if (width.includes('%')) {
      value = this.percentegeToPx(+width.replace('%', ''));
    } else if (width.includes('px')) {
      value = +width.replace('px', '');
    }
    if (isNaN(value)) {
      return null;
    }
    return value;
  }

  private cssValue(element: HTMLElement, property: keyof CSSStyleDeclaration) {
    return this.window.getComputedStyle(element).getPropertyValue(property as string);
  }

}

interface ISidebarToggle {
  toggle: boolean;
}

interface Vector {
  direction: 'left' | 'right';
  offset: number;
}
