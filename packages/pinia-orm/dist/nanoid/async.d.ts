import { y as CastAttribute, o as ModelFields } from '../Data-95444d16.js';
import { P as PropertyDecorator } from '../Contracts-d78057f4.js';
import 'pinia';
import '@/composables';
import '@pinia-orm/normalizr';

declare class UidCast extends CastAttribute {
    /**
     * Create a new String attribute instance.
     */
    constructor(attributes: ModelFields);
    /**
     * Make the value for the attribute.
     */
    set(value: any): Promise<string | null>;
}

/**
 * Create a cast for an attribute property decorator.
 */
declare function Uid(): PropertyDecorator;

export { Uid, UidCast };
