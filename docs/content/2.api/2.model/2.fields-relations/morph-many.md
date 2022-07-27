---
title: 'morphMany()'
description: 'Makes a "morph many" relation of the property'
---

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
import { Model, Attr, Str, MorphMany } from 'pinia-orm'
import Image from './Image'

class User extends Model {
  static entity = 'users'
  
  @Attr(null) id!: number | null
  @Str('') name!: string
  @MorphMany(() => Image, 'imageableId', 'imageableType') images!: Image[]
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
