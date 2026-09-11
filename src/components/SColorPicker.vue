<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {inputContainerClasses, inputIconColors} from '../theme/input-container'
import type {InputColor, InputVariant} from '../theme/input-container'
import {iconSizeClass, iconSizeFor, iconSizeStyle} from '../theme/icon-sizes'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(defineProps<{
  modelValue: string
  defaultValue?: string
  allowEmpty?: boolean
  placeholder?: string
  size?: Size
  iconSize?: string
  variant?: InputVariant
  color?: InputColor
  disabled?: boolean
}>(), {
  size: 'sm',
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

// Size: matches golden rule from sizes.ts
const sizeClasses: Record<Size, string> = {
  xs: 'text-xs leading-normal min-h-[calc(1lh+1em)]',
  sm: 'text-sm leading-normal min-h-[calc(1lh+1em)]',
  md: 'text-base leading-normal min-h-[calc(1lh+1em)]',
  lg: 'text-lg leading-normal min-h-[calc(1lh+1em)]',
  xl: 'text-xl leading-normal min-h-[calc(1lh+1em)]',
}

// Sets --s-icon-size on the container; the icons below read it through
// iconSizeClass, so the `iconSize` prop overrides all of them at once.
const iconSizeVars: Record<Size, string> = {
  xs: iconSizeFor('xs'),
  sm: iconSizeFor('sm'),
  md: iconSizeFor('md'),
  lg: iconSizeFor('lg'),
  xl: iconSizeFor('xl'),
}

const resolvedIconStyle = computed(() => iconSizeStyle(props.iconSize))

// The swatch is a colour sample rather than an icon, so it sits one step above
// the icon scale to stay readable — still on the same 4px grid.
const swatchSize: Record<Size, string> = {
  xs: 'size-4',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-7',
}

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
        content: 's-floating-menu s-corner [--s-radius:8px] ring-0',
      }"
  >
    <div
        ref="containerRef"
        class="relative flex items-center gap-[0.5em] w-full px-[0.6em] py-[0.5em]"
        :style="resolvedIconStyle"
        :class="[
          sizeClasses[props.size],
          iconSizeVars[props.size],
          ...variantClasses,
          hasError && 'border-rose-500/60!',
        ]"
    >
      <span
          :style="{backgroundColor: hasError || !modelValue ? 'transparent' : modelValue}"
          :class="[
            'rounded-full shrink-0 outline -outline-offset-1 transition-colors duration-200',
            swatchSize[props.size],
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
          :class="[placeholderColor]"
          class="flex-1 min-w-0 bg-transparent outline-none"
          @focus="focused = true"
          @blur="focused = false; validateAndUpdate()"
          @keydown.enter="validateAndUpdate()"
      >

      <div class="flex items-center gap-[0.25em] shrink-0">
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
