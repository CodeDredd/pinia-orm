---
title: 'morphMany()'
description: 'Makes a "morph many" relation of the property'
---

# `morphMany`

## Usage

```js
import { Model } from 'pinia-orm'
import Image from './Image'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.number(0),
      name: this.string(''),
      images: this.morphMany(Image, 'imageableId', 'imageableType')
    }
  }
}
```

## With Decorator

````ts
import { Model } from 'pinia-orm'
import { Attr, MorphMany, Str } from 'pinia-orm/dist/decorators'
import Image from './Image'

class User extends Model {
  static entity = 'users'
  
  @Attr(null) declare id: number | null
  @Str('') declare name: string
  @MorphMany(() => Image, 'imageableId', 'imageableType') declare images: Image[]
}
````

## Typescript Declarations

````ts
function morphMany(
  related: typeof Model,
  id: string,
  type: string,
  localKey?: string,
): MorphMany
````
