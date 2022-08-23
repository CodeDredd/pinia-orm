---
title: 'orWhereHas()'
description: 'Add a "or where has" clause to the query.'
---

## Usage

Same as [whereHas usage](./whereHas#usage) just with "or" condition

## Typescript Declarations

````ts
function orWhereHas(
    relation: string, 
    callback: EagerLoadConstraint = () => {}, 
    operator?: string | number, 
    count?: number
): Query
````
