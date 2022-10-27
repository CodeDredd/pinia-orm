# [1.1.0](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@1.0.4...pinia-orm@1.1.0) (2022-10-27)

### Features

- **pinia-orm:** add `record` to saving hooks ([#491](https://github.com/CodeDredd/pinia-orm/issues/491)) ([3153101](https://github.com/CodeDredd/pinia-orm/commit/315310133762e744d4901cb8de2d55f6f37277ad))

## [1.0.4](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@1.0.3...pinia-orm@1.0.4) (2022-10-17)

### Bug Fixes

- **pinia-orm:** pivot are not correctly loaded ([#438](https://github.com/CodeDredd/pinia-orm/issues/438)) ([589136a](https://github.com/CodeDredd/pinia-orm/commit/589136a1349adced1371a1b26d8a003768a69bcc))

## [1.0.3](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@1.0.2...pinia-orm@1.0.3) (2022-09-20)

### Bug Fixes

- **pinia-orm:** multiple belongsToMany relations still wrong saved ([#373](https://github.com/CodeDredd/pinia-orm/issues/373)) ([6fd7348](https://github.com/CodeDredd/pinia-orm/commit/6fd73485afc283be72717b3d510f6ecfe6b3a5b7))

## [1.0.2](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@1.0.1...pinia-orm@1.0.2) (2022-09-20)

### Bug Fixes

- **pinia-orm:** multiple belongsTo relationships between 2 entities lead to unintended outcome ([#369](https://github.com/CodeDredd/pinia-orm/issues/369)) ([809f234](https://github.com/CodeDredd/pinia-orm/commit/809f2340da08001f240f8196135b84834f333d8d)), closes [#363](https://github.com/CodeDredd/pinia-orm/issues/363)

## [1.0.1](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@1.0.0...pinia-orm@1.0.1) (2022-09-19)

### Bug Fixes

- **pinia-orm:** fallback for "Buffer is not defined" & fix cache config ([#360](https://github.com/CodeDredd/pinia-orm/issues/360)) ([4c9a9f1](https://github.com/CodeDredd/pinia-orm/commit/4c9a9f1abedbdee50bf1873478dba593573c403a))

# [1.0.0](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@1.0.0-rc.6...pinia-orm@1.0.0) (2022-09-15)

# [1.0.0-rc.6](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@1.0.0-rc.5...pinia-orm@1.0.0-rc.6) (2022-08-20)

# [1.0.0-rc.5](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@1.0.0-rc.4...pinia-orm@1.0.0-rc.5) (2022-08-10)

### Features

- **pinia-orm:** add `retrieved` life cycle hook ([#145](https://github.com/CodeDredd/pinia-orm/issues/145)) ([7499c93](https://github.com/CodeDredd/pinia-orm/commit/7499c93070388dfccda0af9cd41d59d92fbb06b4))
- **pinia-orm:** add the possibility to create many models with "make" in repository ([#133](https://github.com/CodeDredd/pinia-orm/issues/133)) ([c7487cd](https://github.com/CodeDredd/pinia-orm/commit/c7487cd64159a7a78e426f5c7863eb33b23ce033))

### BREAKING CHANGES

- **pinia-orm:** Change PiniaORM.install() to createORM() [902f4c2](https://github.com/CodeDredd/pinia-orm/commit/902f4c2e2e3331ed50427f8ef9c4570ad39387d5)
- **pinia-orm:** Remove findIn since find does the same [#144](https://github.com/CodeDredd/pinia-orm/pull/144)

# [1.0.0-rc.4](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@1.0.0-rc.3...pinia-orm@1.0.0-rc.4) (2022-07-31)

### Bug Fixes

- **pinia-orm:** A few Query methods should have return type this instead of Query<M> ([#131](https://github.com/CodeDredd/pinia-orm/issues/131)) ([6eb0e87](https://github.com/CodeDredd/pinia-orm/commit/6eb0e878862c708b6a01da0f53211dac31cc6a1b))

### Features

- **pinia-orm:** Add single table inheritance support ([#117](https://github.com/CodeDredd/pinia-orm/issues/117)) ([36a00aa](https://github.com/CodeDredd/pinia-orm/commit/36a00aa50eb4737af909a5180479a9813826994b)), closes [vuex-orm/#519](https://github.com/CodeDredd/pinia-orm/issues/519)

# [1.0.0-rc.3](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@1.0.0-rc.2...pinia-orm@1.0.0-rc.3) (2022-07-28)

### Bug Fixes

- **pinia-orm:** belongsToMany was behaving incorrectly nested ([#118](https://github.com/CodeDredd/pinia-orm/issues/118)) ([5394b1d](https://github.com/CodeDredd/pinia-orm/commit/5394b1da9268a388d45a298d231cfbe4de64c6de))

# [1.0.0-rc.2](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@1.0.0-rc.1...pinia-orm@1.0.0-rc.2) (2022-07-27)

# [1.0.0-rc.1](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@1.0.0-alpha.2...pinia-orm@1.0.0-rc.1) (2022-07-23)

### Features

- **pinia-orm:** add query methods ([#105](https://github.com/CodeDredd/pinia-orm/issues/105)) ([b28fbac](https://github.com/CodeDredd/pinia-orm/commit/b28fbac55b79af9c8784c458af7fb54b1de34074))

# [1.0.0-alpha.2](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@1.0.0-alpha.1...pinia-orm@1.0.0-alpha.2) (2022-07-21)

### Features

- **pinia-orm:** add query method "has" ([87bff1e](https://github.com/CodeDredd/pinia-orm/commit/87bff1e3bae6fb7fcc16047fdc58e44312a1fab2))

# [1.0.0-alpha.1](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@0.14.0...pinia-orm@1.0.0-alpha.1) (2022-07-20)

### Features

- **pinia-orm:** Add casts for attributes & strict types ([#101](https://github.com/CodeDredd/pinia-orm/pull/101)) ([200f7d0](https://github.com/CodeDredd/pinia-orm/commit/200f7d0d1edba0915612a2c0b25e918c58f0ed20))

### Bug Fixes

- **pinia-orm:** Change compile target to fix loader errors with Nullish Coalescing operator ([0c810f8](https://github.com/CodeDredd/pinia-orm/commit/0c810f8be5daea3193ca6f0fa19e056ae33f5d10))

### BREAKING CHANGES

- **pinia-orm:** No more auto casting. if still want to have the same behaviour you have to use `casts`

# [0.14.0](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@0.13.0...pinia-orm@0.14.0) (2022-07-18)

### Features

- **pinia-orm:** add life-cycle-hooks ([#91](https://github.com/CodeDredd/pinia-orm/issues/91)) ([ca67576](https://github.com/CodeDredd/pinia-orm/commit/ca675768c662416cf053ad932ba4715f56275553))
- **pinia-orm:** Improve size & performance ([f6ceab5](https://github.com/CodeDredd/pinia-orm/commit/f6ceab5b0d8e9b9eea6eef7a8682adb42dd47040))

# [0.13.0](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@0.12.1...pinia-orm@0.13.0) (2022-07-13)

### Features

- **pinia-orm:** add mutators ([#84](https://github.com/CodeDredd/pinia-orm/issues/84)) ([5757f97](https://github.com/CodeDredd/pinia-orm/commit/5757f97e974e9fcca0be773b56931001bbd46005))

## [0.12.1](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@0.12.0...pinia-orm@0.12.1) (2022-07-12)

### Bug Fixes

- **pinia-orm:** belongsToMany not working correctly ([bc3e20a](https://github.com/CodeDredd/pinia-orm/commit/bc3e20ada9176cc87ed35911456d039230e51f4a))

### chore

- **pinia-orm:** Reduce build size by 33% ([bcd2f58](https://github.com/CodeDredd/pinia-orm/commit/bcd2f5815714fcd2abc9227a22a2e6cec9753a7f))

### BREAKING CHANGES

- **pinia-orm:** Dropping IE 11 support by removing last polyfill. Since pinia is also using "includes" i am dropping it. If needed please open a ticket to discuss

# [0.12.0](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@0.11.0...pinia-orm@0.12.0) (2022-07-11)

### Features

- **pinia-orm:** add belongsToMany relation function ([#79](https://github.com/CodeDredd/pinia-orm/issues/79)) ([8c1b91e](https://github.com/CodeDredd/pinia-orm/commit/8c1b91e9a3f7114580363c8f976c20014894d92f))

# [0.11.0](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@0.10.0...pinia-orm@0.11.0) (2022-07-11)

### Bug Fixes

- **#77:** current build not working for nuxt2 ([0b77360](https://github.com/CodeDredd/pinia-orm/commit/0b77360889929be31982415bf867d103162ac32b)), closes [#77](https://github.com/CodeDredd/pinia-orm/issues/77)

### Code Refactoring

- **pinia-orm:** Code clean up ([7b7f198](https://github.com/CodeDredd/pinia-orm/commit/7b7f198a914d41b915e2684a66369205e4c1bf58))

### BREAKING CHANGES

- **pinia-orm:** removed the options to pass a piniaStore or connetion to `useRepo`

# [0.10.0](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@0.9.3...pinia-orm@0.10.0) (2022-07-05)

### Features

- **#16:** Pass pinia options via model property ([9b50331](https://github.com/CodeDredd/pinia-orm/commit/9b5033184ee865cac58ea4e2cfdaf4ffeec3f4dc)), closes [#16](https://github.com/CodeDredd/pinia-orm/issues/16)
- added 182 tests & refactored code/tests ([eaa5a31](https://github.com/CodeDredd/pinia-orm/commit/eaa5a3166d128d4ba8f34bd52afc47527d866b36))

## [0.9.3](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@0.9.2...pinia-orm@0.9.3) (2022-06-29)

### Bug Fixes

- **#12:** flush is not working ([c71e2c8](https://github.com/CodeDredd/pinia-orm/commit/c71e2c8bd9b75fccee8db13cf0433e3173356e2b)), closes [#12](https://github.com/CodeDredd/pinia-orm/issues/12)
- **#14:** remove console.log in build & module type to get proper mjs ([09e0ebe](https://github.com/CodeDredd/pinia-orm/commit/09e0ebef1f7f15a13b44faddb27d639e25779804)), closes [#14](https://github.com/CodeDredd/pinia-orm/issues/14)

## [0.9.2](https://github.com/CodeDredd/pinia-orm/compare/pinia-orm@0.9.1...pinia-orm@0.9.2) (2022-02-14)

## [0.9.1](https://github.com/storm-tail/pinia-orm/compare/pinia-orm@0.9.0...pinia-orm@0.9.1) (2022-02-09)

### Bug Fixes

- **pinia-orm:** clean up & update module build for better import ([c301807](https://github.com/storm-tail/pinia-orm/commit/c301807e468dd2fa4c3052a32905896caf669eb3))

# [0.9.0](https://github.com/storm-tail/pinia-orm/compare/pinia-orm@0.8.4...pinia-orm@0.9.0) (2022-02-03)

### Bug Fixes

- nuxt2/nuxt3 bugs ([5679a44](https://github.com/storm-tail/pinia-orm/commit/5679a440c4a093e7d76f0c00fdf1d7d213e1b2a8))

## [0.8.4](https://github.com/storm-tail/pinia-orm/compare/pinia-orm@0.8.3...pinia-orm@0.8.4) (2022-01-30)

## [0.8.3](https://github.com/storm-tail/pinia-orm/compare/pinia-orm@0.8.0...pinia-orm@0.8.3) (2022-01-30)
