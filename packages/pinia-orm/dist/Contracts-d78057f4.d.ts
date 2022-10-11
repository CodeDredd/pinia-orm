import { M as Model } from './Data-95444d16.js';

declare type PropertyDecorator = (target: Model, propertyKey: string) => void;
interface TypeOptions {
    notNullable?: boolean;
}

export { PropertyDecorator as P, TypeOptions as T };
