<script setup lang="ts">
import type {ShowcaseControl} from '~/utils/showcase-controls'

/**
 * Anteprima dal vivo + codice generato; i controlli vanno nella sidebar
 * fissa a destra del layout (#showcase-options), uno sotto l'altro se la
 * pagina ha più playground.
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

// Il layout apre la sidebar delle opzioni finché c'è almeno un playground.
const optionsCount = useState('showcase-options-count', () => 0)
onMounted(() => optionsCount.value++)
onBeforeUnmount(() => optionsCount.value--)
</script>

<template>
  <div>
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
    <ClientOnly>
      <Teleport to="#showcase-options" defer>
        <section class="border-b border-gray-200 px-4 py-4 last:border-b-0">
          <div class="mb-3 flex items-center justify-between">
            <p class="text-[12px] font-medium text-gray-900">
              Opzioni <span class="font-mono font-normal text-gray-400">{{ tag }}</span>
            </p>
            <button type="button" class="text-[11px] text-gray-400 hover:text-gray-800" @click="reset">Ripristina</button>
          </div>
          <ShowcaseControls v-model="state" :controls="controls"/>
        </section>
      </Teleport>
    </ClientOnly>
  </div>
</template>
