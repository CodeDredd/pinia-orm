---
title: 'attr()'
description: 'Define a generic type'
---

## Usage

````js[User.js]
import { Model } from 'pinia-orm'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('John Doe')
    }
  }
}
````

## With Decorator

````ts[User.ts]
import { Model, Attr } from 'pinia-orm'

class User extends Model {
  static entity = 'users'
  
  @Attr(null) id!: number | null
  @Attr('') name!: string
}
````

## Typescript Declarations

````ts
function attr(value: any): Attr
````
