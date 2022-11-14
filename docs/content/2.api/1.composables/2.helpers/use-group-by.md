---
title: 'useGroupBy()'
description: 'The useGroupBy method groups the collections items by a given key.'
---

# `useGroupBy()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import { useGroupBy } from 'pinia-orm/dist/helpers'
import User from './models/User'

const users = useRepo(User).all()

// group by the 'name' attribute
useGroupBy(users, 'name')
// group by the 'name' and 'age' attribute
useGroupBy(users, ['name', 'age'])

````

## Type Declaration

````ts
export function useGroupBy<T>(models: T[], fields: string[] | string): Record<string, T[]>
````
