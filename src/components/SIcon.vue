<script setup lang="ts">
import { inject, nextTick, onMounted, ref, watch } from 'vue'
import { STEM_ICON_LOADER, type StemIconLoader } from '@fullbrains/stem/icon-loader'

const props = withDefaults(defineProps<{
  name: string
  proportional?: boolean
  constrained?: boolean
}>(), {
  proportional: false,
  constrained: false,
})

const emit = defineEmits<{
  ready: []
}>()

const source = ref('')

const injectedLoader = inject<StemIconLoader | null>(STEM_ICON_LOADER, null)

async function load() {
  try {
    if (injectedLoader) {
      const svg = await injectedLoader(props.name)
      source.value = svg ?? ''
    }
    else {
      source.value = ''
    }
    await nextTick()
    emit('ready')
  }
  catch {
    emit('ready')
  }
}

watch(() => props.name, load)
onMounted(load)
</script>

<template>
  <span
    :class="{ 's-icon--prop': proportional, 's-icon--constrained': constrained }"
    class="s-icon"
    v-html="source"
  />
</template>

<style>
.s-icon {
  display: flex;
}

.s-icon svg *[fill='black'],
.s-icon svg *[fill='#000'],
.s-icon svg *[fill='#000000'] {
  fill: currentColor !important;
}

.s-icon svg *[stroke='black'],
.s-icon svg *[stroke='#000'],
.s-icon svg *[stroke='#000000'] {
  stroke: currentColor !important;
}

.s-icon--prop svg {
  width: 100%;
  height: 100%;
}

/* Safari fix: prevent SVG expansion in flex containers */
.s-icon--prop.s-icon--constrained svg {
  width: auto;
}
</style>
