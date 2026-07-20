[![Pinia ORM banner](./.github/assets/banner.png)](https://github.com/storm-tail/pinia-orm)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Coverage][code-coverage-src]][code-coverage-href]
[![License][license-src]][license-href]

# Welcome to pinia-orm

> The intuitive, type safe and flexible ORM for [Pinia](https://pinia.vuejs.org) — normalize relational data in your stores and query it like with an ORM.

- [✨ &nbsp;Release Notes](https://pinia-orm.codedredd.de/changelog)
- [📖 &nbsp;Documentation](https://pinia-orm.codedredd.de)
- [👾 &nbsp;Playground](https://pinia-orm-play.codedredd.de)

## Features

- Laravel-style query builder — `where`, `whereLike`, `whereHas`, `orderBy` (incl. `Intl.Collator`), `groupBy`, aggregates, `updateOrCreate` / `firstOrCreate` and more
- All the relations: `hasOne`, `hasMany`, `belongsTo`, `belongsToMany`, `hasManyThrough`, `morphOne`, `morphTo`, `morphMany`, `morphToMany`, `morphedByMany`
- Standard [ECMAScript decorators](https://pinia-orm.codedredd.de/guide/getting-started/typescript) for type safe model definitions
- Single Table Inheritance with nested discriminators, lifecycle hooks, mutators, casts, hidden fields and query caching
- First class [Nuxt module](https://pinia-orm.codedredd.de/guide/nuxt/setup) (Nuxt 3 & 4) and an [axios plugin](https://pinia-orm.codedredd.de/plugins/axios/guide/setup)

## Quick start

```bash
npm install pinia pinia-orm
```

```ts
import { createPinia } from 'pinia'
import { createORM } from 'pinia-orm'

const pinia = createPinia().use(createORM())
```

```ts
import { Model, useRepo } from 'pinia-orm'
import { Attr, HasMany, Str, Uid } from 'pinia-orm/decorators'

class Todo extends Model {
  static entity = 'todos'

  @Uid() id!: string
  @Str('') text!: string
  @Attr(null) userId!: string | null
}

class User extends Model {
  static entity = 'users'

  @Uid() id!: string
  @Str('') name!: string
  @HasMany(() => Todo, 'userId') todos!: Todo[]
}

const userRepo = useRepo(User)

userRepo.save({ id: '1', name: 'John', todos: [{ text: 'Read the docs' }] })
const usersWithTodos = userRepo.with('todos').get()
```

Read the [documentation](https://pinia-orm.codedredd.de) for the full guide, or check the [comparison with vuex-orm](https://pinia-orm.codedredd.de/guide/getting-started/what-is-pinia-orm#comparison-with-vuex-orm) and the [migration guide](https://pinia-orm.codedredd.de/guide/getting-started/migration-guide) if you're upgrading.

## Requirements

| pinia-orm | pinia   | Node     | TypeScript |
|-----------|---------|----------|------------|
| 2.x       | >= 3    | >= 22.12 | >= 5.2     |
| 1.x       | 2.x     | >= 14    | >= 4.x     |

## Help me keep working on this project 💚

- [Become a Sponsor on GitHub](https://github.com/sponsors/codedredd)
- [One-time donation via PayPal](https://paypal.me/dredd1984)

<p align="center">
  <a href="https://pinia-orm.codedredd.de/sponsorkit/sponsors.png">
    <img src='https://pinia-orm.codedredd.de/sponsorkit/sponsors.svg'/>
  </a>
</p>

---

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Build the packages once with `pnpm build:stub && pnpm build:ci`
- Run tests using `pnpm test` (or `cd packages/pinia-orm && pnpm test:ui` for the interactive UI)

## Credits

- [Kia King Ishii](https://github.com/kiaking)
- [Cuebit](https://github.com/cuebit)
- [Posva](https://github.com/posva)

## Related projects

- [Vuex ORM](https://github.com/vuex-orm/vuex-orm)
- [Vuex ORM Next](https://github.com/vuex-orm/vuex-orm-next)

## License

Made with ❤️

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/pinia-orm/latest.svg
[code-coverage-src]: https://img.shields.io/codecov/c/github/CodeDredd/pinia-orm?logo=Codecov&logoColor=white&token=BYLAJJOOLS
[code-coverage-href]: https://app.codecov.io/gh/CodeDredd/pinia-orm
[npm-version-href]: https://npmjs.com/package/pinia-orm
[npm-downloads-src]: https://img.shields.io/npm/dm/pinia-orm.svg
[npm-downloads-href]: https://npmjs.com/package/pinia-orm
[github-actions-ci-src]: https://github.com/codedredd/pinia-orm/actions/workflows/ci.yml/badge.svg
[github-actions-ci-href]: https://github.com/codedredd/pinia-orm/actions?query=workflow%3Aci
[license-src]: https://img.shields.io/npm/l/pinia-orm.svg
[license-href]: https://npmjs.com/package/pinia-orm
