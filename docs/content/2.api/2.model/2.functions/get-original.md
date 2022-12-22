---
title: '$getOriginal()'
description: 'Get the original values of the model instance'
---

# `$getOriginal()`

## Usage

````ts
class User extends Model {
  static entity = 'users'

  @Attr('') declare id: number
  @Str('') declare name: string
}

const user = new User({ id: 1, name: 'John Doe' })

user.name = 'Vue JS Amsterdam'

user.$getOriginal()
// {
//    id: 1,
//    name: 'John Doe',
// }

console.log(user.name)
// 'Vue JS Amsterdam'
````

## Typescript Declarations
````ts
function $getOriginal(): Element
````
