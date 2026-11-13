<script setup lang="ts">
import {computed, useSlots} from 'vue'

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
 * The default slot goes inside the description block, after the
 * description, so it lines up with the text and the icon and actions keep
 * standing beside the title. A toast does the same through its
 * `description`, which takes a render function:
 *   toast.add({title, description: () => h('div', [text, h(Body)])})
 */
defineOptions({inheritAttrs: false})

defineProps<{
  description?: string
}>()

const slots = useSlots()

// The slots UAlert gets as they are: all but the default one, and but the
// description when the default one rebuilds it.
const forwarded = computed(() => Object.keys(slots)
  .filter(name => name !== 'default' && !(slots.default && name === 'description')))
</script>

<template>
  <UAlert v-bind="$attrs" :description="description">
    <template v-for="name in forwarded" :key="name" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}"/>
    </template>
    <template v-if="slots.default" #description>
      <slot name="description">{{ description }}</slot>
      <div :class="description || slots.description ? 'mt-2.5' : 'mt-1.5'">
        <slot/>
      </div>
    </template>
  </UAlert>
</template>
