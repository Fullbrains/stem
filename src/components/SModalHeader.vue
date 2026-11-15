<script setup lang="ts">
import {computed} from 'vue'
import {safeHtml} from '../safeHtml'
import {stemScale, stemSizeStep, stemSpacePx, stemSpaceStep} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: string
  /**
   * The compact header: the icon inline with the title.
   * `'mobileOnly'`: compact below sm — where SModal is a sheet from the
   * bottom — and full from sm.
   */
  compact?: boolean | 'mobileOnly'
  closeable?: boolean
  disabled?: boolean
  /** The title wraps onto as many lines as it needs, instead of being cut
   with an ellipsis: a document's name, a title the reader came for. */
  wrap?: boolean
}>(), {
  closeable: true,
  disabled: false,
})

defineEmits<{
  close: []
}>()

// The padding, all around, three steps of space above the modal's size
// (md: 16px). It follows the modal's scale props.
const scale = useStemScale({}, {space: '+3'})
// The title a text step above the modal's size (the size's own in the
// compact header), the description a step below and muted, right under it
// (md: 18px, compact 16px, and 14px).
const textSize = (by: number) => `${stemScale[stemSizeStep(scale.value.size ?? 'md', by)].text}px`
const paddingStyle = computed(() => ({
  '--s-modal-p': `${stemSpacePx(scale.value.space!)}px`,
  '--s-modal-title-full': textSize(1),
  '--s-modal-title-compact': textSize(0),
  '--s-modal-description': textSize(-1),
}))

/** HTML, sanitized: see safeHtml. */
const descriptionHtml = computed(() => safeHtml(props.description))

/**
 * Each part of the header, compact, full, or compact below sm only. The
 * buttons (actions and close) sit at the top, centred on a row as tall as
 * the title's line, as an alert's: the same place with or without an icon
 * above the title. However tall they are they overhang it equally above
 * and below, and the header is no taller for them.
 */
const titleRow = 'h-[calc(var(--s-modal-title)*1.25)]'
const compactClasses = computed(() => {
  if (props.compact === 'mobileOnly') {
    return {
      header: '[--s-modal-title:var(--s-modal-title-full)] max-sm:[--s-modal-title:var(--s-modal-title-compact)]',
      buttons: titleRow,
      blockIcon: 'max-sm:hidden',
      inlineIcon: 'sm:hidden',
    }
  }
  return props.compact
      ? {header: '[--s-modal-title:var(--s-modal-title-compact)]', blockIcon: 'hidden', inlineIcon: '', buttons: titleRow}
      : {header: '[--s-modal-title:var(--s-modal-title-full)]', blockIcon: '', inlineIcon: 'hidden', buttons: titleRow}
})

// The buttons — the actions and the close — are a size below the modal's,
// never below sm (an sm or xs modal keeps its own): the actions inherit it, the close is an SModalButton of it (md modal: sm,
// 8 × 6px, 28px tall). A step above their size's space apart (md modal: 10px), the
// modal's padding from the text.
const buttonSize = computed(() => {
  const size = scale.value.size ?? 'md'
  return size === 'xs' || size === 'sm' ? size : stemSizeStep(size, -1)
})
const buttonGap = computed(() => `${stemSpacePx(stemSpaceStep(buttonSize.value, 1))}px`)

const slots = defineSlots<{
  title?: () => unknown
  description?: () => unknown
  /** Buttons in the header, beside the close button (e.g. "Remove"). */
  actions?: () => unknown
}>()
</script>

<template>
  <header
      class="p-(--s-modal-p) flex items-start gap-(--s-modal-p) relative shrink-0 w-full"
      :style="paddingStyle"
      :class="compactClasses.header"
  >
    <div
        class="min-w-0 flex-1 flex flex-col text-base"
        :class="{ truncate: !wrap }"
    >
      <UIcon
          v-if="icon"
          :name="icon"
          class="size-10 shrink-0 mb-[1em]"
          :class="compactClasses.blockIcon"
      />
      <div
          v-if="title || slots.title"
          class="text-(length:--s-modal-title) font-semibold leading-tight block flex items-center gap-[0.5em]"
          :class="[wrap ? 'whitespace-normal' : 'truncate']"
      >
        <UIcon
            v-if="icon"
            :name="icon"
            class="size-6 shrink-0"
            :class="compactClasses.inlineIcon"
        />
        <slot name="title">{{ title }}</slot>
      </div>
      <div
          v-if="description || slots.description"
          class="text-(length:--s-modal-description) text-muted block whitespace-normal sm:whitespace-pre-line"
      >
        <slot name="description"><span v-html="descriptionHtml"/></slot>
      </div>
    </div>
    <SScale
        v-if="slots.actions || closeable"
        :size="buttonSize"
        class="flex shrink-0 items-center"
        :class="compactClasses.buttons"
        :style="{gap: buttonGap}"
    >
      <slot name="actions"/>
      <SCloseButton
          v-if="closeable"
          :size="buttonSize"
          :disabled="disabled"
          @click="$emit('close')"
      />
    </SScale>
  </header>
</template>
