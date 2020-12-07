// let resizing = false;
// let initialTouchPos = null;

// const callbacks = {

// }

// function attachEvents(element) {
//     // Check if pointer events are supported.
//     if (window['PointerEvent']) {
//         // Add Pointer Event Listener
//         element.addEventListener('pointerdown', handleGestureStart, true);
//         element.addEventListener('pointermove', handleGestureMove, true);
//         element.addEventListener('pointerup', handleGestureEnd, true);
//         element.addEventListener('pointercancel', handleGestureEnd, true);
//     } else {
//         // Use Touch Event Listener as fallback
//         element.addEventListener('touchstart', handleGestureStart, true);
//         element.addEventListener('touchmove', handleGestureMove, true);
//         element.addEventListener('touchend', handleGestureEnd, true);
//         element.addEventListener('touchcancel', handleGestureEnd, true);

//         // Add Mouse Listener
//         element.addEventListener('mousedown', handleGestureStart, true);
//     }
// }

// function handleGestureStart(evt) {
//     evt.preventDefault();
//     console.log('handleGestureStart');
//     resizing = true;

//     if (evt.touches && evt.touches.length > 1) {
//         return;
//     }

//     // Add the move and end listeners
//     if (window['PointerEvent']) {
//         evt.target.setPointerCapture(evt.pointerId);
//     } else {
//         // Add Mouse Listeners
//         document.addEventListener('mousemove', handleGestureMove, true);
//         document.addEventListener('mouseup', handleGestureEnd, true);
//     }

//     initialTouchPos = getVector(evt);
// }

// function handleGestureEnd(evt) {
//     evt.preventDefault();
//     console.log('handleGestureEnd');
//     resizing = false;

//     if (evt.touches && evt.touches.length > 0) {
//         return;
//     }

//     // Remove Event Listeners
//     if (window['PointerEvent']) {
//         evt.target.releasePointerCapture(evt.pointerId);
//     } else {
//         document.removeEventListener('mousemove', handleGestureMove, true);
//         document.removeEventListener('mouseup', handleGestureEnd, true);
//     }

//     const vector = getVector(evt);
//     if (isExceededMaxWidth(vector.offset)) {
//         maxWidthExceeded.emit();
//     }
//     if (isExceededMinWidth(vector.offset)) {
//         minWidthExceeded.emit();
//     }

//     element.style.setProperty('--width', `${vector.offset}px`);

//     initialTouchPos = null;
// }

// function handleGestureMove(evt) {
//     evt.preventDefault();

//     if (AppUtils.isNullorUndefined(initialTouchPos)) {
//         return;
//     }
//     const vector = getVector(evt);
//     if (
//         isExceededMaxWidth(vector.offset)
//         ||
//         isExceededMinWidth(vector.offset)
//     ) {
//         return;
//     }

//     setResizerPosition(vector);

// }

// function setResizerPosition(vector) {
//     resizer.style.setProperty(vector.direction, `${vector.offset - resizer.clientWidth}px`);
// }

// function getVector(evt) {
//     const point = { x: evt.x, y: evt.y };
//     let element = this.element;
//     let maxOffsetLeft = 0;
//     let maxOffsetTop = 0;
//     while (element.offsetParent) {
//         maxOffsetLeft += element.offsetLeft;
//         maxOffsetTop += element.offsetTop;
//         element = element.offsetParent as HTMLElement;
//     }

//     point.x -= maxOffsetLeft;
//     point.y -= maxOffsetTop;
//     point.x = right ? element.offsetWidth - point.x : point.x;

//     const maxWidth = this.getDrawerOffset('maxWidth') || element.offsetWidth;
//     const minWidth = this.getDrawerOffset('minWidth') || 0;

//     if (point.x >= maxWidth) {
//         point.x = maxWidth;
//     }
//     if (point.x < minWidth) {
//         point.x = minWidth;
//     }
//     return {
//         direction: direction,
//         offset: point.x
//     };
// }

// function pxToPercentege(pixels) {
//     const screenWidth = window.screen.width;
//     return pixels / screenWidth * 100;
// }

// function percentegeToPx(percentge) {
//     return percentge * element.clientWidth / 100;
// }

// function isExceededMaxWidth(pixels) {
//     const maxWidth = getDrawerOffset('maxWidth') || false;
//     return maxWidth && pixels >= maxWidth;
// }

// function isExceededMinWidth(pixels) {
//     return pixels < getDrawerOffset('minWidth');
// }

// function getDrawerOffset(property) {
//     return formatWidthValue(cssValue(drawer, property));
// }

// function formatWidthValue(width) {
//     let value = width;
//     if (width.includes('%')) {
//         value = percentegeToPx(+width.replace('%', ''));
//     } else if (width.includes('px')) {
//         value = +width.replace('px', '');
//     }
//     if (isNaN(value)) {
//         return null;
//     }
//     return value;
// }

// function cssValue(element, property) {
//     return window.getComputedStyle(element).getPropertyValue(property);
// }