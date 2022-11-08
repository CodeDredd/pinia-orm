---
title: 'boolean()'
description: 'Define a boolean type'
---

## Usage

````js[User.js]
import { Model } from 'pinia-orm'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.number(0),
      published: this.boolean(false),
      released: this.boolean(() => false),
    }
  }
}
````

## With Decorator

````ts[User.ts]
import { Model } from 'pinia-orm'
import { Bool, Num } from 'pinia-orm/dist/decorators'

class User extends Model {
  static entity = 'users'
  
  @Num(0) declare id: number
  @Bool(false) declare published: boolean
  @Bool(() => false) declare released: boolean
}
````

## Typescript Declarations

````ts
function boolean(value: boolean | null | (() => boolean | null)): Bool
````
