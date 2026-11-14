<script setup lang="ts">
import type {ShowcaseControl} from '~/utils/showcase-controls'

/**
 * Pannello dei controlli, costruito dallo schema. Usa HTML semplice e non i
 * componenti di Stem: il pannello non deve cambiare mentre si rivede il tema.
 */
const props = defineProps<{
  controls: ShowcaseControl[]
}>()

const state = defineModel<Record<string, any>>({required: true})

const groups = computed(() => {
  const out: {label?: string, controls: ShowcaseControl[]}[] = []
  for (const c of props.controls) {
    const last = out[out.length - 1]
    if (last && last.label === c.group) last.controls.push(c)
    else out.push({label: c.group, controls: [c]})
  }
  return out
})

function set(key: string, value: unknown) {
  state.value = {...state.value, [key]: value}
}

// Le prop che prendono un'icona Phosphor: tutte le icone, con ricerca.
function isIcon(c: ShowcaseControl) {
  return c.type === 'select' && /icon$/i.test(c.key) && c.options.some(o => String(optionValue(o)).startsWith('i-ph-'))
}

function isSegmented(c: ShowcaseControl) {
  return c.type === 'select' && c.options.length <= 7
}
</script>

<template>
  <div class="space-y-4 text-[12px]">
    <div v-for="(g, gi) in groups" :key="gi" class="space-y-2.5">
      <p v-if="g.label" class="text-[11px] font-medium text-gray-400">{{ g.label }}</p>
      <div v-for="c in g.controls" :key="c.key">
        <!-- boolean -->
        <label v-if="c.type === 'boolean'" class="flex cursor-pointer items-center justify-between gap-2">
          <span class="text-gray-600">{{ c.label ?? c.key }}</span>
          <button
              type="button"
              class="relative h-4 w-7 rounded-full transition-colors"
              :class="state[c.key] ? 'bg-gray-900' : 'bg-gray-300'"
              :aria-pressed="!!state[c.key]"
              @click="set(c.key, !state[c.key])"
          >
            <span
                class="absolute top-0.5 left-0.5 size-3 rounded-full bg-white transition-transform"
                :class="state[c.key] && 'translate-x-3'"
            />
          </button>
        </label>

        <!-- icona -->
        <div v-else-if="c.type === 'select' && isIcon(c)">
          <p class="mb-1 text-gray-600">{{ c.label ?? c.key }}</p>
          <ShowcaseIconPicker
              :model-value="state[c.key]"
              :options="c.options"
              @update:model-value="set(c.key, $event)"
          />
        </div>

        <!-- select segmentato -->
        <div v-else-if="c.type === 'select' && isSegmented(c)">
          <p class="mb-1 text-gray-600">{{ c.label ?? c.key }}</p>
          <div class="flex flex-wrap gap-1">
            <button
                v-for="o in c.options"
                :key="String(optionValue(o))"
                type="button"
                class="rounded-md px-2 py-0.5 ring-1 transition-colors"
                :class="state[c.key] === optionValue(o)
                  ? 'bg-gray-900 text-white ring-gray-900'
                  : 'bg-white text-gray-600 ring-gray-200 hover:ring-gray-400'"
                @click="set(c.key, optionValue(o))"
            >{{ optionLabel(o) }}</button>
          </div>
        </div>

        <!-- select lungo -->
        <label v-else-if="c.type === 'select'" class="block">
          <span class="mb-1 block text-gray-600">{{ c.label ?? c.key }}</span>
          <select
              class="w-full rounded-md bg-white px-2 py-1 ring-1 ring-gray-200 outline-none focus:ring-gray-400"
              @change="set(c.key, optionValue(c.options[Number(($event.target as HTMLSelectElement).value)]!))"
          >
            <option
                v-for="(o, i) in c.options"
                :key="i"
                :value="i"
                :selected="optionValue(o) === state[c.key]"
            >{{ optionLabel(o) }}</option>
          </select>
        </label>

        <!-- text -->
        <label v-else-if="c.type === 'text'" class="block">
          <span class="mb-1 block text-gray-600">{{ c.label ?? c.key }}</span>
          <input
              class="w-full rounded-md bg-white px-2 py-1 ring-1 ring-gray-200 outline-none focus:ring-gray-400"
              :value="state[c.key] ?? ''"
              :placeholder="c.placeholder"
              @input="set(c.key, ($event.target as HTMLInputElement).value)"
          >
        </label>
      </div>
    </div>
  </div>
</template>
