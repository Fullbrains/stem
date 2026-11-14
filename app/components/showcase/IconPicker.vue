<script setup lang="ts">
import {phosphorIcons, phosphorWeights, type PhosphorWeight} from '~/utils/phosphor-icons'
import type {ShowcaseOption} from '~/utils/showcase-controls'

/**
 * Scelta di un'icona Phosphor fra tutte (1500+, in sei pesi), con ricerca.
 * Le opzioni del controllo restano in cima come scorciatoie: "nessuna" e i
 * valori che non sono icone (true/false di alcune prop).
 */
const props = defineProps<{
  options: ShowcaseOption[]
}>()

const model = defineModel<unknown>()

const open = ref(false)
const query = ref('')
const LIMIT = 120

// Le scorciatoie che non sono icone Phosphor (nessuna, true, false…).
const extras = computed(() => props.options.filter(o => !String(optionValue(o)).startsWith('i-ph-')))

const current = computed(() => typeof model.value === 'string' && model.value.startsWith('i-ph-') ? model.value : undefined)

function split(icon?: string): {name: string, weight: PhosphorWeight} {
  const raw = icon?.replace(/^i-ph[-:]/, '') ?? ''
  for (const w of phosphorWeights) {
    if (w !== 'regular' && raw.endsWith(`-${w}`)) return {name: raw.slice(0, -w.length - 1), weight: w}
  }
  return {name: raw, weight: 'regular'}
}

const weight = ref<PhosphorWeight>(split(current.value).weight)

function iconOf(name: string, w = weight.value) {
  return w === 'regular' ? `i-ph-${name}` : `i-ph-${name}-${w}`
}

const matches = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = q ? phosphorIcons.filter(n => n.includes(q)) : phosphorIcons
  return {shown: list.slice(0, LIMIT), total: list.length}
})

function pick(name: string) {
  model.value = iconOf(name)
}

watch(weight, (w) => {
  const {name} = split(current.value)
  if (name) model.value = iconOf(name, w)
})

const label = computed(() => {
  if (current.value) return split(current.value).name + (weight.value !== 'regular' ? ` · ${weight.value}` : '')
  const extra = extras.value.find(o => optionValue(o) === model.value)
  return extra ? optionLabel(extra) : 'nessuna'
})
</script>

<template>
  <div class="space-y-1.5">
    <button
        type="button"
        class="flex w-full items-center gap-2 rounded-md bg-white px-2 py-1 text-left ring-1 ring-gray-200 hover:ring-gray-400"
        @click="open = !open"
    >
      <UIcon v-if="current" :name="current" class="size-4 shrink-0 text-gray-700"/>
      <span v-else class="size-4 shrink-0 rounded-sm ring-1 ring-gray-200 ring-dashed"/>
      <span class="min-w-0 flex-1 truncate text-gray-700">{{ label }}</span>
      <UIcon :name="open ? 'i-ph-caret-up' : 'i-ph-caret-down'" class="size-3 shrink-0 text-gray-400"/>
    </button>

    <div v-if="open" class="space-y-2 rounded-md bg-white p-2 ring-1 ring-gray-200">
      <input
          v-model="query"
          placeholder="Cerca fra 1500+ icone"
          class="w-full rounded-md bg-gray-50 px-2 py-1 ring-1 ring-gray-200 outline-none focus:ring-gray-400"
      >
      <div class="flex flex-wrap gap-1">
        <button
            v-for="w in phosphorWeights"
            :key="w"
            type="button"
            class="rounded px-1.5 py-0.5 text-[10px] ring-1"
            :class="weight === w ? 'bg-gray-900 text-white ring-gray-900' : 'text-gray-500 ring-gray-200 hover:ring-gray-400'"
            @click="weight = w"
        >{{ w }}</button>
      </div>
      <div v-if="extras.length" class="flex flex-wrap gap-1">
        <button
            v-for="o in extras"
            :key="String(optionValue(o))"
            type="button"
            class="rounded px-1.5 py-0.5 text-[10px] ring-1"
            :class="model === optionValue(o) ? 'bg-gray-900 text-white ring-gray-900' : 'text-gray-500 ring-gray-200 hover:ring-gray-400'"
            @click="model = optionValue(o)"
        >{{ optionLabel(o) }}</button>
      </div>
      <div class="grid max-h-56 grid-cols-6 gap-0.5 overflow-y-auto">
        <button
            v-for="name in matches.shown"
            :key="name"
            type="button"
            :title="name"
            class="flex aspect-square items-center justify-center rounded text-gray-700 hover:bg-gray-100"
            :class="split(current).name === name && 'bg-gray-900! text-white'"
            @click="pick(name)"
        >
          <UIcon :name="iconOf(name)" class="size-4"/>
        </button>
      </div>
      <p class="text-[10px] text-gray-400">
        {{ matches.total > LIMIT ? `${LIMIT} di ${matches.total}: cerca per restringere` : `${matches.total} icone` }}
      </p>
    </div>
  </div>
</template>
