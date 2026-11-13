<script setup lang="ts">
import {computed, useAttrs, useSlots} from 'vue'

/**
 * UAlert with a place for content under the text: chips to pick from, a
 * progress bar, a short list. Nuxt UI's alert has no such slot — `actions`
 * sits beside the text in `horizontal` — so this is the only reason
 * SAlert exists. Without a default slot it is UAlert as is.
 *
 * Every UAlert prop and slot passes through (`title`, `description`, `icon`,
 * `color`, `variant`, `orientation`, `actions`, `close`, …); the look is the
 * Stem alert theme.
 *
 * The default slot starts where the text starts, under the description.
 * In `horizontal` it runs to the alert's right edge, under the actions and
 * the X too: the alert is laid out as a grid (icon · text · actions), the
 * text's blocks are placed in it one by one, and the slot spans the text's
 * and the actions' columns. In `vertical` the actions are under the text
 * already, and the slot stays in the text's column.
 *
 * A toast has no such slot: its `description` takes a render function, and
 * holds the content in the text's column.
 *   toast.add({title, description: () => h('div', [text, h(Body)])})
 */
defineOptions({inheritAttrs: false})

const props = defineProps<{
  description?: string
  orientation?: 'horizontal' | 'vertical'
  ui?: Record<string, string | undefined>
}>()

const slots = useSlots()
const attrs = useAttrs()

// The slots UAlert gets as they are: all but the default one, and but the
// description when the default one rebuilds it.
const forwarded = computed(() => Object.keys(slots)
  .filter(name => name !== 'default' && !(slots.default && name === 'description')))

const hasDescription = computed(() => !!props.description || !!slots.description)

// The slot spread under the actions: horizontal, with something to spread.
const spread = computed(() => !!slots.default && props.orientation === 'horizontal')

const hasIcon = computed(() => !!attrs.icon || !!attrs.avatar || !!slots.leading)

// Grid cells, literal so Tailwind sees them: with an icon the text is the
// second column and the actions the third; without, first and second.
const cells = computed(() => hasIcon.value
  ? {
      root: 'grid grid-cols-[auto_minmax(0,1fr)_auto] gap-y-0',
      icon: 'col-start-1 row-start-1',
      title: 'col-start-2 row-start-1',
      actions: 'col-start-3 row-start-1',
      description: 'col-start-2 row-start-2',
      body: 'col-start-2 col-end-4',
    }
  : {
      root: 'grid grid-cols-[minmax(0,1fr)_auto] gap-y-0',
      icon: '',
      title: 'col-start-1 row-start-1',
      actions: 'col-start-2 row-start-1',
      description: 'col-start-1 row-start-2',
      body: 'col-start-1 col-end-3',
    })

const ui = computed(() => {
  if (!spread.value) return props.ui
  const own = props.ui ?? {}
  const c = cells.value
  return {
    ...own,
    root: [c.root, own.root].filter(Boolean).join(' '),
    icon: [c.icon, own.icon].filter(Boolean).join(' '),
    avatar: [c.icon, own.avatar].filter(Boolean).join(' '),
    title: [c.title, own.title].filter(Boolean).join(' '),
    actions: [c.actions, own.actions].filter(Boolean).join(' '),
    // Wrapper and description step aside: their children are the grid's.
    wrapper: ['contents', own.wrapper].filter(Boolean).join(' '),
    description: ['contents', own.description].filter(Boolean).join(' '),
  }
})

const bodyClass = computed(() => {
  // A little air between the text and the content (the buttons, mostly).
  if (!spread.value) return hasDescription.value ? 'mt-3.5' : 'mt-3'
  return [cells.value.body, hasDescription.value ? 'row-start-3 mt-3.5' : 'row-start-2 mt-3']
})
</script>

<template>
  <UAlert v-bind="$attrs" :description="description" :orientation="orientation" :ui="ui">
    <template v-for="name in forwarded" :key="name" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}"/>
    </template>
    <template v-if="slots.default" #description>
      <p v-if="spread && hasDescription" :class="[cells.description, 'mt-1']">
        <slot name="description">{{ description }}</slot>
      </p>
      <slot v-else-if="!spread" name="description">{{ description }}</slot>
      <div :class="bodyClass">
        <slot/>
      </div>
    </template>
  </UAlert>
</template>
