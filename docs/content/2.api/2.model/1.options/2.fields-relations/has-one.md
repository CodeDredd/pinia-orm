---
title: 'hasOne()'
description: 'Makes a "has one" relation of the property'
---

# `hasOne`

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
import { Model } from 'pinia-orm'
import { Attr, HasOne, Str } from 'pinia-orm/dist/decorators'
import Phone from './Phone'

class User extends Model {
  static entity = 'users'
  
  @Attr(null) declare id: number | null
  @Str('') declare name: string
  @HasOne(() => Phone, 'userId') declare phone: Phone
}
````

## Typescript Declarations

````ts
function hasOne(
  related: typeof Model,
  foreignKey: string | string[],
  localKey?: string | string[],
): HasOne
````
