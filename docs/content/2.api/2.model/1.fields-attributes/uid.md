---
title: 'uid()'
description: 'Define a unique id type'
---

## Usage

````js[User.js]
import { Model } from 'pinia-orm'

class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.uid()
    }
  }
}
````

## With Decorator

````ts[User.ts]
import { Model, Uid } from 'pinia-orm'

class User extends Model {
  static entity = 'users'
  
  @Uid() id!: string
}
````

## Typescript Declarations

````ts
function uid(): Uid
````
