---
title: 'string()'
description: 'Define a string type'
---

## Usage

````js[User.js]
import { Model } from 'pinia-orm'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.number(0),
      name: this.string('')
    }
  }
}
````

## With Decorator

````ts[User.ts]
import { Model } from 'pinia-orm'
import { Num, Str } from 'pinia-orm/dist/decorators'

class User extends Model {
  static entity = 'users'
  
  @Num(0) declare id: number
  @Str('') declare name: string
}
````

## Typescript Declarations

````ts
function string(value: string | null): String
````
