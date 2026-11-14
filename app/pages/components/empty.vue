<script setup lang="ts">
import type {ShowcaseControl} from '~/utils/showcase-controls'

// SEmpty non è un componente Nuxt UI: le opzioni vengono dai suoi tipi.
const orientations = ['vertical', 'horizontal']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']

const icons = [
  {label: 'quella di default', value: undefined},
  {label: 'folder-open', value: 'i-ph-folder-open'},
  {label: 'magnifying-glass', value: 'i-ph-magnifying-glass'},
  {label: 'file-text-thin', value: 'i-ph-file-text-thin'},
  {label: 'tray-light', value: 'i-ph-tray-light'},
  {label: 'list-dashes', value: 'i-ph-list-dashes'},
  {label: 'warning-circle', value: 'i-ph-warning-circle'},
]

const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'orientation', type: 'select', options: orientations, default: 'vertical'},
  {group: 'Aspetto', key: 'size', type: 'select', options: sizes, default: 'md'},
  {group: 'Aspetto', key: 'icon', type: 'select', options: icons},
  {
    group: 'Aspetto', key: 'iconSize', label: 'icon-size', type: 'select',
    options: [{label: 'scala del glifo', value: undefined}, 'sm', 'md', 'lg', 'xl', '40px', '4rem'],
  },

  {group: 'Contenuto', key: 'label', type: 'text', initial: 'Nessun documento', placeholder: 'nessuna'},
  {group: 'Contenuto', key: 'description', type: 'text', initial: 'Scrivi il primo: parti da una pagina bianca.', placeholder: 'nessuna'},
  {group: 'Contenuto', key: 'after', label: 'slot #after', type: 'boolean', prop: false, initial: true},

  {group: 'Stato', key: 'loading', type: 'boolean'},
  {group: 'Stato', key: 'stroke', type: 'select', options: [
    {label: 'auto', value: undefined}, {label: '1', value: 1}, {label: '1.5', value: 1.5}, {label: '2', value: 2}, {label: '3', value: 3},
  ]},
]

const state = useCookie<Record<string, any>>('showcase-empty', {default: () => controlDefaults(controls)})

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

const sizeOf = (s: string) => (({xs: 'xs', sm: 'xs', md: 'sm', lg: 'md', xl: 'lg'}) as Record<string, any>)[s]
const buttonSize = computed(() => sizeOf((current.value.size as string) ?? 'md'))

const states: Record<string, Record<string, unknown>> = {
  'solo label': {description: undefined},
  'label + description': {},
  'loading': {loading: true, description: undefined, label: 'Caricamento…'},
  'errore': {icon: 'i-ph-warning-circle-light', label: 'Non è stato possibile caricare i documenti', description: undefined},
}
</script>

<template>
  <ShowcasePage
      title="Empty"
      description="Lo stato vuoto: un glifo, cosa manca e, con una description, come cominciare. Con loading il glifo diventa uno spinner della stessa misura."
  >
    <ShowcasePlayground v-model="state" tag="SEmpty" :controls="controls">
      <template #default="{props}">
        <SEmpty v-bind="props">
          <template v-if="state.after" #after>
            <SButton label="Nuovo documento" icon="i-ph-plus" variant="outline" color="neutral" :size="buttonSize"/>
          </template>
        </SEmpty>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Size · vertical"
        description="Il glifo ha una scala sua (32–64px), non quella delle icone; il testo segue la golden rule, la description sta un gradino sotto."
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <SEmpty v-bind="without(current, 'size', 'orientation')" orientation="vertical" :size="item as any"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Size · horizontal"
        description="In riga il glifo scende a 16–32px, come un'icona inline più grande."
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <SEmpty v-bind="without(current, 'size', 'orientation')" orientation="horizontal" :size="item as any"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Stati"
        description="Solo label è una riga attenuata; con description la label diventa il titolo. Alla size e orientamento scelti."
    >
      <ShowcaseScale :items="Object.keys(states)">
        <template #item="{item}">
          <SEmpty v-bind="{...current, ...states[item]}"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Slot"
        description="default sostituisce la label, description la riga sotto, after aggiunge un'azione in coda."
    >
      <ShowcaseStage body-class="grid grid-cols-3 items-start gap-8 p-8">
        <SEmpty v-bind="without(current, 'label', 'description')" icon="i-ph-magnifying-glass-light">
          Nessun risultato per <strong>«stem»</strong>
        </SEmpty>
        <SEmpty v-bind="without(current, 'description')" icon="i-ph-folder-open-light">
          <template #description>Trascina qui i file o <a href="#" class="underline underline-offset-2">caricali dal computer</a>.</template>
        </SEmpty>
        <SEmpty v-bind="current">
          <template #after>
            <div class="flex gap-2">
              <SButton label="Nuovo" icon="i-ph-plus" :size="buttonSize"/>
              <SButton label="Importa" variant="ghost" color="neutral" :size="buttonSize"/>
            </div>
          </template>
        </SEmpty>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
