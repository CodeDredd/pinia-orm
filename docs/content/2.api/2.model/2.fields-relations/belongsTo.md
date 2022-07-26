---
title: 'belongsTo()'
description: 'Define a belongs to relation'
---

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
import { Model, Attr, Str, BelongsTo } from 'pinia-orm'
import User from './User'

class User extends Model {
  static entity = 'users'
  
  @Attr(null) id!: number | null
  @Attr(null) userId!: number | null
  @Str('') number!: string
  @BelongsTo(() => User, 'userId') user!: User
}
````

## Typescript Declarations

````ts
function belongsTo(
  related: typeof Model,
  foreignKey: string,
  ownerKey?: string,
): BelongsTo
````
