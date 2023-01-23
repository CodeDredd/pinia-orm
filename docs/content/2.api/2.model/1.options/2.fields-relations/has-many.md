---
title: 'hasMany()'
description: 'Makes a "has many" relation of the property'
---

# `hasMany`

## Usage

```js
import { Model } from 'pinia-orm'
import Comment from './Comment'

class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      title: this.string(''),
      comments: this.hasMany(Comment, 'postId')
    }
  }
}
```

## With Decorator

````ts
import { Model } from 'pinia-orm'
import { Attr, HasMany, Str } from 'pinia-orm/dist/decorators'
import Comment from './Comment'

class Post extends Model {
  static entity = 'posts'
  
  @Attr(null) declare id: number | null
  @Str('') declare title: string
  @HasMany(() => Comment, 'postId') declare comments: Comment[]
}
````

## Typescript Declarations

````ts
function hasMany(
  related: typeof Model,
  foreignKey: string | string[],
  localKey?: string | string[],
): HasMany 
````
