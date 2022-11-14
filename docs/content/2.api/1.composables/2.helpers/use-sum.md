---
title: 'useSum()'
description: 'Get the sum value of the specified filed.'
---

# `useSum()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import { useSum } from 'pinia-orm/dist/helpers'
import User from './models/User'

const users = useRepo(User).all()

// get the sum of the 'age' attribute
useSum(users, 'age')
// get the sum of the 'role.title' attribute. The dot notation works only for 1n1 Relations
useSum(users, 'role.title')

````

## Type Declaration

````ts
export function useSum(models: Collection, field: string): number
````
