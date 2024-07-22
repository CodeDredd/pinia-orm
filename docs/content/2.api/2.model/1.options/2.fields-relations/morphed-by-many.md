---
title: 'morphedByMany()'
description: 'Makes a "morphed by many" relation of the property. Its the inverse of `morphToMany`'
---

# `morphedByMany`

## Usage

```js
import { Model } from 'pinia-orm'
import User from './models/user'
import Video from './models/video'
import Taggable from './models/taggable'

class Tag extends Model {
  static entity = 'tags'

  static fields () {
    return {
      id: this.attr(0),
      users: this.morphedByMany(User, Taggable, 'tag_id', 'taggable_id', 'taggable_type'),
      videos: this.morphedByMany(Video, Taggable, 'tag_id', 'taggable_id', 'taggable_type'),
    }
  }
}
```

## With Decorator

````ts
import { Model } from 'pinia-orm'
import { Attr, MorphedByMany, Str } from 'pinia-orm/decorators'
import User from './models/user'
import Video from './models/video'
import Taggable from './models/taggable'

class Tag extends Model {
  static entity = 'tags'

  @Attr() declare id: number
  @MorphedByMany(() => User, () => Taggable, 'tag_id', 'taggable_id', 'taggable_type')
  declare users: User[]
  @MorphedByMany(() => Video, () => Taggable, 'tag_id', 'taggable_id', 'taggable_type')
  declare videos: Video[]
  declare pivot: Taggable
}
````

## Typescript Declarations

````ts
function morphedByMany(
  related: typeof Model,
  pivot: (() => typeof Model) | {
    as: string
    model: () => typeof Model
  },
  relatedId: string,
  id: string,
  type: string,
  parentKey?: string,
  relatedKey?: string,
): MorphedByMany
````
