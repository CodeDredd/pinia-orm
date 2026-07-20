---
title: 'hasManyThrough()'
description: 'Makes a "has many through" relation of the property'
---

# `hasManyThrough`

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
import { Attr, HasManyThrough, Str } from 'pinia-orm/decorators'

class Country extends Model {
  static entity = 'countries'

  @Attr() id!: number
  @HasManyThrough(() => Post, () => User, 'countryId', 'userId')
  posts!: Post[]
}

class Post extends Model {
  static entity = 'posts'

  @Attr() id!: number
  @Attr() userId!: number
  @Str('') title!: string
}

class User extends Model {
  static entity = 'users'

  @Attr() id!: number
  @Attr() countryId!: number
  @Str('') name!: string
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
