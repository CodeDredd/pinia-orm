---
title: '$getAttributes()'
description: 'Get the serialized model attributes.'
---

# `$getAttributes()`

## Usage

````ts
class User extends Model {
  static entity = 'users'

  @Attr('') id!: number
  @Str('') name!: string
  @HasMany(() => Post, 'userId') posts!: Post[]
}

const user = new User({ id: 1, name: 'John Doe', posts: [{ id: 1, title: 'Merry Christmas' }] })

user.$getAttributes()
// {
//    id: 1,
//    name: 'John Doe',
// }
````

## Typescript Declarations
````ts
function $getAttributes(): Element
````
