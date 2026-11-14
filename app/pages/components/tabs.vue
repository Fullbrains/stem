<script setup lang="ts">
import theme from '#build/ui/tabs'
import type {TabsItem} from '@nuxt/ui'
import type {ShowcaseControl} from '~/utils/showcase-controls'

const colors = themeKeys(theme, 'color')
const variants = themeKeys(theme, 'variant')
const sizes = themeKeys(theme, 'size')
const orientations = themeKeys(theme, 'orientation')

const itemSets: Record<string, TabsItem[]> = {
  label: [
    {label: 'Panoramica', value: 'overview', content: 'Lo stato del progetto a colpo d\'occhio.'},
    {label: 'Attività', value: 'activity', content: 'Le ultime modifiche, in ordine.'},
    {label: 'Impostazioni', value: 'settings', content: 'Nome, membri e permessi.'},
  ],
  icone: [
    {label: 'Panoramica', icon: 'i-ph-house', value: 'overview', content: 'Lo stato del progetto a colpo d\'occhio.'},
    {label: 'Attività', icon: 'i-ph-pulse', value: 'activity', content: 'Le ultime modifiche, in ordine.'},
    {label: 'Impostazioni', icon: 'i-ph-gear', value: 'settings', content: 'Nome, membri e permessi.'},
  ],
  badge: [
    {label: 'Aperti', icon: 'i-ph-circle', badge: 12, value: 'open', content: 'Dodici elementi aperti.'},
    {label: 'In revisione', icon: 'i-ph-eye', badge: 3, value: 'review', content: 'Tre in revisione.'},
    {label: 'Chiusi', icon: 'i-ph-check-circle', value: 'closed', content: 'Nessun elemento chiuso di recente.'},
  ],
  disabilitato: [
    {label: 'Panoramica', icon: 'i-ph-house', value: 'overview', content: 'Lo stato del progetto a colpo d\'occhio.'},
    {label: 'Fatture', icon: 'i-ph-receipt', value: 'billing', disabled: true},
    {label: 'Impostazioni', icon: 'i-ph-gear', value: 'settings', content: 'Nome, membri e permessi.'},
  ],
  'solo icone': [
    {icon: 'i-ph-list', value: 'list', content: 'Vista a elenco.', 'aria-label': 'Elenco'},
    {icon: 'i-ph-squares-four', value: 'grid', content: 'Vista a griglia.', 'aria-label': 'Griglia'},
    {icon: 'i-ph-kanban', value: 'board', content: 'Vista a colonne.', 'aria-label': 'Colonne'},
  ],
}

const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'variant', type: 'select', options: variants, default: 'pill'},
  {group: 'Aspetto', key: 'color', type: 'select', options: colors, default: 'primary'},
  {group: 'Aspetto', key: 'size', type: 'select', options: sizes, default: 'md'},
  {group: 'Aspetto', key: 'orientation', type: 'select', options: orientations, default: 'horizontal'},

  {group: 'Contenuto', key: 'items', label: 'voci', type: 'select', options: Object.keys(itemSets), initial: 'icone', prop: false},
  {group: 'Contenuto', key: 'content', label: 'content (pannelli)', type: 'boolean', default: true, initial: false},

  {group: 'Comportamento', key: 'activationMode', label: 'activation-mode', type: 'select', options: ['automatic', 'manual'], default: 'automatic'},
  {group: 'Comportamento', key: 'unmountOnHide', label: 'unmount-on-hide', type: 'boolean', default: true},
  ...scaleControls(),
]

const state = useShowcaseState<Record<string, any>>('tabs', () => controlDefaults(controls))

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

const items = computed(() => itemSets[state.value.items as string] ?? itemSets.icone!)
</script>

<template>
  <ShowcasePage
      title="Tabs"
      wraps="STabs"
      description="UTabs con il tema di Stem: pill e link col cursore a mano, la pillola tutta tonda, il primary in grigio scuro e la size che segue la regola d'oro, con l'icona alta quanto il testo."
  >
    <ShowcasePlayground v-model="state" tag="STabs" :controls="controls" code-extra=':items="items"'>
      <template #default="{props}">
        <STabs v-bind="props" :items="items" class="min-w-80" :class="props.orientation === 'vertical' && 'w-96'"/>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Color × variant"
        description="Tutte le combinazioni, alla size e con le voci scelte sopra. Stem ridisegna il primary; gli altri colori restano quelli di Nuxt UI."
    >
      <ShowcaseMatrix :rows="colors" :cols="variants">
        <template #cell="{row, col}">
          <STabs v-bind="without(current, 'variant', 'color', 'orientation')" :items="items" :content="false" :color="row as any" :variant="col as any"/>
        </template>
      </ShowcaseMatrix>
    </ShowcaseSection>

    <ShowcaseSection
        title="Size"
        description="Altezza × larghezza dell'intera barra, padding del contenitore, testo e icona in px."
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <STabs v-bind="without(current, 'size', 'orientation')" :items="items" :content="false" :size="item as any"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Orientamento"
        description="Verticale le voci si impilano e l'indicatore scorre in altezza."
    >
      <ShowcaseScale :items="orientations">
        <template #item="{item}">
          <STabs v-bind="without(current, 'orientation')" :items="items" :content="false" :orientation="item as any"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Voci"
        description="Le forme che può avere una voce: solo testo, con icona, con badge, disabilitata, solo icona."
    >
      <ShowcaseStage body-class="flex flex-col items-center gap-5 p-8">
        <div v-for="(set, name) in itemSets" :key="name" class="flex flex-col items-center gap-1.5">
          <STabs v-bind="without(current, 'orientation')" :items="set" :content="false"/>
          <span class="font-mono text-[11px] text-(--ui-text-muted)">{{ name }}</span>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Con i pannelli"
        description="Con content ogni voce mostra il suo pannello sotto la barra; activation-mode manual cambia pannello solo con Invio o click, non con le frecce."
    >
      <ShowcaseStage body-class="flex flex-wrap items-start justify-center gap-8 p-8">
        <div v-for="mode in ['automatic', 'manual']" :key="mode" class="flex w-80 flex-col gap-1.5">
          <STabs v-bind="without(current, 'orientation', 'content', 'activationMode')" :items="itemSets.icone" :activation-mode="mode as any" :ui="{content: 'text-sm text-(--ui-text-muted) pt-2'}"/>
          <span class="font-mono text-[11px] text-(--ui-text-muted)">{{ mode }}</span>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
