---
title: 'usePluck()'
description: 'The pluck method retrieves all of the values for a given key.'
---

## Usage

````ts
import { useRepo } from 'pinia-orm'
import { usePluck } from 'pinia-orm/dist/helpers'
import User from './models/User'

const users = useRepo(User).all()

// retrieve all values of the 'age' attribute
usePluck(users, 'age')
// retrieve all values of the 'role.title' attribute. The dot notation works only for 1n1 Relations
usePluck(users, 'role.title')

````

## Type Declaration

````ts
export function usePluck(models: Collection, field: string): any[]
````
