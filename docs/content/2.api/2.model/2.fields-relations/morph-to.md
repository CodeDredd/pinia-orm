---
title: 'morphTo()'
description: 'Makes a "morph to" relation of the property'
---

## Usage

```js
import { Model } from 'pinia-orm'
import User from './Image'
import Post from './Post'

class Image extends Model {
  static entity = 'images'

  static fields () {
    return {
      id: this.number(0),
      url: this.string(''),
      imageableId: this.number(0),
      imageableType: this.string(''),
      imageable: this.morphTo(
        [User, Post],
        'imageableId',
        'imageableType'
      )
    }
  }
}
```

## With Decorator

````ts
import { Model } from 'pinia-orm'
import { Attr, MorphTo, Str } from 'pinia-orm/dist/decorators'
import User from './Image'
import Post from './Post'

class User extends Model {
  static entity = 'users'
  
  @Num(0) declare id: number
  @Str('') declare url: string
  @Num(0) declare imageableId: number
  @Str('') declare imageableType: string
  @MorphTo(() => [User, Post], 'imageableId', 'imageableType') declare imageable: Post[] | User[]
}
````

## Typescript Declarations

````ts
function morphTo(
  related: typeof Model[],
  id: string,
  type: string,
  ownerKey = '',
): MorphTo
````
