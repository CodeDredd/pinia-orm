---
title: 'deleted()'
description: 'This hook is triggered when a record is already deleted'
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

  static deleted (model) {
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

const deleted: AfterHook = () => {}
````
