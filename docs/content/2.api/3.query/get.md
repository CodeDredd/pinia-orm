---
title: 'get()'
description: 'Retrieve models by processing whole query chain.'
---

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

const users = userRepo.query().get() // User[] - all 
const usersPreName = userRepo.where('prename', 'John').get() // User[] - with prename 'John'
````

## Typescript Declarations

````ts
function get(): Collection<M>
````
