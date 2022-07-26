---
title: 'number()'
description: 'Define a number type'
---

## Usage

````js[User.js]
import { Model } from 'pinia-orm'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.number(0)
    }
  }
}
````

## With Decorator

````ts[User.ts]
import { Model, Num } from 'pinia-orm'

class User extends Model {
  static entity = 'users'
  
  @Num(0) id!: number
}
````

## Typescript Declarations

````ts
function number(value: number | null): Number
````
