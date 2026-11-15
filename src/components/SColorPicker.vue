<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {inputContainerClasses, inputIconColors} from '../theme/input-container'
import type {InputColor, InputVariant} from '../theme/input-container'
import {stemScaleClasses, stemScaleIcon, stemScaleStyle, type StemScaleProps, stemScaleDefaults} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'
import {singleLineText} from '../theme/sizes'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * A hex colour field on the Stem scale: at a given `size`, as tall as an
 * SButton, with the same text, icon, padding, gap and radius; the swatch is
 * an icon-sized circle. `text-size`, `icon-size`, `space`, `space-x`,
 * `space-y`, `roundness`, `rounded` as on every sized Stem component.
 */
const props = withDefaults(defineProps<StemScaleProps & {
  modelValue: string
  defaultValue?: string
  allowEmpty?: boolean
  placeholder?: string
  size?: Size
  variant?: InputVariant
  color?: InputColor
  disabled?: boolean
}>(), {
  ...stemScaleDefaults,
  variant: 'outline',
  color: 'primary',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const containerRef = ref<HTMLElement | null>(null)
const open = ref(false)
const inputValue = ref(props.modelValue)
const hasError = ref(false)
const focused = ref(false)

const hexRegex = /^#[0-9A-Fa-f]{6}$/

const canReset = computed(() =>
    props.defaultValue
    && props.modelValue.toLowerCase() !== props.defaultValue.toLowerCase(),
)

watch(() => props.modelValue, (newVal) => {
  inputValue.value = newVal
  hasError.value = false
})

function validateAndUpdate() {
  if (props.disabled) return
  const value = inputValue.value.trim()

  if (props.allowEmpty && value === '') {
    hasError.value = false
    emit('update:modelValue', '')
    inputValue.value = ''
    return
  }

  const normalizedValue = value.startsWith('#') ? value : `#${value}`

  if (hexRegex.test(normalizedValue)) {
    hasError.value = false
    const normalized = normalizedValue.toLowerCase()
    emit('update:modelValue', normalized)
    inputValue.value = normalized
  } else {
    hasError.value = true
  }
}

function handleColorPickerUpdate(value: string | undefined) {
  if (!value) return
  if (hexRegex.test(value)) {
    const normalized = value.toLowerCase()
    inputValue.value = normalized
    hasError.value = false
    emit('update:modelValue', normalized)
  }
}

function resetToDefault() {
  if (props.defaultValue) {
    const normalized = props.defaultValue.toLowerCase()
    inputValue.value = normalized
    hasError.value = false
    emit('update:modelValue', normalized)
  }
}

// Scale props inherited from a parent when not given; sm by default.
const scale = useStemScale(props, {size: 'sm'})
const scaleClasses = computed(() => [`s-size-${scale.value.size}`, ...stemScaleClasses(scale.value)])
const resolvedIconStyle = computed(() => stemScaleStyle(props))
const iconSizeClass = stemScaleIcon

const variantClasses = computed(() => {
  const cv = inputContainerClasses[props.color][props.variant]
  const f = focused.value
  const d = props.disabled
  return [
    cv.base,
    d ? 'opacity-75 cursor-not-allowed' : cv.hover,
    f && !d ? cv.focus : '',
  ]
})

const placeholderColor = computed(() => {
  return inputContainerClasses[props.color][props.variant].placeholder
})

const iconColor = computed(() => inputIconColors[props.color])

const popoverContentStyle = computed(() => {
  const width = containerRef.value?.offsetWidth ?? 0
  return {width: width ? `${width}px` : 'auto'}
})
</script>

<template>
  <UPopover
      v-model:open="open"
      :content="{
        side: 'bottom',
        align: 'start',
        sideOffset: 6,
      }"
      :ui="{
        // The popover floats in a portal: it takes the scale's classes too,
        // for its radius (the field's, plus the picker's inset).
        content: ['s-floating-menu s-corner-outer ring-0', ...scaleClasses].join(' '),
      }"
  >
    <div
        ref="containerRef"
        class="relative flex items-center w-full text-(length:--s-text) leading-(--s-icon-size) px-[calc(var(--s-px)+var(--s-pill-x,0px))] mx-[calc(var(--s-pill-x,0px)*-1)] py-(--s-py) gap-(--s-gap) h-[calc(var(--s-icon-size)+2*var(--s-py))]"
        :style="resolvedIconStyle"
        :class="[
          ...scaleClasses,
          ...variantClasses,
          hasError && 'ring-rose-500/60!',
        ]"
    >
      <span
          :style="{backgroundColor: hasError || !modelValue ? 'transparent' : modelValue}"
          :class="[
            'rounded-full shrink-0 outline -outline-offset-1 transition-colors duration-200',
            'size-(--s-icon-size)',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            hasError ? 'outline-rose-500' : !modelValue ? 'outline-dashed outline-black/20 dark:outline-white/20' : 'outline-black/10 dark:outline-white/15',
          ]"
          @mousedown.prevent
          @click.stop="!disabled && (open = true)"
      />

      <input
          v-model="inputValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :class="[placeholderColor, singleLineText]"
          class="flex-1 min-w-0 bg-transparent outline-none h-[calc(var(--s-icon-size)+2*var(--s-py))] -my-(--s-py)"
          @focus="focused = true"
          @blur="focused = false; validateAndUpdate()"
          @keydown.enter="validateAndUpdate()"
      >

      <div class="flex items-center gap-(--s-gap) shrink-0">
        <button
            v-if="canReset && !disabled"
            type="button"
            class="flex items-center cursor-pointer hover:text-(--ui-text) transition-colors duration-200"
            :class="iconColor"
            @mousedown.prevent.stop
            @click.stop="resetToDefault"
        >
          <UIcon name="i-ph-arrow-u-up-left" :class="iconSizeClass"/>
        </button>

        <button
            type="button"
            :disabled="disabled"
            class="flex items-center transition-colors duration-200"
            :class="disabled ? 'cursor-not-allowed opacity-75' : ['cursor-pointer hover:text-(--ui-text)', iconColor]"
            @mousedown.prevent
            @click.stop="!disabled && (open = !open)"
        >
          <UIcon name="i-ph-caret-down" :class="iconSizeClass"/>
        </button>
      </div>
    </div>

    <template #content>
      <!-- select-none: Nuxt UI's drag handler never preventDefaults pointerdown,
           so without it, dragging the picker thumb also drags a native text
           selection across the surrounding page. -->
      <UColorPicker
          :model-value="modelValue"
          class="p-2 select-none"
          :style="popoverContentStyle"
          :ui="{selector: `grow`}"
          @update:model-value="handleColorPickerUpdate"
      />
    </template>
  </UPopover>
</template>
