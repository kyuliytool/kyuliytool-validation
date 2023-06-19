export function isTypeOfString(value: any): value is string {
    return typeof value === 'string';
}

export function isNull(value: any): value is null {
    return value === null;
}

export function isUndefined(value: any): value is undefined {
    return value === undefined;
}

export function isNil(value: any): value is null | undefined {
    return isUndefined(value) || isNull(value);
}

export function isTypeOfObject(value: any): value is object {
    return typeof value === 'object';
}

export function isTypeOfNumber(value: any): value is number {
    return typeof value === 'number'
}

export function isTypeOfBigInt(value: any): value is bigint {
    return typeof value === 'bigint';
}

export function isTypeOfBoolean(value: any): value is boolean {
    return typeof value === 'boolean';
}

export function isTypeOfSymbol(value: any): value is symbol {
    return typeof value === 'symbol';
}

export function isTypeOfUndefined(value: any): value is undefined {
    return typeof value === 'undefined'
}

export function isTypeOfFunction(value: any): value is Function {
    return typeof value === 'function';
}

export function isArray<T = any>(value: any): value is Array<T> {
    return Array.isArray(value);
}

export function isEmpty(value: any): boolean {
    if (isNil(value)) return true;

    if (isTypeOfString(value)) {
        return value.trim().length === 0;
    }

    if (isTypeOfObject(value)) {
        if (Array.isArray(value)) { return value.length === 0; }
        return Object.keys(value).length === 0;
    }

    return false;
}

export function isNotEmpty(value: any): boolean {
    return !isEmpty(value);
}

export function isNumeric(value: any): boolean {
    if (!isTypeOfString(value)) return false;
    return /^[0-9]+$/.test(value);
}

export function Alphabet(value: any): boolean {
    if (!isTypeOfString(value)) return false;
    return /^[A-Za-z]+$/.test(value);
}

export function isAlphaNumeric(value: any): boolean {
    if (!isTypeOfString(value)) return false;
    return /^[A-Za-z0-9]+$/.test(value);
}

export class ValidationItem<T = any> {
    private readonly value: T;

    constructor(value: T) {
        this.value = value;
    }

    public isNaN() {
        return Number.isNaN(Number(this.value)) === true;
    }

    public isNull() {
        return isNull(this.value);
    }

    public isUndefined() {
        return isUndefined(this.value);
    }

    public isNil() {
        return isNil(this.value);
    }

    public isArray() {
        return isArray(this.value);
    }

    public isTypeOfString() {
        return isTypeOfString(this.value);
    }

    public isTypeOfNumber() {
        return isTypeOfNumber(this.value);
    }

    public isTypeOfBigInt() {
        return isTypeOfBigInt(this.value);
    }

    public isTypeOfBoolean() {
        return isTypeOfBoolean(this.value);
    }

    public isTypeOfSymbol() {
        return isTypeOfSymbol(this.value);
    }

    public isTypeOfUndefined() {
        return isTypeOfUndefined(this.value);
    }

    public isTypeOfObject() {
        return isTypeOfObject(this.value);
    }

    public isTypeOfFunction() {
        return isTypeOfFunction(this.value);
    }

    public isEmpty() {
        return isEmpty(this.value);
    }

    public isNotEmpty() {
        return isNotEmpty(this.value);
    }
}

export function validation(value: any) {
    return new ValidationItem(value);
}

interface ValidationFormConstructorArgs {
    [index: string]: any
}

interface Item {
    key: string
    value: any
}

class ValidationForm {

    private items: Array<Item> = [];

    constructor(args?: ValidationFormConstructorArgs) {
        const _self = this;
        if (args != null) {
            Object.entries(args).forEach(function (value) {
                _self.items.push({ key: value[0], value: value[1] });
            });
        }
    }

    public clear(): ValidationForm {
        this.items = [];
        return this;
    }

    public alias(key: string, alias: string): ValidationForm {
        this.items.forEach(function (value) {
            if (value.key === key) {
                value.key = alias;
            }
        });
        return this;
    }

    public append(key: string, value: any): ValidationForm {
        this.items.push({ key, value });
        return this;
    }

    public remove(key: string): ValidationForm {
        this.items = this.items.filter(item => item.key !== key);
        return this;
    }

    public getFirstItem(key: string) {
        return this.items.find(item => item.key === key);
    }

    public setFirstItem(key: string, value: any): ValidationForm {
        let first = this.items.find(item => item.key === key);
        if (first == null) {
            first = { key: key, value: void 0 };
            this.items.push(first);
        }
        first.value = value;
        return this;
    }

    public filter(fn: (value: Item, item: number, array: Array<Item>) => boolean): ValidationForm {
        this.items = this.items.filter(fn);
        return this;
    }

    /** Null Value Default logic */
    public NVL(key: string, defValue: any): ValidationForm {
        this.DFVL('isNil', key, defValue);
        return this;
    }

    /** Empty Value Default logic */
    public EVL(key: string, defValue: any): ValidationForm {
        this.DFVL('isEmpty', key, defValue);
        return this;
    }

    public DFVL(type: keyof ValidationItem, key: string, defValue: any): ValidationForm {
        this.items.forEach(function (value) {
            if (value.key === key && validation(value.value)[type]()) {
                value.value = defValue;
            }
        });
        return this;
    }

    public validation(key: string, type: keyof ValidationItem) {
        return this.items.filter(item => item.key === key).every(item => validation(item)[type]());
    }

    public equalsKey(key1: string, key2: string) {
        return this.getFirstItem(key1) === this.getFirstItem(key2);
    }

    public toMap(): ValidationFormConstructorArgs {
        let result: ValidationFormConstructorArgs = {};

        this.items.forEach(function (item) {
            result[item.key] == item.value;
        });

        return result;
    }

    public toFormData(): FormData | null {
        if ((window || global) && (window || global).FormData) {
            let formData = new (window || global).FormData();
            this.items.forEach(function (item) {
                formData.append(item.key, item.value);
            });
            return formData;
        }
        return null;
    }
}

export function validForm(args?: ValidationFormConstructorArgs) {
    return new ValidationForm(args);
}
