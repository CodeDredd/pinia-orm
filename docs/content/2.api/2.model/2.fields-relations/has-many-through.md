---
title: 'hasManyThrough()'
description: 'Makes a "has many through" relation of the property'
---

# `hasMany`

## Usage

```js
import { Model } from 'pinia-orm'
import Comment from './Comment'

class Country extends Model {
  static entity = 'countries'

  static fields () {
    return {
      id: this.attr(null),
      posts: this.hasManyThrough(Post, User, 'country_id', 'user_id')
    }
  }
}

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      country_id: this.attr(null)
    }
  }
}

class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      user_id: this.attr(null)
    }
  }
}
```

## With Decorator

````ts
import { Model } from 'pinia-orm'
import { Attr, HasManyThrough, Str } from 'pinia-orm/dist/decorators'

class Country extends Model {
  static entity = 'countries'

  @Attr() declare id: number
  @HasManyThrough(() => Post, () => User, 'countryId', 'userId')
  declare posts: Post[]
}

class Post extends Model {
  static entity = 'posts'

  @Attr() declare id: number
  @Attr() declare userId: number
  @Str('') declare title: string
}

class User extends Model {
  static entity = 'users'

  @Attr() declare id: number
  @Attr() declare countryId: number
  @Str('') declare name: string
}
````

## Typescript Declarations

````ts
function hasManyThrough(
  related: typeof Model,
  through: typeof Model,
  firstKey: string,
  secondKey: string,
  localKey?: string,
  secondLocalKey?: string,
): HasManyThrough
````
