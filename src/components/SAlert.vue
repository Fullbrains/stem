<script setup lang="ts">
import {stemScaleVars, stemSpacePx, stemSpaceStep, type StemScaleProps, type StemSize, stemScaleDefaults} from '../theme/scale'
import {alertClasses, type AlertColor, type AlertVariant} from '../theme/alert-colors'
import {STEM_SCALE, useStemScale} from '../composables/useStemScale'
import {useAppConfig} from '#imports'
import {useLocale} from '@nuxt/ui/composables'
import {computed, provide, useAttrs, useSlots} from 'vue'

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
 * Its buttons are SButtons on the alert's scale: the `actions` it is given,
 * the X, and any Stem control in its slots take its size, a pill, and a
 * padding-y two steps below (sm: 24px), so they sit on the title's line
 * without making a one-line alert taller. A button's own props win.
 *
 * A toast has no such slot: its `description` takes a render function, and
 * holds the content in the text's column.
 *   toast.add({title, description: () => h('div', [text, h(Body)])})
 */
defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<StemScaleProps & {
  /** On the Stem scale: text, icon, padding, gap and radius, as a button's. */
  size?: StemSize
  description?: string
  orientation?: 'horizontal' | 'vertical'
  /** The X: true, or the SModalButton props it takes. */
  close?: boolean | Record<string, unknown>
  closeIcon?: string
  ui?: Record<string, string | undefined>
}>(), {
  close: false,
  closeIcon: undefined,
  ...stemScaleDefaults,
  description: undefined,
  orientation: undefined,
  ui: undefined,
})

// Scale props inherited from a parent when not given; sm by default.
const scale = useStemScale(props, {size: 'sm'})
// The buttons are SModalButtons: their padding-y is a step below the size
// (sm: 6px, 28px tall). The actions are pulled up by as much, so they sit
// centred on the title's line.
const buttonSpaceY = computed(() => stemSpaceStep(scale.value.size!, -1))
const scaleStyle = computed(() => ({
  ...stemScaleVars(scale.value.size!, scale.value),
  '--s-alert-button-py': `${stemSpacePx(buttonSpaceY.value)}px`,
}))

// What the buttons inside inherit: the alert's size and type. Not its
// space: that is the alert's own, the buttons keep SModalButton's.
provide(STEM_SCALE, computed(() => ({
  ...scale.value,
  space: undefined,
  spaceX: undefined,
  spaceY: undefined,
})))

const emit = defineEmits<{'update:open': [value: boolean]}>()
const appConfig = useAppConfig()
const {t} = useLocale()

// The X: an icon-only SModalButton.
const closeIcon = computed(() => props.closeIcon ?? appConfig.ui?.icons?.close ?? 'i-ph-x')
const closeProps = computed(() => typeof props.close === 'object' ? props.close : {})
// On a solid alert the X keeps the tone's own tint (the iron pill would vanish).
const closeTint = computed(() => {
  const variant = (attrs.variant as AlertVariant) ?? 'outline'
  return variant === 'solid' ? alertClasses(((attrs.color as AlertColor) ?? 'primary'), 'solid').close : undefined
})

const slots = useSlots()
const attrs = useAttrs()

// The slots UAlert gets as they are: all but the default one, and but the
// description when the default one rebuilds it.
const forwarded = computed(() => Object.keys(slots)
  .filter(name => name !== 'default' && name !== 'actions' && name !== 'close' && !(slots.default && name === 'description')))

const actions = computed(() => (attrs.actions as Record<string, unknown>[] | undefined) ?? [])
const hasActions = computed(() => actions.value.length > 0 || !!slots.actions)

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

// The buttons overhang the title's line by their padding-y, above and below,
// centred on it: a one-line alert is no taller for them.
const actionsClass = '-my-(--s-alert-button-py)'

const ui = computed(() => {
  const own = props.ui ?? {}
  if (!spread.value) {
    return {...own, actions: [props.orientation === 'vertical' ? '' : actionsClass, own.actions].filter(Boolean).join(' ')}
  }
  const c = cells.value
  return {
    ...own,
    root: [c.root, own.root].filter(Boolean).join(' '),
    icon: [c.icon, own.icon].filter(Boolean).join(' '),
    avatar: [c.icon, own.avatar].filter(Boolean).join(' '),
    title: [c.title, own.title].filter(Boolean).join(' '),
    actions: [c.actions, actionsClass, own.actions].filter(Boolean).join(' '),
    // Wrapper and description step aside: their children are the grid's.
    wrapper: ['contents', own.wrapper].filter(Boolean).join(' '),
    description: ['contents', own.description].filter(Boolean).join(' '),
  }
})

const bodyClass = computed(() => {
  // A little air between the text and the content (the buttons, mostly).
  if (!spread.value) return 'mt-(--s-py)'
  return [cells.value.body, hasDescription.value ? 'row-start-3 mt-(--s-py)' : 'row-start-2 mt-(--s-py)']
})
</script>

<template>
  <UAlert v-bind="$attrs" :description="description" :orientation="orientation" :close="!!close" :ui="ui" :style="scaleStyle">
    <template v-for="name in forwarded" :key="name" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}"/>
    </template>
    <template v-if="hasActions" #actions>
      <slot name="actions">
        <SModalButton v-for="(action, index) in actions" :key="index" v-bind="action"/>
      </slot>
    </template>
    <template v-if="close" #close>
      <slot name="close">
        <SModalButton
            :icon="closeIcon"
            :aria-label="t('alert.close')"
            v-bind="closeProps"
            data-slot="close"
            :class="closeTint"
            @click="emit('update:open', false)"
        />
      </slot>
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
