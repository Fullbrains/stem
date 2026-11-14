<script setup lang="ts">
import {stemScale, stemScaleVars, stemSizeStep, stemSpacePx, stemSpaceShift, stemSpaceStep, type StemScaleProps, type StemSize, type StemSizeValue, type StemSpace, type StemSpaceValue, stemScaleDefaults} from '../theme/scale'
import {alertClasses, alertSolidAction, type AlertColor, type AlertVariant} from '../theme/alert-colors'
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
 * Its buttons are SModalButtons of its size: space-x the size's own,
 * space-y a step below (sm: 28px), centred on the title's line without
 * making a one-line alert taller; on a solid alert, tinted to stay
 * readable. The `actions` it is given and the X get these; an `#actions`
 * slot gets them as params, to bind on what it renders:
 *   <template #actions="{button, primary}">
 *     <SModalButton v-bind="button" label="Annulla"/>
 *     <SDropdownMenu :items="items"><SModalButton v-bind="button" label="Altro" caret/></SDropdownMenu>
 *     <SModalButton v-bind="primary" label="OK"/>
 *   </template>
 * `button` is a plain one, `primary` the default action (primary, solid).
 * Any other Stem control in its slots takes its size. A button's own props win.
 *
 * A toast has no such slot: its `description` takes a render function, and
 * holds the content in the text's column.
 *   toast.add({title, description: () => h('div', [text, h(Body)])})
 */
defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<StemScaleProps & {
  /** On the Stem scale: text, icon, padding, gap and radius, as a button's. */
  size?: StemSizeValue
  description?: string
  orientation?: 'horizontal' | 'vertical'
  /** The X: true, or the SModalButton props it takes. */
  close?: boolean | Record<string, unknown>
  /**
   * The buttons' scale, all of them at once (the X, the actions, the slot's
   * params): `size`, `spaceX`, `spaceY`, each a step or a shift from their
   * default (size: the alert's; space-x: their size's; space-y: a step
   * below it). `{spaceY: '+1'}`: a step taller.
   */
  buttons?: {size?: StemSizeValue, spaceX?: StemSpaceValue, spaceY?: StemSpaceValue}
  /**
   * The description's text size: a size, or a shift from the alert's text
   * ('-1' by default: sm alert, xs description, 12px on 16px lines).
   */
  descriptionTextSize?: StemSizeValue
  closeIcon?: string
  ui?: Record<string, string | undefined>
}>(), {
  close: false,
  closeIcon: undefined,
  buttons: undefined,
  descriptionTextSize: '-1',
  ...stemScaleDefaults,
  description: undefined,
  orientation: undefined,
  ui: undefined,
})

// Scale props inherited from a parent when not given; sm by default, two
// steps more space-x than its size and four more space-y (sm: 12 × 16px),
// the radius a step rounder (sm: md's, 8px).
const scale = useStemScale(props, {size: 'sm', spaceX: '+2', spaceY: '+4', roundness: '+1'})

// The buttons are SModalButtons of the alert's size, space-x the size's own
// (no shift: sm 8px), space-y a step below it (sm: 6px, 28px tall); the
// `buttons` prop moves the group from there.
function shiftOr<T>(v: unknown, base: T, step: (from: T, by: number) => T): T {
  if (v == null) return base
  const by = stemSpaceShift(v)
  return by == null ? v as T : step(base, by)
}
const buttonSize = computed(() => shiftOr<StemSize>(props.buttons?.size, scale.value.size!, stemSizeStep))
const buttonSpaceX = computed(() => shiftOr<StemSpace>(props.buttons?.spaceX, buttonSize.value, stemSpaceStep))
const buttonSpaceY = computed(() => shiftOr<StemSpace>(props.buttons?.spaceY, stemSpaceStep(buttonSize.value, -1), stemSpaceStep))
// The description a step below the alert's text: that step's text, on
// lines of its icon plus 4px, as the alert's own description.
const descriptionSize = computed(() => shiftOr<StemSize>(props.descriptionTextSize, (scale.value.textSize ?? scale.value.size)!, stemSizeStep))
const scaleStyle = computed(() => ({
  ...stemScaleVars(scale.value.size!, scale.value),
  '--s-alert-description-text': `${stemScale[descriptionSize.value].text}px`,
  '--s-alert-description-leading': `${stemScale[descriptionSize.value].icon + 4}px`,
  '--s-alert-button-gap': `${stemSpacePx(stemSpaceStep(scale.value.spaceX ?? scale.value.space ?? scale.value.size!, -1))}px`,
}))

// What the buttons inside inherit: the alert's size and type. Not its
// space and radius: that is the alert's own, the buttons keep SModalButton's, space-y a step below the size.
provide(STEM_SCALE, computed(() => ({
  ...scale.value,
  roundness: undefined,
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
// On a solid alert the X and the soft actions take the tone's own tint (the
// iron pill would vanish), a solid action the ground's opposite (it would
// melt into it).
const solidColor = computed(() => ((attrs.variant as AlertVariant) ?? 'outline') === 'solid' ? ((attrs.color as AlertColor) ?? 'primary') : null)
const closeTint = computed(() => solidColor.value ? alertClasses(solidColor.value, 'solid').close : undefined)
function actionTint(action: Record<string, unknown>) {
  if (!solidColor.value) return undefined
  return action.variant === 'solid' ? alertSolidAction(solidColor.value) || undefined : closeTint.value
}

// The buttons' props: what the generated ones get, and the #actions slot's
// params (`button`, `primary`).
const buttonScale = computed(() => ({size: buttonSize.value, spaceX: buttonSpaceX.value, spaceY: buttonSpaceY.value}))
const primaryAction = {color: 'primary', variant: 'solid'} as const
const actionParams = computed(() => ({
  button: {...buttonScale.value, class: actionTint({})},
  primary: {...buttonScale.value, ...primaryAction, class: actionTint(primaryAction)},
}))

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

// The actions' row is exactly the title's line, the buttons centred on it:
// however tall they are, they overhang it equally above and below, and a
// one-line alert is no taller for them.
const actionsClass = 'my-0 h-(--s-icon-size) items-center content-center'
// Between the buttons: a step below the alert's own space (sm: 10px).
const actionsGap = 'gap-(--s-alert-button-gap)'

const ui = computed(() => {
  const own = props.ui ?? {}
  if (!spread.value) {
    return {...own, actions: [props.orientation === 'vertical' ? actionsGap : `${actionsClass} ${actionsGap}`, own.actions].filter(Boolean).join(' ')}
  }
  const c = cells.value
  return {
    ...own,
    root: [c.root, own.root].filter(Boolean).join(' '),
    icon: [c.icon, own.icon].filter(Boolean).join(' '),
    avatar: [c.icon, own.avatar].filter(Boolean).join(' '),
    title: [c.title, own.title].filter(Boolean).join(' '),
    actions: [c.actions, actionsClass, actionsGap, own.actions].filter(Boolean).join(' '),
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
      <slot name="actions" v-bind="actionParams">
        <SModalButton v-for="(action, index) in actions" :key="index" v-bind="{...buttonScale, ...action}" :class="actionTint(action)"/>
      </slot>
    </template>
    <template v-if="close" #close>
      <slot name="close">
        <SModalButton
            :icon="closeIcon"
            :aria-label="t('alert.close')"
            v-bind="{...buttonScale, ...closeProps}"
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
