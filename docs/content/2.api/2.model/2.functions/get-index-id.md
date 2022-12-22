---
title: '$getIndexId()'
description: 'Get the index id of this model or for a given record.'
---

# `$getIndexId()`

## Usage

````ts
class User extends Model {
  static entity = 'users'

  @Attr('') declare id: number
  @Str('') declare name: string
}

const user = new User({ id: 1, name: 'John Doe' })

user.$getIndexId()
// -> '1'
````

## Typescript Declarations
````ts
function $getIndexId(record?: Element): string
````
