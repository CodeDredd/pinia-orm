[![Pinia ORM banner](./.github/assets/banner.png)](https://github.com/storm-tail/pinia-orm)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Coverage][code-coverage-src]][code-coverage-href]
[![License][license-src]][license-href]

# Welcome to pinia-orm

> Intuitive, type safe and flexible ORM for Pinia based on [Vuex ORM Next](https://github.com/vuex-orm/vuex-orm-next)

- [✨ &nbsp;Release Notes](https://pinia-orm.codedredd.de/changelog)
- [📖 &nbsp;Documentation](https://pinia-orm.codedredd.de)
- [👾 &nbsp;Playground](https://pinia-orm-play.codedredd.de)

## Migration from vuex-orm

You want to migrate from vuex to pinia and with it vuex-orm to pinia-orm but you don't know yet?
Well maybe this table will help you to decide. This comparison is just about facts and current state.

| Features                                                               | pinia-orm@v1.4.0                                           | @vuex-orm/core@0.36.4                                             | @vuex-orm/core@1.0.0-draft.16                                             |
|------------------------------------------------------------------------|------------------------------------------------------------| ----------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Bundle Size (Min + GZIP)                                               | [9.9 KB](https://bundlephobia.com/package/pinia-orm@1.4.0) | [16.7 KB](https://bundlephobia.com/package/@vuex-orm/core@0.36.4) | [12.6 KB](https://bundlephobia.com/package/@vuex-orm/core@1.0.0-draft.16) |
| Relations (hasMany, belongsTo, morphOne, hasManyBy, hasOne, morphTo)   | ✅                                                          | ✅                                                                | ✅                                                                        |
| Relations (morphMany, belongsToMany, hasManyThrough)                   | ✅                                                          | ✅                                                                | ❌                                                                        |
| Relations (morphToMany, morphedByMany)                                 | ❌                                                          | ✅                                                                | ❌                                                                        |
| Mutators                                                               | ✅                                                          | ✅                                                                | ❌                                                                        |
| Casts                                                                  | ✅                                                          | ❌                                                                | ❌                                                                        |
| Decorators                                                             | ✅                                                          | ❌                                                                | ✅                                                                        |
| Single Table Inheritance                                               | ✅                                                          | ✅                                                                | ❌                                                                        |
| Lifecycle Hooks                                                        | ✅                                                          | ✅                                                                | ❌                                                                        |
| Aggregates                                                             | ✅                                                          | ✅                                                                | ❌                                                                        |
| Query (orHas, doesntHave, orDoesntHave, whereHas, orWhereHas, groupBy) | ✅                                                          | ❌                                                                | ❌                                                                        |
| Collection Helpers                                                     | ✅                                                          | (✅) can use pinia-orm helpers too                                | (✅) can use pinia-orm helpers too                                        |
| Hidden Fields                                                          | ✅                                                          | ❌                                                                | ❌                                                                        |
| Metadata field                                                         | ✅                                                          | ❌                                                                | ❌                                                                        |
| Caching of queries with gc                                             | ✅                                                          | (✅) with plugin                                                  | ❌                                                                        |

If you decide to migrate then there are some breaking changes. A guide how to migrate will be written.
Small overview:

- Fields are by default `null`
- Renamed some functions aligning more with laravel naming
- Code is based on `vuex-orm-next` and not on `vuex-orm` !

## Help me keep working on this project 💚

- [Become a Sponsor on GitHub](https://github.com/sponsors/codedredd)
- [One-time donation via PayPal](https://paypal.me/dredd1984)

<!--sponsors start-->
<h3 align="center">Platinum Sponsors</h3>
<p align="center">
</p>

<h4 align="center">Gold Sponsors</h4>
<p align="center">
</p>

<h4 align="center">Silver Sponsors</h4>
<p align="center">
</p>

<h4 align="center">Bronze Sponsors</h4>
<p align="center">
  <a href="https://github.com/tintin10q" target="_blank" rel="noopener noreferrer">
    <picture>
      <source srcset="https://avatars.githubusercontent.com/u/24190849?v=4" media="(prefers-color-scheme: dark)" height="26px" alt="tintin10q" />
      <img src="https://avatars.githubusercontent.com/u/24190849?v=4" height="26px" alt="tintin10q" />
    </picture>
  </a>
  <a href="https://github.com/salcedo" target="_blank" rel="noopener noreferrer">
    <picture>
      <source srcset="https://avatars.githubusercontent.com/u/823026?v=4" media="(prefers-color-scheme: dark)" height="26px" alt="salcedo" />
      <img src="https://avatars.githubusercontent.com/u/823026?v=4" height="26px" alt="salcedo" />
    </picture>
  </a>
</p>

<h4 align="center">Backers</h4>
<p align="center">
  <a href="https://github.com/svenhue" target="_blank" rel="noopener noreferrer">
    <picture>
      <source srcset="https://avatars.githubusercontent.com/u/83905274?v=4" media="(prefers-color-scheme: dark)" height="26px" alt="Sven Hue" />
      <img src="https://avatars.githubusercontent.com/u/83905274?v=4" height="26px" alt="Sven Hue" />
    </picture>
  </a>
  <a href="https://github.com/paolodina" target="_blank" rel="noopener noreferrer">
    <picture>
      <source srcset="https://avatars.githubusercontent.com/u/1157401?v=4" media="(prefers-color-scheme: dark)" height="26px" alt="Paolo Dina" />
      <img src="https://avatars.githubusercontent.com/u/1157401?v=4" height="26px" alt="Paolo Dina" />
    </picture>
  </a>
</p>

<!--sponsors end-->

---

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable` (use `npm i -g corepack` for Node.js < 16.10)
- Install dependencies using `pnpm install`
- Build normalizr package: `pnpm build`
- Run interactive tests using `cd packages/pinia-orm && pnpm test:ui`

## Credits

- [Kia King Ishii](https://github.com/kiaking)
- [Cuebit](https://github.com/cuebit)
- [Posva](https://github.com/posva)

## Related projects

- [Vuex ORM](https://github.com/vuex-orm/vuex-orm)
- [Vuex ORM Next](https://github.com/vuex-orm/vuex-orm-next)

## License

Made with ❤️

Published under [MIT License](./LICENCE).

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
