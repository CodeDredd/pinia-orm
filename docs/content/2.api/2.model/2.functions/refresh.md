---
title: '$refresh()'
description: 'Return the model instance with its original state'
---

# `$refresh()`

## Usage

````ts
class User extends Model {
  static entity = 'users'

  @Attr('') declare id: number
  @Str('') declare name: string
}

const user = new User({ id: 1, name: 'John Doe' })

user.name = 'Vue JS Amsterdam'

console.log(user.name)
// 'Vue JS Amsterdam'

user.$refresh()

console.log(user.name)
// 'John Doe'

````

## Typescript Declarations
````ts
function $refresh(): Model
````
