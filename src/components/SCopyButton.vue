<script setup lang="ts">
import {onBeforeUnmount, ref} from 'vue'
import type {ButtonProps} from '@nuxt/ui'

/**
 * Copies a text to the clipboard, and shows a check in place of its icon
 * while the copy is fresh. An SButton underneath: `color`, `variant` and
 * `size` are its own, and whatever else SButton takes (compact, disc,
 * rounded, classes) passes through, so it fits the surface it sits on.
 *
 * `text` may be a function, called on click, for a value fetched only when
 * wanted — a secret revealed on demand. Returning null copies nothing; a
 * failure is emitted as `error` and leaves the icon alone.
 *
 * Where the Clipboard API is refused (an embedded browser, a frame without
 * the permission) it falls back to the older selection-and-copy command.
 *
 * Icon-only: `label` is its accessible name (aria-label), never shown. It is
 * English by default, so an app passes it in its own language.
 */
const props = withDefaults(defineProps<{
  text: string | (() => string | null | Promise<string | null>)
  /** Accessible name (aria-label). Not rendered. */
  label?: string
  color?: ButtonProps['color']
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  icon?: string
  copiedIcon?: string
  /** How long the check stays, in milliseconds. */
  duration?: number
}>(), {
  label: 'Copy',
  color: 'neutral',
  variant: 'soft',
  size: undefined,
  icon: 'i-ph-copy',
  copiedIcon: 'i-ph-check',
  duration: 1500,
})

const emit = defineEmits<{
  copied: [text: string]
  error: [error: unknown]
}>()

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function legacyCopy(value: string) {
  const area = document.createElement('textarea')
  area.value = value
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  const done = document.execCommand('copy')
  area.remove()
  if (!done) throw new Error('Copy refused')
}

async function write(value: string) {
  try {
    await navigator.clipboard.writeText(value)
  }
  catch {
    legacyCopy(value)
  }
}

async function copy() {
  try {
    const value = typeof props.text === 'function' ? await props.text() : props.text
    if (value == null) return
    await write(value)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
    }, props.duration)
    emit('copied', value)
  }
  catch (error) {
    emit('error', error)
  }
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <SButton
    :icon="copied ? copiedIcon : icon"
    :color="color"
    :variant="variant"
    :size="size"
    :aria-label="label"
    @click="copy"
  />
</template>
