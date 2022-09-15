---
title: 'useCache()'
description: 'Cache the query result.'
---

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

// Generate a cache with a auto generated key.
useRepo(User).useCache().get()

// Generate a cache with a manual key (recommanded).
useRepo(User).useCache('key').get()

// Generate a cache with a manual key and dynamic params (recommanded).
useRepo(User).useCache('key', { id: idProperty }).get()
````

## Typescript Declarations

````ts
function useCache(key?: string, params?: Record<string, any>): Query
````
