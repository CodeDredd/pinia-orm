---
title: 'deleting()'
description: 'This hook is triggered when a record is deleting'
---

## Usage

````js
class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      userId: this.attr(null),
      published: this.attr(false)
    }
  }

  static deleting (model) {
      // change values before saving
    model.published = true
    if (model.userId === 2) {
        // prevent model with userId 2 being saved in the store
        return false
    }
  }
}
````

## Typescript Declarations
````ts
export interface BeforeHook<M extends Model = Model> {
  (model: M): void | boolean
}

const deleting: BeforeHook = () => {}
````
