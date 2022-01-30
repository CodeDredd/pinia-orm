# `@pinia-orm/nuxt`

> Nuxt 2 & 3 module

## Installation

```sh
npm i @pinia-orm/nuxt
```

## Usage

Add to `modules` in `nuxt.config.js`:

```js
export default {
  buildModules: [['@pinia/nuxt', { disableVuex: true }]],
  modules: ['@pinia-orm/nuxt'],
}
```

Note you also need `@nuxtjs/composition-api` if you are using Nuxt 2 without Bridge. [Refer to docs for more](https://pinia.vuejs.org/ssr/nuxt.html).

## License

[MIT](http://opensource.org/licenses/MIT)
