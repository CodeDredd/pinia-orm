import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { computed, defineComponent, nextTick, onUpdated } from 'vue-demi'

import { Model, useRepo } from '../../src'
import { Num, Str } from '../../src/decorators'

describe('performance/prevent_rerender_of_child_components', () => {
  class Post extends Model {
    static entity = 'posts'

    @Num(0) id!: number
    @Str('') title!: string
  }

  const PostComponent = defineComponent({
    props: {
      post: {
        type: Object,
        required: true,
      },
    },
    setup () {
      onUpdated(() => {
        console.warn('<PostComponent /> Updated')
      })
    },
    template: `
    <div>{{ post.title }}</div>
    `,
  })

  const MainComponent = defineComponent({
    components: { PostComponent },
    setup () {
      const postRepo = useRepo(Post)

      const posts = computed(() => postRepo.all())
      let counter = 10

      const addPost = () => {
        postRepo.insert({
          id: counter++,
          title: `Test ${counter}`,
        })
      }

      const updatePost = () => {
        postRepo.where('id', 1).update({
          id: 1,
          title: `Test 1001`,
        })
      }

      const savePost = () => {
        postRepo.save({
          id: 1,
          title: `Test 1111`,
        })
      }

      return {
        posts,
        addPost,
        updatePost,
        savePost,
      }
    },
    template: `
    <div>
    <button id='insert' @click="addPost" > Click me </button>
    <button id='update' @click="updatePost" > Update 1 </button>
    <button id='save' @click="savePost" > Update 2 </button>
    <post-component v-for="post in posts" :post="post" :key="post.id" />
    </div>`,
  })

  it('it doesnt rerender child', async () => {
    expect(MainComponent).toBeTruthy()

    const wrapper = mount(MainComponent, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              posts: {
                data: {
                  1: { id: 1, title: 'Test 1' },
                },
              },
            },
          }),
        ],
      },
    })

    const logger = vi.spyOn(console, 'warn')

    await wrapper.find('button#insert').trigger('click')
    await nextTick()
    await wrapper.find('button#insert').trigger('click')
    await nextTick()
    await wrapper.find('button#insert').trigger('click')
    await nextTick()

    expect(wrapper.html()).toContain('Test 1')
    expect(wrapper.html()).toContain('Test 11')
    expect(wrapper.html()).toContain('Test 12')
    expect(wrapper.html()).toContain('Test 13')

    expect(logger).not.toBeCalled()

    await wrapper.find('button#update').trigger('click')
    await nextTick()

    await wrapper.find('button#save').trigger('click')
    await nextTick()
  })
})
