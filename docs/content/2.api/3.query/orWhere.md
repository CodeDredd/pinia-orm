---
title: 'orWhere()'
description: 'Add an "or where" clause to the query.'
---

## Usage

Same as [where usage](./where#usage) just with "or" condition

## Typescript Declarations

````ts
function orWhere(
  field: WherePrimaryClosure | string,
  value?: WhereSecondaryClosure | any,
): Query
````
