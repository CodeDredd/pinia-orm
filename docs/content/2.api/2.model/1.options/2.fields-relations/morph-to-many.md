---
title: 'morphToMany()'
description: 'Makes a "morph to many" relation of the property'
---

# `morphToMany`

## Usage

```js
import { Model } from 'pinia-orm'
import Image from './Image'
import Imageable from './Image'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.number(0),
      name: this.string(''),
      images: this.morphToMany(Image, Imageable, 'imageId', 'imageableId', 'imageableType')
    }
  }
}
```

## With Decorator

````ts
import { Model } from 'pinia-orm'
import { Attr, MorphToMany, Str } from 'pinia-orm/decorators'
import Image from './Image'
import Imageable from './Image'

class User extends Model {
  static entity = 'users'
  
  @Attr(null) declare id: number | null
  @Str('') declare name: string
  @MorphToMany(() => Image, () => Imageable, 'imageId', 'imageableId', 'imageableType') declare images: Image[]
}
````

## Typescript Declarations

````ts
function morphToMany(
  related: typeof Model,
  pivot: typeof Model,
  relatedId: string,
  id: string,
  type: string,
  parentKey?: string,
  relatedKey?: string,
): MorphToMany
````
