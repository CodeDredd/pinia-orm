---
title: 'limit()'
description: 'Set the "limit" value of the query.'
---

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Return only 30 users
useRepo(User).limit(30).get()
````

## Typescript Declarations

````ts
function limit(value: number): Query
````
