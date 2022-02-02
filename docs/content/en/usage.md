---
title: Usage
description: 'The Pinia plugin to enable Object-Relational Mapping access to the Pinia Store.'
position: 1
category: Getting started
---

Check the [Vuex ORM Next Documentation](https://nuxtjs.org/api/configuration-modules#the-modules-property) for more information right now about repository functions.

## Concept

There is only one little difference between vuex-orm and pinia-orm usage. You need to use ``useRepo`` 

  ```js
  import User from "./models/User"
  import { useRepo } from 'pinia-orm'

  const userRepo = useRepo(User)
  // Getting all users
  const users = useRepo.all()
  ```

