---
title: 'attr()'
description: 'Define a generic type'
---

# `attr`

## Usage

````js[User.js]
import { Model } from 'pinia-orm'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('John Doe'),
      address: this.attr(() => 'Address'),
    }
  }
}
````

## With Decorator

````ts[User.ts]
import { Model } from 'pinia-orm'
import { Attr } from 'pinia-orm/decorators'

class User extends Model {
  static entity = 'users'
  
  @Attr(null) id!: number | null
  @Attr('') name!: string
  @Attr(() => 'street') address!: string
}
````

## Typescript Declarations

````ts
function attr(value: any | (() => any)): Attr
````
