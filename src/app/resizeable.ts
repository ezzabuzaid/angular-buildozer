
type Direction = 'right' | 'bottom' | 'top' | 'left' | 'bottom_right';
type Position = 'positive' | 'negative' | 'hyber';
interface Point {
    x: number;
    y: number;
}

interface IResizer {
    element: HTMLElement;
    status?: 'on' | 'off';
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
    position: Position;
    bounded: boolean | HTMLElement;
    // resizer?: HTMLElement;
    maxWidthThreshold?: number | string;
    minWidthThreshold?: number | string;
    minHeightThreshold?: number | string;
    maxHeightThreshold?: number | string;
    maxWidthExceeded?();
    minWidthExceeded?();
}

export class Resizable {
    private resizing = false;
    lastXvalue = 0;
    lastYvalue = 0;
    cursorDirection: Direction;
    private resizers = new Map<'left' | 'top' | 'right' | 'bottom', IResizer>();
    private connectResizer(position: Position) {
        const direction = position === 'positive' ? 'right' : 'left';
        const resizer = this.makeResizer(direction);
        this.resizers.set(direction, { element: resizer });
        this.element.appendChild(resizer);
        this.attachEvents(resizer);
    }

    constructor(
        private element: HTMLElement,
        private options?: IResizableOptions
    ) {
        if (this.options.axis === 'horizontal') {
            if (this.options.position === 'hyber') {
                (<Position[]>['positive', 'negative']).forEach(position => {
                    this.connectResizer(position);
                });
            } else {
                this.connectResizer(this.options.position);
            }
        }
        this.element.style.setProperty('position', 'relative');
        this.element.style.setProperty('max-width', this.boundries().maxX() + 'px');
        this.element.style.setProperty('min-width', this.boundries().minX() + 'px');

    }

    private trackMouseDirection(event): Direction {
        const direction: Direction = null;
        if (event.pageX > this.lastXvalue && event.pageY > this.lastYvalue) {
            this.cursorDirection = 'bottom_right';
        }
        if (event.pageX > this.lastXvalue && event.pageY == this.lastYvalue) {
            this.cursorDirection = 'right';
        }
        else if (event.pageX == this.lastXvalue && event.pageY > this.lastYvalue) {
            this.cursorDirection = 'bottom';
        }
        else if (event.pageX == this.lastXvalue && event.pageY < this.lastYvalue) {
            this.cursorDirection = 'top';
        }
        else if (event.pageX < this.lastXvalue && event.pageY == this.lastYvalue) {
            this.cursorDirection = 'left';
        }
        this.lastXvalue = event.pageX;
        this.lastYvalue = event.pageY;
        return direction;
    }

    // private updateResizerCursor(event) {
    //     this.options.resizer.style.setProperty('cursor', this.cursorDirections[this.direction]);
    // }

    private makeResizer(direction: 'right' | 'left') {
        const resizer = document.createElement('div');
        const cssText = `
            position: absolute;cursor: ew-resize;display: block;
            height: 100%;width: 3px;background-color: transparent;z-index: 0;
            top:0;
        `;
        const rect = this.element.getBoundingClientRect();
        resizer.style.cssText = cssText;
        resizer.style.setProperty(direction, `${ 0 - resizer.clientWidth }px`);
        // resizer.style.setProperty(direction, `${ window.innerWidth - rect.right - resizer.clientWidth }px`);
        // resizer.style.setProperty('height', `${ this.element.offsetHeight }px`);
        // resizer.style.setProperty('top', rect.top + 'px');

        hover(
            resizer,
            () => resizer.style.setProperty('background-color', '#c8c8c8'),
            () => resizer.style.setProperty('background-color', 'transparent'),
        );
        return resizer;
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
        // if (
        //     (
        //         this.element.offsetWidth >= this.boundries().maxX()
        //         &&
        //         this.cursorDirection !== 'left'
        //     )
        //     ||
        //     (
        //         this.element.offsetWidth <= this.boundries().minX()
        //         &&
        //         this.cursorDirection !== 'right'
        //     )
        // ) {
        //     return;
        // }

        // if (this.element.offsetWidth >= this.boundries().maxX()) {
        //     this.element.style.setProperty('width', `${ this.element.offsetWidth - 10 }px`);
        //     return;
        // }

        const point = this.getPoint(evt);


        if (this.options.axis === 'horizontal') {
            switch (this.options.position) {
                case 'positive':
                    this.moveXPositive(point.x);
                    break;
                case 'negative':
                    this.moveXNegative(point.x);
                    break;
                default:
                    const direction = ['left', 'right', 'top', 'bottom'].find(direction => evt.srcElement.style.getPropertyValue(direction));
                    switch (direction) {
                        case 'right':
                            this.moveXPositive(point.x);
                            break;
                        case 'left':
                            this.moveXNegative(point.x);
                            break;

                        default:
                            break;
                    }
                    break;
            }
        }

        if (this.options.axis === 'vertical') {
            this.element.style.setProperty('height', `${ this.element.offsetHeight - point.y } px`);
        }

        if (this.options.axis === 'both') {
            this.element.style.setProperty('width', `${ this.element.offsetWidth - point.x } px`);
            this.element.style.setProperty('height', `${ this.element.offsetHeight - point.y } px`);
        }
    }

    private moveXPositive(offset: number) {
        this.element.style.setProperty('width', `${ offset }px`);
    }
    private moveXNegative(offset: number) {
        const rect = this.element.getBoundingClientRect();
        const originalWidth = rect.right - this.element.offsetLeft;
        const width = originalWidth - offset;
        this.element.style.setProperty('width', `${ width }px`);

        // const right = this.boundries().maxX() - width;
        const right = this.element.getBoundingClientRect().right - this.element.getBoundingClientRect().x - window.innerWidth;
        console.log(right, '___', width);
        // if(offset>1)
        if (width > this.boundries().minX()) {
            this.element.style.setProperty('right', `-${ right }px`);
        }
    }

    private getPoint(evt): Point {
        const point = { x: evt.x, y: evt.y };
        let element = this.element;
        let maxOffsetLeft = 0;
        let maxOffsetTop = 0;
        while (element.offsetParent) {
            maxOffsetLeft += element.offsetLeft;
            maxOffsetTop += element.offsetTop;
            element = element.offsetParent as HTMLElement;
        }

        // Remove the initial jumb 
        point.x -= maxOffsetLeft;
        // point.y -= maxOffsetTop;

        // x = (this.options.position === 'positive') ? this.element.offsetWidth - x : x;
        return {
            x: point.x,
            y: null
        };
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
                const minWidth = this.getHostOffset('minWidth');
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
                const minHeight = this.getHostOffset('minHeight');
                return minHeight + this.formatOffsetValue(String(this.options.minHeightThreshold));
            },
        };
    }

    private formatOffsetValue(width: string): number {
        let value = width as any;
        if (width.includes('%')) {
            const percentge = +width.replace('%', '');
            value = percentge * this.element.clientWidth / 100
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

function pxToPercentege(pixels: number) {
    const screenWidth = window.screen.width;
    return pixels / screenWidth * 100;
}