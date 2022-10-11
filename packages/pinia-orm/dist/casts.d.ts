import { y as CastAttribute, o as ModelFields } from './Data-95444d16.js';
import 'pinia';
import '@/composables';
import '@pinia-orm/normalizr';

declare class ArrayCast extends CastAttribute {
    /**
     * Create a new String attribute instance.
     */
    constructor(attributes: ModelFields);
    get(value?: any): any;
    /**
     * Make the value for the attribute.
     */
    set(value: any): string | null;
}

declare class StringCast extends CastAttribute {
    /**
     * Create a new String attribute instance.
     */
    constructor(attributes: ModelFields);
    get(value?: any): any;
    /**
     * Make the value for the attribute.
     */
    set(value: any): string | null;
}

declare class BooleanCast extends CastAttribute {
    /**
     * Create a new String attribute instance.
     */
    constructor(attributes: ModelFields);
    get(value?: any): any;
    /**
     * Make the value for the attribute.
     */
    set(value: any): string | null;
}

declare class NumberCast extends CastAttribute {
    /**
     * Create a new String attribute instance.
     */
    constructor(attributes: ModelFields);
    get(value?: any): any;
    /**
     * Make the value for the attribute.
     */
    set(value: any): string | null;
}

export { ArrayCast, BooleanCast, NumberCast, StringCast };
