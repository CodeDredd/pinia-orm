---
title: 'orWhereDoesntHave()'
description: 'Add a "or where doesnt have" clause to the query.'
---

# `orWhereDoesntHave()`

## Usage

Same as [whereDoesntHave usage](./whereDoesntHave#usage) just with "or" condition

## Typescript Declarations

````ts
function orWhereDoesntHave(
    relation: string, 
    callback: EagerLoadConstraint = () => {}
): Query
````
