---
title: 'hasManyBy()'
description: 'Makes a "has many by" relation of the property'
---

## Usage

```js
import { Model } from 'pinia-orm'
import Comment from './Comment'

class Post extends Model {
  static entity = 'posts'

  static fields () {
    return {
      id: this.attr(null),
      postIds: this.attr([]),
      title: this.string(''),
      comments: this.hasManyBy(Comment, 'postId')
    }
  }
}
```

## With Decorator

````ts
import { Model } from 'pinia-orm'
import { Attr, HasManyBy, Str } from 'pinia-orm/dist/decorators'
import Comment from './Comment'

class Post extends Model {
  static entity = 'posts'
  
  @Attr(null) id!: number | null
  @Attr([]) postIds!: number[]
  @Str('') title!: string
  @HasManyBy(() => Comment, 'postIds') comments!: Comment[]
}
````

## Typescript Declarations

````ts
function hasManyBy(
  related: typeof Model,
  foreignKey: string,
  ownerKey?: string,
): HasManyBy
````
