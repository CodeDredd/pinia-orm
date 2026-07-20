---
title: '$getLocalKey()'
description: 'Get the local key name for the model.'
---

# `$getLocalKey()`

## Usage

````ts
class User extends Model {
  static entity = 'users'

  @Attr('') id!: number
  @Str('') name!: string
}

const user = new User({ id: 1, name: 'John Doe' })

user.$getLocalKey()
// -> 'id'
````

## Typescript Declarations
````ts
function $getLocalKey(): string
````
