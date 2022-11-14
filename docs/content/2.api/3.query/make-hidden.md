---
title: 'makeHidden()'
description: 'Make visible fields hidden'
---

# `makeHidden()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Returns User without the field 'phone'
userRepo.makeHidden(['phone']).first() 

````

## Typescript Declarations

````ts
function makeHidden(fields: string[]): Query
````
