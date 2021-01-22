interface String {
    isEmpty: boolean;
    isNotEmpty: boolean;
}


Object.defineProperty(String.prototype, 'isEmpty', {
    configurable: false,
    enumerable: true,
    get() {
        return this.length === 0;
    }
});

Object.defineProperty(String.prototype, 'isNotEmpty', {
    configurable: false,
    enumerable: true,
    get() {
        return this.length > 0;
    }
});
