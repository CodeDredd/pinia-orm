---
title: 'make()'
description: 'Creates a new model instance'
---

# `make()`

This method will not save the model to the store. It's pretty much the alternative to `new Model()`, but it injects
the store instance to support model instance methods in SSR environment. It also won't fire any hooks.

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Make a model with default values
userRepo.make()

// Make a model with values
userRepo.make({
  id: 1,
  name: 'Jane Doe',
})

// Make many models with values
userRepo.make([
  {
    id: 1,
    name: 'Jane Doe',
  },
  {
    id: 2,
    name: 'John Doe',
  },
])

````

## Typescript Declarations

````ts
function make(records?: Element | Element[]): M | M[]
````
