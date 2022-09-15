---
title: 'withMeta()'
description: 'Makes `_meta` unhidden, so you can access it'
---

::info{type='info'}
`_meta` is only filled if you have defined in your model `static config = { model: { withMeta = true } }` or
globally set by configuration
::

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// gives you access to the default hidden prop '_meta'
userRepo.withMeta().first()

````

## Typescript Declarations

````ts
function withMeta(): Query
````
