---
title: '$hasCompositeKey()'
description: 'Check whether the model has composite key.'
---

# `$hasCompositeKey()`

## Usage

````ts
class User extends Model {
  static entity = 'users'

  @Attr('') id!: number
  @Str('') name!: string
}

const user = new User({ id: 1, name: 'John Doe' })

user.$hasCompositeKey()
// -> false
````

## Typescript Declarations
````ts
function $hasCompositeKey(): boolean
````
