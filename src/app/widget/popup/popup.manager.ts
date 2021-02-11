import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertComponent } from './alert/alert.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { PromptComponent } from './prompt/prompt.component';

@Injectable()
export class PopupManager {
    private readonly defaultConfig: MatDialogConfig<any> = { width: '450px' };
    constructor(
        private readonly dialog: MatDialog
    ) { }

    alert(config: MatDialogConfig<PopupData> = {}) {
        return this.dialog.open<AlertComponent, PopupData, void>(AlertComponent, this.populateDialogConfig(config));
    }

    prompt(config: MatDialogConfig<IPromptPopup> = {}) {
        return this.dialog.open<PromptComponent, PopupData, string>(PromptComponent, this.populateDialogConfig(config));
    }

    confirm(config: MatDialogConfig<IConfirmPopup> = {}) {
        return this.dialog.open<ConfirmComponent, IConfirmPopup, boolean>(ConfirmComponent, this.populateDialogConfig(config));
    }

    private populateDialogConfig(config) {
        return { ...this.defaultConfig, ...config, };
    }

}

export interface PopupData {
    title?: string;
    description?: string;
}

export interface IAlertPopup extends PopupData {
    close?: string;
}
export interface IConfirmPopup extends PopupData {
    close?: string;
    confirm?: string;
}

export interface IPromptPopup extends PopupData {
    value?: string;
    confirm?: string;
}
