type Direction = 'right' | 'bottom' | 'top' | 'left' | 'bottom_right';
interface Point {
    x: number;
    y: number;
}


interface IResizableOptions {
    axis: 'horizontal' | 'vertical' | 'both';
    /**
     * Position of the resizer element
     * 
     * axis === 'horizontal' && position === 'positive' = right edge
     * axis === 'horizontal' && position === 'negative' = left edge
     * axis === 'horizontal' && position === 'hyber' = both edges
     *
     * axis === 'vertical' && position === 'positive' = top edge
     * axis === 'vertical' && position === 'negative' = bottom edge
     * axis === 'vertical' && position === 'hyber' = both edges
     *
     * axis === 'both' && position === 'positive' = right and top edges
     * axis === 'both' && position === 'negative' = bottom and left edges
     * axis === 'both' && position === 'hyber' = all edges
     * 
     */
    position: 'positive' | 'negative' | 'hyber';
    bounded: boolean | HTMLElement;
    resizer?: HTMLElement;
    maxWidthThreshold?: number | string;
    minWidthThreshold?: number | string;
    minHeightThreshold?: number | string;
    maxHeightThreshold?: number | string
    maxWidthExceeded?();
    minWidthExceeded?();
}

export class Resizable {
    private cursorDirections = {
        left: 'w-resize',
        right: 'e-resize'
    }
    private resizing = false;
    lastXvalue = 0;
    lastYvalue = 0;
    direction: Direction;

    private trackMouseDirection(event): Direction {
        let direction: Direction = null;
        if (event.pageX > this.lastXvalue && event.pageY > this.lastYvalue) {
            this.direction = 'bottom_right';
        }
        if (event.pageX > this.lastXvalue && event.pageY == this.lastYvalue) {
            this.direction = "right";
        }
        else if (event.pageX == this.lastXvalue && event.pageY > this.lastYvalue) {
            this.direction = "bottom";
        }
        else if (event.pageX == this.lastXvalue && event.pageY < this.lastYvalue) {
            this.direction = "top";
        }
        else if (event.pageX < this.lastXvalue && event.pageY == this.lastYvalue) {
            this.direction = "left";
        }
        this.lastXvalue = event.pageX;
        this.lastYvalue = event.pageY;
        return direction;
    }

    private updateResizerCursor(event) {
        this.options.resizer.style.setProperty('cursor', this.cursorDirections[this.direction]);
    }

    private makeResizer(position) {
        const resizer = document.createElement('div');
        const cssText = `
            position: absolute;cursor: ew-resize;display: block;
            height: 100%;width: 3px;background-color: transparent;z-index: 0;
        `;
        resizer.style.cssText = cssText;
        resizer.style.setProperty('left', `${ this.element.offsetLeft }px`);
        resizer.style.setProperty('height', `${ this.element.offsetHeight }px`);
        resizer.style.setProperty(position, `${ 0 - resizer.clientWidth }px`);

        hover(
            resizer,
            () => resizer.style.setProperty('background-color', '#c8c8c8'),
            () => resizer.style.setProperty('background-color', 'transparent'),
        );
        return resizer;
    }

    constructor(
        private element: HTMLElement,
        private options?: IResizableOptions
    ) {
        if (this.options.axis === 'horizontal') {
            let position = this.options.position === 'positive' ? 'right' : 'left';
            options.resizer = this.makeResizer(position);
        }
        this.element.style.setProperty('position', 'relative');
        this.element.appendChild(options.resizer);
        // this.element.style.setProperty('resize', this.options.axis);
        this.element.style.setProperty('max-width', this.boundries().maxX() + 'px');
        this.element.style.setProperty('min-width', this.boundries().minX() + 'px');

        this.attachEvents(options.resizer);
    }

    private attachEvents(element: HTMLElement) {
        // Check if pointer events are supported.
        if (window['PointerEvent']) {
            // Add Pointer Event Listener
            element.addEventListener('pointerdown', this.handleGestureStart.bind(this), true);
            element.addEventListener('pointermove', this.handleGestureMove.bind(this), true);
            element.addEventListener('pointermove', this.trackMouseDirection.bind(this), true);
            element.addEventListener('pointerup', this.handleGestureEnd.bind(this), true);
            element.addEventListener('pointercancel', this.handleGestureEnd.bind(this), true);
        } else {
            // Add Touch Listener
            element.addEventListener('touchstart', this.handleGestureStart.bind(this), true);
            element.addEventListener('touchmove', this.handleGestureMove.bind(this), true);
            element.addEventListener('touchmove', this.trackMouseDirection.bind(this), true);
            element.addEventListener('touchend', this.handleGestureEnd.bind(this), true);
            element.addEventListener('touchcancel', this.handleGestureEnd.bind(this), true);

            // Add Mouse Listener
            element.addEventListener('mousedown', this.handleGestureStart.bind(this), true);
        }
    }

    private handleGestureStart(evt) {
        evt.preventDefault();

        if (evt.touches && evt.touches.length > 1) {
            return;
        }

        // Add the move and end listeners
        if (window['PointerEvent']) {
            evt.target.setPointerCapture(evt.pointerId);
        } else {
            // Add Mouse Listeners
            document.addEventListener('mousemove', this.handleGestureMove.bind(this), true);
            document.addEventListener('mouseup', this.handleGestureEnd.bind(this), true);
        }
        this.resizing = true;
    }

    private handleGestureEnd(evt) {
        evt.preventDefault();

        if (evt.touches && evt.touches.length > 0) {
            return;
        }

        // Remove Event Listeners
        if (window['PointerEvent']) {
            evt.target.releasePointerCapture(evt.pointerId);
        } else {
            document.removeEventListener('mousemove', this.handleGestureMove.bind(this), true);
            document.removeEventListener('mouseup', this.handleGestureEnd.bind(this), true);
        }

        if (this.element.offsetWidth >= this.boundries().maxX()) {
            this.options.maxWidthExceeded?.call(this);
        }

        if (this.element.offsetWidth <= this.boundries().minX()) {
            this.options.minWidthExceeded?.call(this);
        }

        this.resizing = false;
    }

    private handleGestureMove(evt) {
        evt.preventDefault();

        if (!this.resizing) {
            return;
        }
        if (
            (
                this.element.offsetWidth >= this.boundries().maxX()
                &&
                this.direction !== 'left'
            )
            ||
            (
                this.element.offsetWidth <= this.boundries().minX()
                &&
                this.direction !== 'right'
            )
        ) {
            return;
        }

        if (this.element.offsetWidth >= this.boundries().maxX()) {
            this.element.style.setProperty('width', `${ this.element.offsetWidth - 10 }px`);
            return;
        }

        const vector = this.getVector(evt);
        if (this.options.axis === 'horizontal') {
            const offset = this.element.offsetWidth - vector.x;
            console.log(offset);
            this.element.style.setProperty('width', `${ vector.x }px`);
            this.element.style.setProperty('left', `${ vector.x }px`);
        }
        if (this.options.axis === 'vertical') {
            this.element.style.setProperty('height', `${ this.element.offsetHeight - vector.y }px`);
        }

        if (this.options.axis === 'both') {
            this.element.style.setProperty('width', `${ this.element.offsetWidth - vector.x }px`);
            this.element.style.setProperty('height', `${ this.element.offsetHeight - vector.y }px`);
        }
    }

    private getVector(evt): Point {
        const point = { x: evt.x, y: evt.y };
        console.log(point);
        let element = this.element;
        let maxOffsetLeft = 0;
        let maxOffsetTop = 0;
        while (element.offsetParent) {
            maxOffsetLeft += element.offsetLeft;
            maxOffsetTop += element.offsetTop;
            element = element.offsetParent as HTMLElement;
        }

        // let x = point.x - maxOffsetLeft;
        // let y = point.y - maxOffsetTop;
        // x = (this.options.position === 'positive') ? this.element.offsetWidth - x : x;
        return {
            x: point.x,
            y: null
        };
    }

    private pxToPercentege(pixels: number) {
        const screenWidth = window.screen.width;
        return pixels / screenWidth * 100;
    }

    private percentegeToPx(percentge: number) {
        return percentge * this.options.resizer.clientWidth / 100;
    }

    private getHostOffset(property: keyof CSSStyleDeclaration) {
        return this.formatOffsetValue(this.cssValue(this.element, property));
    }

    private boundries() {
        return {
            maxX: () => {
                let maxWidth = this.getHostOffset('maxWidth');
                if (!maxWidth) {
                    if (this.options.bounded) {
                        maxWidth = this.element.parentElement.offsetWidth;
                    } else {
                        maxWidth = document.body.offsetWidth;
                    }
                }
                return maxWidth + this.formatOffsetValue(String(this.options.maxWidthThreshold));
            },
            minX: () => {
                let minWidth = this.getHostOffset('minWidth');
                return minWidth + this.formatOffsetValue(String(this.options.minWidthThreshold));
            },
            maxY: () => {
                let maxHeight = this.getHostOffset('maxHeight');
                if (!maxHeight) {
                    if (this.options.bounded) {
                        maxHeight = this.element.parentElement.offsetWidth;
                    } else {
                        maxHeight = document.body.offsetWidth;
                    }
                }
                return maxHeight + this.formatOffsetValue(String(this.options.maxHeightThreshold));
            },
            minY: () => {
                let minHeight = this.getHostOffset('minHeight');
                return minHeight + this.formatOffsetValue(String(this.options.minHeightThreshold));
            },
        }
    }

    private formatOffsetValue(width: string): number {
        let value = width as any;
        if (width.includes('%')) {
            value = this.percentegeToPx(+width.replace('%', ''));
        } else if (width.includes('px')) {
            value = +width.replace('px', '');
        }
        if (isNaN(value)) {
            return 0;
        }
        return +value;
    }

    private cssValue(element: HTMLElement, property: keyof CSSStyleDeclaration) {
        return window.getComputedStyle(element).getPropertyValue(property as string);
    }
}


function hover(
    element: HTMLElement,
    enter,
    leave
) {
    element.addEventListener('mouseenter', () => enter());
    element.addEventListener('mouseleave', () => leave());
}