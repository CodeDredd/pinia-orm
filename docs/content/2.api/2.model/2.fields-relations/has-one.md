---
title: 'hasOne()'
description: 'Makes a "has one" relation of the property'
---

## Usage

```js
import { Model } from 'pinia-orm'
import Phone from './Phone'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.string(''),
      phone: this.hasOne(Phone, 'userId')
    }
  }
}
```

## With Decorator

````ts
import { Model, Attr, Str, HasOne } from 'pinia-orm'
import Phone from './Phone'

class User extends Model {
  static entity = 'users'
  
  @Attr(null) id!: number | null
  @Str('') name!: string
  @HasOne(() => Phone, 'userId') phone!: Phone
}
````

## Typescript Declarations

````ts
function hasOne(
  related: typeof Model,
  foreignKey: string,
  localKey?: string,
): HasOne
````
