---
title: 'new()'
description: 'Create and persist model with default values.'
---

# `new()`

::alert{type='info'}
This method will fire the `creating` and `saving` hooks. 
Also the `created` and `saved` hooks if it is persisted. If you want to create a new model
without firing the hooks use `make()`
::

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Make a model with default values which will be persisted
userRepo.new()

// Make a model with default values which will not be persisted
userRepo.new(false)

````

## Typescript Declarations

````ts
function new(persist = true): Model | null
````
