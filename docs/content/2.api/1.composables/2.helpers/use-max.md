---
title: 'useMax()'
description: 'Get the max value of the specified filed.'
---

## Usage

````ts
import { useRepo } from 'pinia-orm'
import { useMax } from 'pinia-orm/dist/helpers'
import User from './models/User'

const users = useRepo(User).all()

// get the max of the 'age' attribute
useMax(users, 'age')
// get the max of the 'role.title' attribute. The dot notation works only for 1n1 Relations
useMax(users, 'role.title')

````

## Type Declaration

````ts
export function useMax(models: Collection, field: string): number
````
