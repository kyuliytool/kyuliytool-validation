"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validForm = exports.validation = exports.ValidationItem = exports.isAlphaNumeric = exports.Alphabet = exports.isNumeric = exports.isNotEmpty = exports.isEmpty = exports.isArray = exports.isTypeOfFunction = exports.isTypeOfUndefined = exports.isTypeOfSymbol = exports.isTypeOfBoolean = exports.isTypeOfBigInt = exports.isTypeOfNumber = exports.isTypeOfObject = exports.isNil = exports.isUndefined = exports.isNull = exports.isTypeOfString = void 0;
function isTypeOfString(value) {
    return typeof value === 'string';
}
exports.isTypeOfString = isTypeOfString;
function isNull(value) {
    return value === null;
}
exports.isNull = isNull;
function isUndefined(value) {
    return value === undefined;
}
exports.isUndefined = isUndefined;
function isNil(value) {
    return isUndefined(value) || isNull(value);
}
exports.isNil = isNil;
function isTypeOfObject(value) {
    return typeof value === 'object';
}
exports.isTypeOfObject = isTypeOfObject;
function isTypeOfNumber(value) {
    return typeof value === 'number';
}
exports.isTypeOfNumber = isTypeOfNumber;
function isTypeOfBigInt(value) {
    return typeof value === 'bigint';
}
exports.isTypeOfBigInt = isTypeOfBigInt;
function isTypeOfBoolean(value) {
    return typeof value === 'boolean';
}
exports.isTypeOfBoolean = isTypeOfBoolean;
function isTypeOfSymbol(value) {
    return typeof value === 'symbol';
}
exports.isTypeOfSymbol = isTypeOfSymbol;
function isTypeOfUndefined(value) {
    return typeof value === 'undefined';
}
exports.isTypeOfUndefined = isTypeOfUndefined;
function isTypeOfFunction(value) {
    return typeof value === 'function';
}
exports.isTypeOfFunction = isTypeOfFunction;
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
function isEmpty(value) {
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
exports.isEmpty = isEmpty;
function isNotEmpty(value) {
    return !isEmpty(value);
}
exports.isNotEmpty = isNotEmpty;
function isNumeric(value) {
    if (!isTypeOfString(value))
        return false;
    return /^[0-9]+$/.test(value);
}
exports.isNumeric = isNumeric;
function Alphabet(value) {
    if (!isTypeOfString(value))
        return false;
    return /^[A-Za-z]+$/.test(value);
}
exports.Alphabet = Alphabet;
function isAlphaNumeric(value) {
    if (!isTypeOfString(value))
        return false;
    return /^[A-Za-z0-9]+$/.test(value);
}
exports.isAlphaNumeric = isAlphaNumeric;
class ValidationItem {
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
exports.ValidationItem = ValidationItem;
function validation(value) {
    return new ValidationItem(value);
}
exports.validation = validation;
class ValidationForm {
    constructor(args) {
        this.items = [];
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
function validForm(args) {
    return new ValidationForm(args);
}
exports.validForm = validForm;
