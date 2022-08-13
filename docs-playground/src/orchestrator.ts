import { reactive, watch, watchEffect } from 'vue'
// import { parse } from '@vue/compiler-sfc'
import { createEventHook } from '@vueuse/core'
import lz from 'lz-string'
import { compileFile } from './compiler/sfcCompiler'
// const demos = import.meta.glob('../demos/**/*.(vue|json)')

const shouldUpdateContent = createEventHook()

export interface OrchestratorPackage {
  name: string
  description?: string
  version?: string
  url: string
  source?: string
}

export class OrchestratorFile {
  filename: string
  template: string
  script: string
  style: string

  compiled = {
    js: '',
    css: '',
    ssr: '',
  }

  constructor(filename: string, template: string | undefined, script: string | undefined, style?: string) {
    this.filename = filename
    this.template = template || ''
    this.script = script || ''
    this.style = style || ''
  }

  get code() {
    if (this.filename.includes('.vue')) {
      return `
      <script setup>
        ${this.script}
      </script>
      <template>
        ${this.template}
      </template>
      `
    }
    return `${this.script}`
  }
}

export interface Orchestrator {
  files: {
    [key: string]: OrchestratorFile
  }
  packages: OrchestratorPackage[]
  activeFilename: string
  errors: (string | Error)[]
  runtimeErrors: (string | Error)[]

  readonly activeFile: OrchestratorFile | undefined
  readonly importMap: string
}

/**
 * Main app orchestrator, handles all the files, import maps, and errors
 */
export const orchestrator: Orchestrator = reactive({
  files: {
    'App.vue': new OrchestratorFile('App.vue', '', ''),
  },
  packages: [],
  activeFilename: 'App.vue',
  errors: [],
  runtimeErrors: [],

  get activeFile() {
    // @ts-ignore
    return orchestrator.files[this.activeFilename]
  },

  get importMap() {
    const imports = orchestrator.packages.map(({ name, url }) => `"${name}": "${url}"`)

    return `
      {
        "imports": {
          ${imports.join(',\n')}
        }
      }
    `
  },
})

/**
 * Setup Watchers
 */

watchEffect(() => {
  if (orchestrator.activeFile)
    compileFile(orchestrator.activeFile)
})

watch(() => orchestrator.activeFilename, () => {
  shouldUpdateContent.trigger(null)
})

export function exportState() {
  const files = Object.entries(orchestrator.files).reduce((acc, [name, { template, script }]) => {
    acc[name] = { template, script }
    return acc
  }, {})

  return lz.compressToEncodedURIComponent(JSON.stringify({
    packages: orchestrator.packages,
    files,
  }))
}

/**
 * Add a file to the orchestrator
 *
 * @param file File content
 */
export function addFile(file: OrchestratorFile) {
  orchestrator.files = {
    ...orchestrator.files,
    [file.filename]: file,
  }

  compileFile(orchestrator.files[file.filename])
}

export function setActiveFile(name: string) {
  orchestrator.activeFilename = name
}

/**
 * Remove a file from the orchestrator
 *
 * @param name Name of file to remove
 */
export function removeFile(name: string) {
  delete orchestrator.files[name]
  setTimeout(() => setActiveFile('App.vue'), 0)
}

/**
 * Remove all files from the orchestrator
 */
export function removeAllFiles() {
  orchestrator.files = {}
}

/**
 * Load a demo folder
 *
 * @param name Name of demo to open
 */
// export async function openDemo(name: string) {
//   // Get all modules from demo
//   const modules = (await Promise.all(Object.entries(demos)
//     .filter(([path]) => path.split('demos/')[1].split('/')[0] === name)
//     .filter(([path]) => path.includes('.vue') || path.includes('.json'))
//     .map(async([path]) => ([path, (await import(`${path}?raw`)).default]))))

//   console.log(modules)

// const packages = (await Promise.all(Object.entries(demos)
//   .filter(([path]) => path.split('demos/')[1].split('/')[0] === name)
//   .filter(([path]) => path.includes('.json'))
//   .map(async([path, imp]) => ([path, (await imp()).default]))))
//   .find(([path]) => path.includes('packages.json'))
//
// if (packages)
//   orchestrator.packages = packages[1]

//   removeAllFiles()

//   // Load Vue Files
//   modules
//     .filter(([path]) => path.includes('.vue'))
//     .map(([path, content]) => {
//       const { descriptor: { template, scriptSetup } } = parse(content)
//       return {
//         filename: path.split(`${name}/`)[1],
//         script: scriptSetup?.content.trim(),
//         template: template?.content.trim(),
//       }
//     })
//     .forEach(({ filename, script, template }) => {
//       addFile(new OrchestratorFile(filename, template, script))
//     })

//   setActiveFile('App.vue')
//   shouldUpdateContent.trigger(null)
// }

export const onShouldUpdateContent = shouldUpdateContent.on

// openDemo('default')

// App.vue
const appTemplate = `
<div
  grid="~ flow-col gap-4"
  place="content-center items-center"
  h="screen"
  font="mono"
  >
  <div class="min-w-[300px]">
    <select v-model="userSelect" class="mb-8 block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
      <option :value="null" selected>None</option>
      <option v-for="user in users" :value="user.id">{{ user.name }}</option>
    </select>
    <user-card v-if="userSelect !== null" :user="users.find(user => user.id === userSelect)" @removeTodo="removeTodo" />
    <div v-else class="min-h-[350px]"></div>
  </div>
</div>
`

const appScript = `
import { ref, computed } from 'vue'
import { useRepo } from 'pinia-orm'
import User from './User.js'
import Todo from './Todo.js'
import data from './data.js'
import userCard from './userCard.vue'

const userRepo = useRepo(User)
const todoRepo = useRepo(Todo)

const userSelect = ref(null)

userRepo.save(data.users)

const users = computed(() => userRepo.with('todos').get())

const removeTodo = (id) => {
  todoRepo.destroy(id)
}
`

const userCardTemplate = `
<div class="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
    <div class="flex flex-col items-center pb-10">
        <img class="mb-3 w-24 h-24 rounded-full shadow-lg" :src="user.avatarImgUrl" :alt="user.name">
        <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{{ user.firstName }}</h5>
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ user.lastName }}</span>
        <ul class="w-48 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li class="py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600 flex items-center" v-for="todo in user.todos">
                <span class="flex-grow">{{ todo.title }}</span>
                <button @click="removeTodo(todo.id)" class="inline-block p-[8px] rounded bg-red-400">
                    <svg class="h-[12px] w-[12px]" viewPort="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1" y1="11"
                              x2="11" y2="1"
                              stroke="black"
                              stroke-width="2"/>
                        <line x1="1" y1="1"
                              x2="11" y2="11"
                              stroke="black"
                              stroke-width="2"/>
                    </svg>
                </button>
            </li>
        </ul>
    </div>
</div>
`
const userCardScript = `
import { useRepo } from 'pinia-orm'

defineProps({
  user: Object,
})

const emit = defineEmits(['removeTodo'])

const removeTodo = (id) => {
  emit('removeTodo', id)
}
`

const dataScript = `
export default {
  users: [
    {
      id: 1,
      name: 'JohnK',
      avatarImgUrl: 'https://i.pravatar.cc/300?img=57',
      firstName: 'John',
      lastName: 'K',
      todos: [
        {
          title: 'Super',
        },
        {
          title: 'Cool',
        },
      ],
    },
    {
      id: 2,
      name: 'JaneD',
      avatarImgUrl: 'https://i.pravatar.cc/300?img=45',
      firstName: 'Jane',
      lastName: 'Doe',
      todos: [
        {
          title: 'Vue 3 is done',
        },
        {
          title: 'Release Nuxt 3',
        },
        {
          title: 'Add stuff',
        },
      ],
    }
  ]
}
`

// User.ts
const modelUserScript = `
import { Model } from 'pinia-orm'
import Todo from './Todo.js'

export default class User extends Model {
  static entity = 'users'

  static fields() {
    return {
      id: this.uid(),
      name: this.string(''),
      avatarImgUrl: this.string(''),
      firstName: this.string('').nullable(),
      lastName: this.string('').nullable(),
      todos: this.hasMany(Todo, 'userId'),
    }
  }
}
`

// ToDo.js
const modelToDoScript = `
import { Model } from 'pinia-orm'

export default class Todo extends Model {
  static entity = 'todos'

  static fields() {
    return {
      id: this.uid(),
      title: this.string(''),
      userId: this.attr(null).nullable(),
    }
  }
}
`

const initialPackages = [
  {
    name: 'vue-demi',
    source: 'unpkg',
    description: 'Vue Demi (half in French) is a developing utility allows you to write Universal Vue Libraries for Vue 2 & 3',
    url: 'https://unpkg.com/vue-demi/lib/index.mjs',
  },
  {
    name: '@vueuse/shared',
    source: 'unpkg',
    description: 'Shared VueUse utilities.',
    url: 'https://unpkg.com/@vueuse/shared@5.0.1/index.esm.js',
  },
  {
    name: '@vueuse/core',
    source: 'unpkg',
    description: 'Collection of essential Vue Composition Utilities',
    url: 'https://unpkg.com/@vueuse/core@5.0.1/index.esm.js',
  },
  {
    name: '@vue/devtools-api',
    source: 'unpkg',
    description: 'Interact with the Vue devtools from the page',
    url: 'https://unpkg.com/@vue/devtools-api@6.2.1/lib/esm/index.js',
  },
  {
    name: 'pinia',
    source: 'unpkg',
    description: 'Pinia',
    url: 'https://unpkg.com/pinia@2.0.18/dist/pinia.esm-browser.js',
  },
  {
    name: 'normalizr',
    source: 'unpkg',
    description: 'normalizr',
    url: 'https://unpkg.com/normalizr@3.6.2/dist/normalizr.es.js',
  },
  {
    name: 'nanoid/non-secure',
    source: 'unpkg',
    description: 'Nanoid',
    url: 'https://unpkg.com/nanoid@4.0.0/non-secure/index.js',
  },
  {
    name: 'pinia-orm',
    source: 'unpkg',
    description: 'Pinia ORM',
    url: 'https://unpkg.com/pinia-orm@1.0.0-rc.5/dist/index.mjs',
  },
]

function loadInitialState() {
  removeAllFiles()

  if (location.hash.slice(1)) {
    const { files, packages } = JSON.parse(lz.decompressFromEncodedURIComponent(location.hash.slice(1)))

    console.log(files, packages)

    if (files && packages) {
      orchestrator.packages = packages

      for (const f in files) {
        console.log(f)
        addFile(new OrchestratorFile(f, files[f].template, files[f].script))
      }
      setActiveFile('App.vue')
      shouldUpdateContent.trigger(null)
    }
  }
  else {
    orchestrator.packages = initialPackages
    addFile(new OrchestratorFile('App.vue', appTemplate.trim(), appScript.trim()))
    addFile(new OrchestratorFile('userCard.vue', userCardTemplate.trim(), userCardScript.trim()))
    addFile(new OrchestratorFile('data.js', '', dataScript.trim()))
    addFile(new OrchestratorFile('User.js', '', modelUserScript.trim()))
    addFile(new OrchestratorFile('Todo.js', '', modelToDoScript.trim()))
    setActiveFile('App.vue')
    shouldUpdateContent.trigger(null)
  }
}

setTimeout(() => {
  loadInitialState()
}, 0)
