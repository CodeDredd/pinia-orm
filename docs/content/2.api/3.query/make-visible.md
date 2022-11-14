---
title: 'makeVisible()'
description: 'Make hidden fields visible'
---

# `makeVisible()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Returns User with hidden field 'secret'
userRepo.makeVisible(['secret']).first() 

````

## Typescript Declarations

````ts
function makeVisible(fields: string[]): Query
````
