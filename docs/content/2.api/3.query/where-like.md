---
title: 'whereLike()'
description: 'Add a where clause matching a SQL LIKE style pattern to the query.'
---

# `whereLike()`

Filters records with a SQL `LIKE` style pattern. `%` matches any number of characters, `_` matches exactly one character. Matching is case insensitive by default — pass `true` as third argument for case sensitive matching.

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// All users whose name contains "john" (case insensitive).
userRepo.whereLike('name', '%john%').get()

// All users whose name starts with "John" (case sensitive).
userRepo.whereLike('name', 'John%', true).get()

// Single character wildcard: matches "John Doe" and "Jahn Doe".
userRepo.whereLike('name', 'J_hn Doe').get()

// Combine with other where clauses.
userRepo.where('active', true).orWhereLike('name', 'jane%').get()
````

## Typescript Declarations

````ts
function whereLike(field: string, value: string | number, caseSensitive = false): Query
function orWhereLike(field: string, value: string | number, caseSensitive = false): Query
````
