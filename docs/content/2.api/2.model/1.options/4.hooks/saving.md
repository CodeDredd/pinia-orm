---
title: 'saving()'
description: 'This hook is triggered when a record is updating or creating'
---

# `saving`

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

  static saving (model, record) {
      // change values before saving
    model.published = true
    if (model.userId === 2) {
        // prevent model with userId 2 being saved in the store
        return false
    }
    // check original data
    console.log(record)
  }
}
````

## Typescript Declarations
````ts
export interface BeforeHook<M extends Model = Model> {
  (model: M, record?: Element): void | boolean
}

const saving: BeforeHook = () => {}
````
