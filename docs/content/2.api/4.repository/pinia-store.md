---
title: 'piniaStore'
description: 'Returns the pinia store used with this model'
---

## Usage

````js
import { useRepo } from 'pinia-orm'
import User from './models/User'

// Return the complete pinia Store instance
useRepo(User).piniaStore()
````

## Typescript Declarations
````ts
function piniaStore(): Store
````
