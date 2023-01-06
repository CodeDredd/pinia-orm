---
title: 'new()'
description: 'Create and persist model with default values.'
---

# `new()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Make a model with default values
userRepo.new()

````

## Typescript Declarations

````ts
function new(): Model | null
````
