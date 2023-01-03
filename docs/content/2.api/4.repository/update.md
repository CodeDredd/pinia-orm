---
title: 'update()'
description: 'Tries to update given record or records by their id.'
---

# `update()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// update specific record
userRepo.update({ id: 1, age: 50 })

// update specific records
userRepo.update([{ id: 1, age: 50 }, { id: 2, age: 50 }])

// throws an warning if the record to update is not found
userRepo.update({ id: 999, age: 50 })
````

## Typescript Declarations

````ts
function update(records: Element | Element[]): M | M[]
````
