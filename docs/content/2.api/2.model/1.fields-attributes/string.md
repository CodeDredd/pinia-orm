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
import { Model, Num, Str } from 'pinia-orm'

class User extends Model {
  static entity = 'users'
  
  @Num(0) id!: number
  @Str('') name!: string
}
````

## Typescript Declarations

````ts
function string(value: string | null): String
````
