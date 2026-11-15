<script setup lang="ts">
import type {HintColor, HintSize} from '../../../src/components/SHint.vue'
import type {ShowcaseControl} from '~/utils/showcase-controls'

// SHint non è un componente Nuxt UI: color e size vengono dai suoi tipi.
const colors: HintColor[] = ['muted', 'primary', 'info', 'success', 'warning', 'danger']
const sizes: HintSize[] = ['xs', 'sm', 'md', 'lg']

const icons = [
  {label: 'quella del colore', value: undefined},
  {label: 'lock-simple', value: 'i-ph-lock-simple'},
  {label: 'lightbulb', value: 'i-ph-lightbulb'},
  {label: 'clock', value: 'i-ph-clock'},
  {label: 'keyboard', value: 'i-ph-keyboard'},
  {label: 'sparkle', value: 'i-ph-sparkle'},
]

const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'color', type: 'select', options: colors, default: 'muted'},
  {group: 'Aspetto', key: 'size', type: 'select', options: sizes, default: 'xs'},
  {group: 'Aspetto', key: 'icon', type: 'select', options: icons},
  {group: 'Aspetto', key: 'iconSize', label: 'icon-size', type: 'select', options: [{label: 'da size', value: undefined}, 'xs', 'sm', 'md', 'lg', 'xl']},

  {group: 'Demo', key: 'text', label: 'testo (slot)', type: 'text', prop: false, initial: 'Puoi salvarlo in più cartelle insieme.'},
  {group: 'Demo', key: 'width', label: 'larghezza del contenitore', type: 'select', prop: false, default: 'auto', options: [
    {label: 'libera', value: 'auto'}, {label: '16rem', value: '16rem'}, {label: '10rem', value: '10rem'},
  ]},
]

const state = useShowcaseState<Record<string, any>>('hint', () => controlDefaults(controls))

function without(p: Record<string, unknown>, ...keys: string[]) {
  const out = {...p}
  for (const k of keys) delete out[k]
  return out
}

const current = computed(() => {
  const out: Record<string, unknown> = {}
  for (const c of controls) {
    if (c.prop === false) continue
    const v = state.value[c.key]
    if (v !== undefined && v !== '') out[c.key] = v
  }
  return out
})

const text = computed(() => state.value.text || 'Puoi salvarlo in più cartelle insieme.')
const width = computed(() => (state.value.width && state.value.width !== 'auto' ? {width: state.value.width} : undefined))
const longText = 'Molti documenti hanno solo l\'anno: cercare per date esatte li lascia fuori dai risultati.'
</script>

<template>
  <ShowcasePage
      title="Hint"
      description="Una regola detta dove vale, in una riga piccola sopra o sotto ciò che riguarda. Niente padding né margini propri: la posiziona il contenitore."
  >
    <ShowcasePlayground v-model="state" tag="SHint" :controls="controls">
      <template #default="{props}">
        <SHint v-bind="props" :style="width">{{ text }}</SHint>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Color × size"
        description="Ogni colore ha la sua icona, se icon non ne chiede un'altra. In chiaro info, success e warning sono un 700 e danger un 600: i più chiari che passano AA."
    >
      <ShowcaseMatrix :rows="colors" :cols="sizes">
        <template #cell="{row, col}">
          <SHint v-bind="without(current, 'color', 'size')" :color="row" :size="col" class="text-left">{{ row }}</SHint>
        </template>
      </ShowcaseMatrix>
    </ShowcaseSection>

    <ShowcaseSection
        title="Size"
        description="Altezza × larghezza, testo e icona in px, al colore scelto."
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <SHint v-bind="without(current, 'size')" :size="item as HintSize">{{ text }}</SHint>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="A capo"
        description="L'icona è centrata sulla prima riga (h-[1lh]): quando il testo va a capo resta in alto, a ogni size."
    >
      <ShowcaseStage body-class="grid grid-cols-4 items-start gap-6 p-8">
        <SHint v-for="s in sizes" :key="s" v-bind="without(current, 'size')" :size="s">{{ longText }}</SHint>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Nel contesto"
        description="Sotto un campo e sopra un gruppo di azioni: lo spazio lo decide il contenitore."
    >
      <ShowcaseStage body-class="grid grid-cols-2 items-start gap-8 p-8">
        <div class="space-y-1.5">
          <SInput placeholder="Nome della cartella" class="w-full"/>
          <SHint v-bind="current">{{ text }}</SHint>
        </div>
        <div class="space-y-2">
          <SHint v-bind="without(current, 'icon')" icon="i-ph-lock-simple">Solo tu vedi questa nota.</SHint>
          <div class="flex gap-2">
            <SButton label="Salva" size="sm"/>
            <SButton label="Annulla" size="sm" variant="ghost" color="neutral"/>
          </div>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
