import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[prevent-defaults]'
})
// FIXME: Rename it to prevents-bubbling
export class PreventDefaultsDirective implements OnInit {
    @Input('prevent-defaults') eventsNames: any = [];

    constructor(
        private elementRef: ElementRef<HTMLElement>
    ) { }

    ngOnInit(): void {
        [...this.eventsNames, 'click'].forEach((eventName) => {
            this.elementRef.nativeElement
                .addEventListener(eventName, (event) => {
                    event.stopPropagation();
                });
        });
    }


}
