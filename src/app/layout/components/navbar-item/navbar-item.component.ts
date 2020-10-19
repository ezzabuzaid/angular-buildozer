import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { AppUtils } from '@core/helpers/utils';
import { NavigationItem } from '@layout/navbar/navigation';
import { MEDIA_BREAKPOINTS } from '@shared/common';
import { RegisterdSidebar, SidebarManager } from 'app/widget/sidebar';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navbar-item',
  templateUrl: './navbar-item.component.html',
  styleUrls: ['./navbar-item.component.scss']
})
export class NavbarItemComponent implements OnInit, OnDestroy {

  public get opened() {
    return this.sidebarService.getSidebar(RegisterdSidebar.NAVBAR).opened;
  }
  private readonly subscribtion = new Subject();
  @Input() public item: NavigationItem;
  @Input() public collapse = false;
  @Input() @HostBinding('class.dense') dense = false;

  constructor(
    private readonly sidebarService: SidebarManager,
    private readonly breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    AppUtils.unsubscribe(this.subscribtion);
  }

}

