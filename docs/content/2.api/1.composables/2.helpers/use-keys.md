---
title: 'useKeys()'
description: 'The keys method returns all of the collections primary keys'
---

# `useKeys()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import { useKeys } from 'pinia-orm/helpers'
import User from './models/User'

const users = useRepo(User).all()

// retrieve all primary keys
useKeys(users)


````

## Type Declaration

````ts
export function useKeys(models: Collection): string[]
````
