import { P as PropertyDecorator, T as TypeOptions } from './Contracts-d78057f4.js';
export { P as PropertyDecorator, T as TypeOptions } from './Contracts-d78057f4.js';
import { M as Model, y as CastAttribute, U as Mutator } from './Data-95444d16.js';
import 'pinia';
import '@/composables';
import '@pinia-orm/normalizr';

/**
 * Create an Attr attribute property decorator.
 */
declare function Attr(value?: any): PropertyDecorator;

/**
 * Create a String attribute property decorator.
 */
declare function Str(value: string | null, options?: TypeOptions): PropertyDecorator;

/**
 * Create a Number attribute property decorator.
 */
declare function Num(value: number | null, options?: TypeOptions): PropertyDecorator;

/**
 * Create a Boolean attribute property decorator.
 */
declare function Bool(value: boolean | null, options?: TypeOptions): PropertyDecorator;

/**
 * Create a Uid attribute property decorator.
 */
declare function Uid(): PropertyDecorator;

/**
 * Create a has-one attribute property decorator.
 */
declare function HasOne(related: () => typeof Model, foreignKey: string, localKey?: string): PropertyDecorator;

/**
 * Create a belongs-to attribute property decorator.
 */
declare function BelongsTo(related: () => typeof Model, foreignKey: string, ownerKey?: string): PropertyDecorator;

/**
 * Create a belongs-to-many attribute property decorator.
 */
declare function BelongsToMany(related: () => typeof Model, pivot: () => typeof Model, foreignPivotKey: string, relatedPivotKey: string, parentKey?: string, relatedKey?: string): PropertyDecorator;

/**
 * Create a has-many attribute property decorator.
 */
declare function HasMany(related: () => typeof Model, foreignKey: string, localKey?: string): PropertyDecorator;

/**
 * Create a has-many-by attribute property decorator.
 */
declare function HasManyBy(related: () => typeof Model, foreignKey: string, ownerKey?: string): PropertyDecorator;

/**
 * Create a morph-one attribute property decorator.
 */
declare function MorphOne(related: () => typeof Model, id: string, type: string, localKey?: string): PropertyDecorator;

/**
 * Create a morph-to attribute property decorator.
 */
declare function MorphTo(related: () => typeof Model[], id: string, type: string, ownerKey?: string): PropertyDecorator;

/**
 * Create a morph-many attribute property decorator.
 */
declare function MorphMany(related: () => typeof Model, id: string, type: string, localKey?: string): PropertyDecorator;

/**
 * Create a cast for an attribute property decorator.
 */
declare function Cast(to: (() => typeof CastAttribute)): PropertyDecorator;

/**
 * Create an Mutate attribute property decorator.
 */
declare function Mutate(get?: Mutator<any>, set?: Mutator<any>): PropertyDecorator;

/**
 * Create an Mutate attribute property decorator.
 */
declare function Hidden(): PropertyDecorator;

/**
 * Sets an object property to be innumerable.
 */
declare function NonEnumerable(target: any, propertyKey: string): void;

export { Attr, BelongsTo, BelongsToMany, Bool, Cast, HasMany, HasManyBy, HasOne, Hidden, MorphMany, MorphOne, MorphTo, Mutate, NonEnumerable, Num, Str, Uid };
