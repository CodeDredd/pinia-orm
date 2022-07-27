---
title: 'saved()'
description: 'This hook is triggered when a record is already created or updated'
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

  static saved (model) {
      // check value saved
    console.log(model.published)
  }
}
````

## Typescript Declarations
````ts
export interface AfterHook<M extends Model = Model> {
  (model: M): void
}

const saved: AfterHook = () => {}
````
