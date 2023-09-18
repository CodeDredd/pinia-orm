---
title: 'string()'
description: 'Define a string type'
---

# `string`

## Usage

````js[User.js]
import { Model } from 'pinia-orm'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.number(0),
      name: this.string('')
      address: this.string(() => 'street')
    }
  }
}
````

## With Decorator

````ts[User.ts]
import { Model } from 'pinia-orm'
import { Num, Str } from 'pinia-orm/decorators'

class User extends Model {
  static entity = 'users'
  
  @Num(0) declare id: number
  @Str('') declare name: string
  @Str(() => 'street') declare address: string
}
````

## Typescript Declarations

````ts
function string(value: string | null | (() => string | null)): String
````
