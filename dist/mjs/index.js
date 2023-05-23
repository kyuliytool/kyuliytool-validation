export function isTypeOfString(value) {
    return typeof value === 'string';
}
export function isNull(value) {
    return value === null;
}
export function isUndefined(value) {
    return value === undefined;
}
export function isNil(value) {
    return isUndefined(value) || isNull(value);
}
export function isTypeOfObject(value) {
    return typeof value === 'object';
}
export function isTypeOfNumber(value) {
    return typeof value === 'number';
}
export function isTypeOfBigInt(value) {
    return typeof value === 'bigint';
}
export function isTypeOfBoolean(value) {
    return typeof value === 'boolean';
}
export function isTypeOfSymbol(value) {
    return typeof value === 'symbol';
}
export function isTypeOfUndefined(value) {
    return typeof value === 'undefined';
}
export function isTypeOfFunction(value) {
    return typeof value === 'function';
}
export function isArray(value) {
    return Array.isArray(value);
}
export function isEmpty(value) {
    if (isNil(value))
        return true;
    if (isTypeOfString(value)) {
        return value.trim().length === 0;
    }
    if (isTypeOfObject(value)) {
        if (Array.isArray(value)) {
            return value.length === 0;
        }
        return Object.keys(value).length === 0;
    }
    return false;
}
export function isNotEmpty(value) {
    return !isEmpty(value);
}
export function isNumeric(value) {
    if (!isTypeOfString(value))
        return false;
    return /^[0-9]+$/.test(value);
}
export function Alphabet(value) {
    if (!isTypeOfString(value))
        return false;
    return /^[A-Za-z]+$/.test(value);
}
export function isAlphaNumeric(value) {
    if (!isTypeOfString(value))
        return false;
    return /^[A-Za-z0-9]+$/.test(value);
}
export class ValidationItem {
    value;
    constructor(value) {
        this.value = value;
    }
    isNaN() {
        return Number.isNaN(Number(this.value)) === true;
    }
    isNull() {
        return isNull(this.value);
    }
    isUndefined() {
        return isUndefined(this.value);
    }
    isNil() {
        return isNil(this.value);
    }
    isArray() {
        return isArray(this.value);
    }
    isTypeOfString() {
        return isTypeOfString(this.value);
    }
    isTypeOfNumber() {
        return isTypeOfNumber(this.value);
    }
    isTypeOfBigInt() {
        return isTypeOfBigInt(this.value);
    }
    isTypeOfBoolean() {
        return isTypeOfBoolean(this.value);
    }
    isTypeOfSymbol() {
        return isTypeOfSymbol(this.value);
    }
    isTypeOfUndefined() {
        return isTypeOfUndefined(this.value);
    }
    isTypeOfObject() {
        return isTypeOfObject(this.value);
    }
    isTypeOfFunction() {
        return isTypeOfFunction(this.value);
    }
    isEmpty() {
        return isEmpty(this.value);
    }
    isNotEmpty() {
        return isNotEmpty(this.value);
    }
}
export function validation(value) {
    return new ValidationItem(value);
}
class ValidationForm {
    items = [];
    constructor(args) {
        const _self = this;
        if (args != null) {
            Object.entries(args).forEach(function (value) {
                _self.items.push({ key: value[0], value: value[1] });
            });
        }
    }
    clear() {
        this.items = [];
        return this;
    }
    alias(key, alias) {
        this.items.forEach(function (value) {
            if (value.key === key) {
                value.key = alias;
            }
        });
        return this;
    }
    append(key, value) {
        this.items.push({ key, value });
        return this;
    }
    remove(key) {
        this.items = this.items.filter(item => item.key !== key);
        return this;
    }
    getFirstItem(key) {
        return this.items.find(item => item.key === key);
    }
    setFirstItem(key, value) {
        let first = this.items.find(item => item.key === key);
        if (first == null) {
            first = { key: key, value: void 0 };
            this.items.push(first);
        }
        first.value = value;
        return this;
    }
    filter(fn) {
        this.items = this.items.filter(fn);
        return this;
    }
    NVL(key, defValue) {
        this.DFVL('isNil', key, defValue);
        return this;
    }
    EVL(key, defValue) {
        this.DFVL('isEmpty', key, defValue);
        return this;
    }
    DFVL(type, key, defValue) {
        this.items.forEach(function (value) {
            if (value.key === key && validation(value.value)[type]()) {
                value.value = defValue;
            }
        });
        return this;
    }
    validation(key, type) {
        return this.items.filter(item => item.key === key).every(item => validation(item)[type]());
    }
    equalsKey(key1, key2) {
        return this.getFirstItem(key1) === this.getFirstItem(key2);
    }
    toMap() {
        let result = {};
        this.items.forEach(function (item) {
            result[item.key] == item.value;
        });
        return result;
    }
    toFormData() {
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
export function validForm(args) {
    return new ValidationForm(args);
}
