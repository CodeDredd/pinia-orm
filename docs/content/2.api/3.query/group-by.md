---
title: 'groupBy()'
description: 'Groups the result by specific columns'
---

# `groupBy()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Group users by name.
useRepo(User).groupBy('name').get()

// You may also pass multiple columns
useRepo(User).groupBy('name', 'age').get()

````

## Typescript Declarations

````ts
function groupBy(...fields: GroupByFields): Query
````
