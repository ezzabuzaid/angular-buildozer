import { Injectable } from '@angular/core';
import { SidebarComponent } from './sidebar.component';

@Injectable({
  providedIn: 'root'
})
export class SidebarManager {
  components: { name: string, sidebar: SidebarComponent }[] = [];
  constructor() { }

  registerSidebar(name: string, sidebar: SidebarComponent) {
    this.components.push({ name, sidebar });
  }

  unregisterSidebar(name: string) {
    const index = this.components.findIndex(el => el.name === name);
    this.components.splice(index, 1);
  }

  getSidebar(name: string) {
    const sidebarWrapper = this.components.find(el => el.name === name);
    return sidebarWrapper && sidebarWrapper.sidebar;
  }

}

export enum RegisterdSidebar {
  NAVBAR = 'navbar',
  CHAT = 'chat_bar'
}

