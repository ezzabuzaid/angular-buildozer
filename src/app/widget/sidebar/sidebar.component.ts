import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
// import { Resizable } from '../../resizeable';
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

  get drawer() {
    return this.element.querySelector('[sidebar-drawer]') as HTMLElement;
  }

  get resizer() {
    return this.element.querySelector('.resizer') as HTMLElement;
  }

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
      // new Resizable(this.drawer, {
      //   // resizer: this.resizer,
      //   direction: 'right',
      //   bounded: true
      // })
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

}

interface ISidebarToggle {
  toggle: boolean;
}
