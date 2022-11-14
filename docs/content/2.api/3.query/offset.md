---
title: 'offset()'
description: 'Set the "offset" value of the query.'
---

# `offset()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Remove the last 30 users
useRepo(User).offset(30).get()
````

## Typescript Declarations

````ts
function offset(value: number): Query
````
