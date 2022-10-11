import { M as Model, f as Collection } from './Data-95444d16.js';
import 'pinia';
import '@/composables';
import '@pinia-orm/normalizr';

declare type sorting<T> = ((record: T) => any) | string | [string, 'asc' | 'desc'][];

interface UseCollect<M extends Model = Model> {
    sum: (field: string) => number;
    min: (field: string) => number;
    max: (field: string) => number;
    pluck: (field: string) => any[];
    groupBy: (fields: string[] | string) => Record<string, Collection<M>>;
    sortBy: (sort: sorting<M>) => M[];
    keys: () => string[];
}
/**
 * Return all possible helper functions for the collection
 */
declare function useCollect<M extends Model = Model>(models: Collection<M>): UseCollect<M>;

/**
 * Get the sum value of the specified filed.
 */
declare function useSum(models: Collection, field: string): number;

/**
 * The useGroupBy method groups the collection's items by a given key.
 */
declare function useGroupBy<T>(models: T[], fields: string[] | string): Record<string, T[]>;

/**
 * The keys method returns all of the collection's primary keys
 */
declare function useKeys(models: Collection): string[];

/**
 * Get the min value of the specified filed.
 */
declare function useMin(models: Collection, field: string): number;

/**
 * Get the max value of the specified filed.
 */
declare function useMax(models: Collection, field: string): number;

/**
 * The pluck method retrieves all of the values for a given key.
 */
declare function usePluck(models: Collection, field: string): any[];

export { UseCollect, useCollect, useGroupBy, useKeys, useMax, useMin, usePluck, useSum };
