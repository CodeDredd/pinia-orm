---
title: 'morphOne()'
description: 'Makes a "morph one" relation of the property'
---

# `morphOne`

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
      image: this.morphOne(Image, 'imageableId', 'imageableType')
    }
  }
}
```

## With Decorator

````ts
import { Model } from 'pinia-orm'
import { Attr, MorphOne, Str } from 'pinia-orm/decorators'
import Image from './Image'

class User extends Model {
  static entity = 'users'
  
  @Attr(null) declare id: number | null
  @Str('') declare name: string
  @MorphOne(() => Image, 'imageableId', 'imageableType') declare image: Image
}
````

## Typescript Declarations

````ts
function morphOne(
  related: typeof Model,
  id: string,
  type: string,
  localKey?: string,
): MorphOne
````
