import { MonoTypeOperatorFunction, Observable, Observer, of, Subject, throwError } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { StringUtils } from './string.utils';

// FIXME: Rename it to app.utils
export class AppUtils {

    /**
     * check if the givin value is object literal
     *
     * @param value the predecited value
     */
    static isObject(value: any): boolean {
        return new Object(value) === value;
    }


    /**
     * Check if the value has at least one item
     * 
     * supported values are string, array, pojo {}
     * @returns {boolean} indicate that the {value} is empty
     */
    public static notEmpty(object: any): boolean {
        if (Array.isArray(object)) {
            return AppUtils.isTruthy(object.length);
        }

        if (object instanceof Date) {
            return true;
        }

        if (typeof object === 'boolean') {
            return true;
        }

        if (AppUtils.isObject(object)) {
            return AppUtils.isTruthy(Object.keys(object).length);
        }

        return AppUtils.not(StringUtils.isEmptyString(object));
    }

    /**
     * Check if the givin value is empty
     *
     * supported values are string, array, pojo {}
     * @param object any series value
     */
    static isEmpty(value: any): boolean {
        return AppUtils.isFalsy(AppUtils.notEmpty(value));
    }

    /**
     * generate a random alphapetic string
     * @param length the maximum length of the string
     */
    static generateAlphabeticString(length = 5): string {
        let randomString = '';
        let randomAscii: number;
        const asciiLow = 65;
        const asciiHigh = 90;
        for (let i = 0; i < length; i++) {
            randomAscii = Math.floor((Math.random() * (asciiHigh - asciiLow)) + asciiLow);
            randomString += String.fromCharCode(randomAscii);
        }
        return randomString;
    }

    static generate<T>(length: number, callback: (index: number) => T) {
        const foo = [];
        for (let i = 0; i <= length; i++) {
            foo.push(callback(i));
        }
        return foo;
    }

    static generateRandomString(length: number) {
        let string = '';
        const randomchar = () => {
            const number = Math.floor(Math.random() * 62);
            if (number < 10) {
                return number;
            }
            if (number < 36) {
                return String.fromCharCode(number + 55);
            }
            return String.fromCharCode(number + 61);
        };

        while (string.length < length) {
            string += randomchar();
        }
        return string;
    }

    /**
     * Encode file to base 64 text format
     */
    static readFile(file: File): Observable<string> {
        return new Observable((observer: Observer<string>) => {
            const reader = new FileReader();
            reader.addEventListener('abort', (error) => observer.error(error));
            reader.addEventListener('error', (error) => observer.error(error));
            reader.addEventListener('loadend', () => {
                observer.next(reader.result as any);
                observer.complete();
            });
            reader.readAsDataURL(file);
        });
    }

    /**
     * Complete a Subject
     */
    static unsubscribe<T = any>(subscription: Subject<T>) {
        subscription.next();
        subscription.complete();
    }

    static preventBubblingAndCapturing(event: Event) {
        event.preventDefault();
        event.stopPropagation();
    }

    static debounce(func: () => void, wait: number, immediate = false) {
        let timeout: any;

        return function executedFunction() {
            const later = () => {
                timeout = null;
                if (!immediate) {
                    // @ts-ignore
                    func.apply(this, Array.from(arguments));
                }
            };

            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                // @ts-ignore
                func.apply(this, Array.from(arguments));
            }
        };
    }

    static cloneObject<T>(target: T, source: Partial<T> = {}): T {
        const clone = JSON.parse(JSON.stringify(target));
        return Object.assign(clone, source);
    }

    static mapEnumToValueAnd(enumObject: object): { title: string, value: any }[] {
        return Object.keys(enumObject)
            .filter(item => isNaN(+item))
            .reduce((acc, curr) => {
                acc.push({ title: curr, value: enumObject[curr] });
                return acc;
            }, []);
    }


    /**
     * merge and return unique list from two lists
     * @param key to filter upon
     */
    static mergeListOfObjects<T>(concatTo: Partial<T>[], filterFrom: Partial<T>[], key: keyof T) {
        return concatTo.concat(filterFrom.filter(one => !concatTo.find(two => two[key] === one[key])));
    }

    static flatArray(data: any[]) {
        return data.reduce((a, b) => a.concat(b), []);
    }

    /**
     * convert an object with key:value to query param string
     * null and undefined values will be omited
     */
    static convertObjectToQueryParams(obj: any) {
        return Object.keys(obj)
            .reduce((acc, curr, index, thisArray) => {
                if (AppUtils.isNullorUndefined(obj[curr])) {
                    return acc;
                }
                const lastIndex = thisArray.length - 1 === index;
                return acc += `${ curr }=${ obj[curr] }${ lastIndex ? '' : '&' }`;
            }, '');
    }

    /**
     *
     * @param functions Accept array of function to invoke in inverse order,
     *  so that each function will accept tha value from last invoked function as argument
     */
    static compose<T, Y>(...functions: ((arg: T | Y) => T)[]) {
        return (args: T | Y) => functions.reduceRight((acc, fn) => fn(acc), args);
    }

    /**
     *
     * @param functions Accept array of function to invoke in order,
     * so that each function will accept tha value of last invoked function as argument
     */
    static pipe<T, Y>(...functions: ((arg: T | Y) => T)[]) {
        return (args: T | Y) => functions.reduce((acc, fn) => fn(acc), args);
    }

    /**
     * remove null and undefined properties from an object expect empty string
     * @param withEmptyString to indicate of the empty values should be removed
     */
    static excludeEmptyKeys(object: object, withEmptyString = false) {
        const replaceUndefinedOrNull = (key: string, value: any) => {
            if (withEmptyString) {
                return StringUtils.isEmptyString(value) || this.isNullorUndefined(value)
                    ? undefined
                    : value;
            } else {
                return this.isNullorUndefined(value) ? undefined : value;
            }
        };
        return JSON.parse(JSON.stringify(object, replaceUndefinedOrNull));
    }

    /**
     * get the value of inner object
     * @param key one.two
     * @param obj one:{two:'value'}
     */
    static getDottedProperty(key: string, obj: object) {
        return key.split('.').reduce((acc, curr) => (acc || {})[curr], obj);
    }

    /**
     * Check if the givin value if is falsy type
     *
     * the same as using !value
     */
    static isFalsy(value: any) {
        return !!!value;
    }

    /**
     * Check if the givin value if is falsy type
     *
     * the same as using !value
     */
    static not(value: any) {
        return !!!value;
    }

    static isTruthy(value: any) {
        return !!value;
    }

    static isNullorUndefined(value: any) {
        return value === null || value === undefined;
    }

    static equals<T>(...values: T[]) {
        return values.every((value, i, arr) => JSON.stringify(value) === JSON.stringify(arr[0]));
    }

    static notEquals<T>(...values: T[]) {
        return !this.equals(...values);
    }

    public static notNullOrUndefined(value: any) {
        return AppUtils.isFalsy(AppUtils.isNullorUndefined(value));
    }

    public static inverse(value: boolean) {
        return !value;
    }


}

export function tryOrThrow<T>(cb: (...args: any) => T) {
    try {
        const test = (cb as any)();
        return of(test as ReturnType<typeof cb>);
    } catch (error) {
        return throwError(error);
    }
}

export function tryOrComplete<T>(
    condition: () => boolean,
    observable: () => Observable<T>,
    defaultValue: T = null
) {
    if (condition()) {
        return observable();
    }
    return of(defaultValue);
}

export type PickAttr<T, P extends keyof T> = T[P];
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export interface KeyPairs<T> {
    [key: string]: T;
}

export function typeaheadOperator<T>(): MonoTypeOperatorFunction<T> {
    return (source) => {
        return source.pipe(
            filter(AppUtils.notNullOrUndefined),
            debounceTime(400),
            distinctUntilChanged<T>()
        );
    };
}

