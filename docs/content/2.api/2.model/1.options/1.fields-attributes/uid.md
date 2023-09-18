---
title: 'uid()'
description: 'Define a unique id type'
---

# `uid`

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
import { Model } from 'pinia-orm'
import { Uid } from 'pinia-orm/decorators'

class User extends Model {
  static entity = 'users'
  
  @Uid() declare id: string
}
````

## Typescript Declarations

````ts
function uid(): Uid
````
