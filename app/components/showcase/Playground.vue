<script setup lang="ts">
import type {ShowcaseControl} from '~/utils/showcase-controls'

/**
 * Anteprima dal vivo + pannello dei controlli + codice generato.
 * Lo slot riceve `{props, mode}`: `props` sono le sole prop del componente
 * (i controlli con `prop: false` restano in `state`, per la demo).
 */
const props = defineProps<{
  tag: string
  controls: ShowcaseControl[]
  /** Attributi aggiunti in coda al codice generato (es. un handler). */
  codeExtra?: string
}>()

const state = defineModel<Record<string, any>>({required: true})

const componentProps = computed(() => {
  const out: Record<string, unknown> = {}
  for (const c of props.controls) {
    if (c.prop === false) continue
    const v = state.value[c.key]
    if (v !== undefined && v !== '') out[c.key] = v
  }
  return out
})

const code = computed(() => controlsToCode(props.tag, props.controls, state.value, props.codeExtra))

function reset() {
  state.value = controlDefaults(props.controls)
}
</script>

<template>
  <div class="grid grid-cols-[minmax(0,1fr)_15rem] items-start gap-4">
    <div class="space-y-3">
      <ShowcaseStage body-class="flex min-h-36 items-center justify-center-safe overflow-x-auto p-10">
        <template #default="{mode}">
          <ShowcaseMeasure>
            <slot :props="componentProps" :state="state" :mode="mode"/>
          </ShowcaseMeasure>
        </template>
      </ShowcaseStage>
      <ShowcaseCode :code="code"/>
    </div>
    <div class="sticky top-16 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
      <div class="mb-3 flex items-center justify-between">
        <p class="text-[12px] font-medium text-gray-900">Opzioni</p>
        <button type="button" class="text-[11px] text-gray-400 hover:text-gray-800" @click="reset">Ripristina</button>
      </div>
      <ShowcaseControls v-model="state" :controls="controls"/>
    </div>
  </div>
</template>
