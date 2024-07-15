import { createPinia } from 'pinia';
import { createORM } from 'pinia-orm';
import { createPiniaOrmAxios } from '@pinia-orm/axios';
import axios from 'axios';

export default {
  setup() {
    const pinia = createPinia();
    const piniaOrm = createORM({
      plugins: [
        createPiniaOrmAxios({
          axios,
        })
      ]
    });
    pinia.use(piniaOrm);
  },
};
