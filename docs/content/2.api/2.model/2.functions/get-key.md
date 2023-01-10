---
title: '$getKey()'
description: 'Get primary key value for the model. If the model has the composite key, it will return an array of ids.'
---

# `$getKey()`

## Usage

````ts
class User extends Model {
  static entity = 'users'

  @Attr('') declare id: number
  @Str('') declare name: string
}

const user = new User({ id: 1, name: 'John Doe' })

user.$getKey()
// -> 1
````

## Typescript Declarations
````ts
function $getKey(record?: Element): string | number | (string | number)[] | null
````
