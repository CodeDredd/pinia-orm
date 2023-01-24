---
title: 'belongsTo()'
description: 'Makes a "belong to" relation of the property'
---

# `belongsTo`

## Usage

```js
import { Model } from 'pinia-orm'
import User from './User'

class Phone extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      userId: this.attr(null),
      number: this.string(''),
      user: this.belongsTo(User, 'userId')
    }
  }
}
```

## With Decorator

````ts
import { Model } from 'pinia-orm'
import { Attr, BelongsTo, Str } from 'pinia-orm/dist/decorators'
import User from './User'

class User extends Model {
  static entity = 'users'
  
  @Attr(null) declare id: number | null
  @Attr(null) declare userId: number | null
  @Str('') declare number: string
  @BelongsTo(() => User, 'userId') declare user: User
}
````

## Typescript Declarations

````ts
function belongsTo(
  related: typeof Model,
  foreignKey: string | string[],
  ownerKey?: string | string[],
): BelongsTo
````
