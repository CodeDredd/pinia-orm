---
title: 'useMin()'
description: 'Get the min value of the specified filed.'
---

# `useMin()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import { useMin } from 'pinia-orm/dist/helpers'
import User from './models/User'

const users = useRepo(User).all()

// get the min of the 'age' attribute
useMin(users, 'age')
// get the min of the 'role.title' attribute. The dot notation works only for 1n1 Relations
useMin(users, 'role.title')

````

## Type Declaration

````ts
export function useMin(models: Collection, field: string): number
````
