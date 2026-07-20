---
title: '$getKeyName()'
description: 'Get the primary key field name.'
---

# `$getKeyName()`

## Usage

````ts
class User extends Model {
  static entity = 'users'

  @Attr('') id!: number
  @Str('') name!: string
}

const user = new User({ id: 1, name: 'John Doe' })

user.$getKeyName()
// -> 'id'
````

## Typescript Declarations
````ts
function $getKeyName(): string | string[]
````
