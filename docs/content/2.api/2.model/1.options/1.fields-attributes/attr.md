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
  
  @Attr(null) declare id: number | null
  @Attr('') declare name: string
  @Attr(() => 'street') declare address: string
}
````

## Typescript Declarations

````ts
function attr(value: any | (() => any)): Attr
````
