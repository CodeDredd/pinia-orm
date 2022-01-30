<p align="center">
  <a href="https://github.com/storm-tail/pinia-orm" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://pinia-orm.codedredd.de/logo_pinia_orm.png" alt="Pinia ORM logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/pinia-orm"><img src="https://badgen.net/npm/v/pinia-orm" alt="npm package"></a>
</p>
<br/>

# Pinia ORM

> Intuitive, type safe and flexible ORM for Pinia based on [Vuex ORM Next](https://github.com/vuex-orm/vuex-orm-next)

- 💡 Intuitive
- 🔑 Type Safe
- 📦 Extremely light

## Help me keep working on this project 💚

- [Become a Sponsor on GitHub](https://github.com/sponsors/codedredd)
- [One-time donation via PayPal](https://paypal.me/dredd1984)

<!--sponsors start-->


<!--sponsors end-->

---

## FAQ

A few notes about the project and possible questions:

**Q**: _Does it work with the same models as vuex-orm?_

**A**: Yes, this code is based on their work

## Roadmap

### to v 1.0.0
- [x] Get it work with minimal breaking changes
- [ ] Code clean up
- [ ] Documentation
- [ ] Tests

## Installation

### Vue

```bash
yarn add pinia-orm
# or with npm
npm install pinia-orm
```

If you are using Vue 2, make sure to install latest `@vue/composition-api`:

```bash
npm install pinia @vue/composition-api pinia-orm
```

### Nuxt

````bash
yarn add pinia-orm @pinia-orm/nuxt
````

## Usage

### Install the plugin (Vue)

Create models like and pass it to app:

```js
import { createPinia } from 'pinia'
import PiniaORM from 'pinia-orm'

const pinia = createPinia(PiniaORM.install())

app.use(pinia)
```

### Install the plugin (Nuxt)

````ts
import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  buildModules: ['@pinia/nuxt'],
  modules: ['@pinia-orm/nuxt'],
})
````

### Usage in setup

Create models like your used with [Vuex ORM Next](https://github.com/vuex-orm/vuex-orm-next)

Look up their [docs](https://next.vuex-orm.org/)

```ts
import User from "./models/User"
import { useRepo } from 'pinia-orm'


export default defineComponent({
  setup() {
    const userRepo = useRepo(User)
    const users = userRepo.all()

    return {
      users
    }
  },
})
```

## Special thanks

I wan to thank [Kia King Ishii](https://github.com/kiaking) and their contributors for all their awesome work with vuex-orm

## Documentation

In progress

## License

[MIT](http://opensource.org/licenses/MIT)

