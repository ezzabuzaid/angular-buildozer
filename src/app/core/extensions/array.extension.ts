
interface Array<T> {
    isEmpty: boolean;
    isNotEmpty: boolean;
    last: T;
    first: T;
    deepFlat(): T[];
}

Object.defineProperty(Array.prototype, 'deepFlat', {
    configurable: false,
    enumerable: true,
    value() {
        function flattenArray(data: any[]) {
            return data.reduce((a, b) => {
                if (Array.isArray(b)) {
                    return a.concat(flattenArray(b));
                }
                return a.concat(b);
            }, []);
        }
        return flattenArray(this);
    },
    writable: false
});

Object.defineProperty(Array.prototype, 'isEmpty', {
    configurable: false,
    enumerable: true,
    get() {
        return this.length === 0;
    },
    set(value) { }
});
Object.defineProperty(Array.prototype, 'isNotEmpty', {
    configurable: false,
    enumerable: true,
    get() {
        return this.length > 1;
    },
    set(value) { }
});
Object.defineProperty(Array.prototype, 'first', {
    configurable: false,
    enumerable: true,
    get() {
        return this[0];
    },
    set(value) { }
});
Object.defineProperty(Array.prototype, 'last', {
    configurable: false,
    enumerable: true,
    get() {
        return this[this.length - 1];
    },
    set(value) { }
});
