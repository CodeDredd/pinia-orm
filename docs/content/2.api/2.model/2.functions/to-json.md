---
title: '$toJson()'
description: 'Serialize this model, or the given model, as POJO.'
---

# `$toJson()`

## Usage

````ts
class User extends Model {
  static entity = 'users'

  @Attr('') id!: number
  @Str('') name!: string
  @HasMany(() => Post, 'userId') posts!: Post[]
}

const user = new User({ id: 1, name: 'John Doe', posts: [{ id: 1, title: 'Merry Christmas' }] })

user.$toJson()
// {
//    id: 1,
//    name: 'John Doe',
//    posts: [{ id: 1, title: 'Merry Christmas' }],
// }
````

## Typescript Declarations
````ts
function $toJson(model?: Model, options: ModelOptions = {}): Element
````
