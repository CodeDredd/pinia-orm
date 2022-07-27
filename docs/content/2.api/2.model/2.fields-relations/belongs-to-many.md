---
title: 'belongsToMany()'
description: 'Makes a "belongs to many" relation of the property'
---

## Usage

```js
import { Model } from 'pinia-orm'
import Role from './Role'
import RoleUser from './RoleUser'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      roles: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id')
    }
  }
}
```

## With Decorator

````ts
import { Model, Attr, Str, BelongsToMany } from 'pinia-orm'
import Role from './Role'
import RoleUser from './RoleUser'

class User extends Model {
  static entity = 'users'
  
  @Attr(null) id!: number | null
  @BelongsToMany(() => Role, () => RoleUser, 'user_id', 'role_id') roles!: Role[]
}
````

## Typescript Declarations

````ts
function belongsToMany(
  related: typeof Model,
  pivot: typeof Model,
  foreignPivotKey: string,
  relatedPivotKey: string,
  parentKey?: string,
  relatedKey?: string,
): BelongsToMany
````
