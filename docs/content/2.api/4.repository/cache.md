---
title: 'cache'
description: 'Returns the cache instance of the repository'
---

## Usage

````js
import { useRepo } from 'pinia-orm'
import User from './models/User'

// Returns the cache instance
useRepo(User).cache()
````

## Typescript Declarations

````ts
function cache(): WeakCache
````
