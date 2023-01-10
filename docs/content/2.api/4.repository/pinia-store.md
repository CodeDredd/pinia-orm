---
title: 'piniaStore'
description: 'Returns the pinia store used with this model'
---

# `piniaStore()`

## Usage

````js
import { useRepo } from 'pinia-orm'
import User from './models/User'

// Return the complete pinia Store instance
useRepo(User).piniaStore()
````

## Typescript Declarations
````ts
export interface DataStoreState {
  data: Record<string, any>
  [s: string]: any
}

function piniaStore<S extends DataStoreState = DataStoreState>(): Store
````
