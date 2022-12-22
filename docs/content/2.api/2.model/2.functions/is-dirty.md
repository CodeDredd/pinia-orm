---
title: '$isDirty()'
description: 'Checks if attributes were changed'
---

# `$isDirty()`

## Usage

````ts
class User extends Model {
  static entity = 'users'

  @Attr('') declare id: number
  @Str('') declare name: string
}

const user = new User({ id: 1, name: 'John Doe' })

// Returns false
user.$isDirty()

user.name = 'Jane Doe'

// Returns true
user.$isDirty()

// Returns true
user.$isDirty('name')

// Returns false
user.$isDirty('id')

// Throws an error because you are checking a not existing attribute of `User`
user.$isDirty('lastName')
````

## Typescript Declarations
````ts
function $isDirty($attribute?: keyof ModelFields): Boolean
````
