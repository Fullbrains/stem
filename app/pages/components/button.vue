<script setup lang="ts">
import theme from '#build/ui/button'
import type {ShowcaseControl} from '~/utils/showcase-controls'

const colors = themeKeys(theme, 'color')
const variants = themeKeys(theme, 'variant')
const sizes = themeKeys(theme, 'size')

const icons = [
  {label: 'nessuna', value: undefined},
  {label: 'plus', value: 'i-ph-plus'},
  {label: 'floppy-disk', value: 'i-ph-floppy-disk'},
  {label: 'arrow-right', value: 'i-ph-arrow-right'},
  {label: 'trash', value: 'i-ph-trash'},
  {label: 'gear', value: 'i-ph-gear'},
  {label: 'magnifying-glass', value: 'i-ph-magnifying-glass'},
  {label: 'dots-three', value: 'i-ph-dots-three'},
]

const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'variant', type: 'select', options: variants, default: 'solid'},
  {group: 'Aspetto', key: 'color', type: 'select', options: colors, default: 'primary'},
  {group: 'Aspetto', key: 'size', type: 'select', options: sizes, default: 'md'},

  {group: 'Contenuto', key: 'label', type: 'text', initial: 'Salva', placeholder: 'nessuna'},
  {group: 'Contenuto', key: 'icon', type: 'select', options: icons, initial: 'i-ph-floppy-disk'},
  {group: 'Contenuto', key: 'trailingIcon', label: 'trailing-icon', type: 'select', options: icons},

  {group: 'Forma', key: 'disc', type: 'boolean'},
  {group: 'Forma', key: 'caret', type: 'boolean'},
  {group: 'Forma', key: 'block', type: 'boolean'},

  ...scaleControls(),

  {group: 'Stato', key: 'loading', type: 'boolean'},
  {group: 'Stato', key: 'disabled', type: 'boolean'},
  {group: 'Stato', key: 'active', type: 'boolean'},
  {group: 'Stato', key: 'destructive', type: 'boolean'},
]

const state = useCookie<Record<string, any>>('showcase-button', {default: () => controlDefaults(controls)})

// Per matrice e scale: le opzioni scelte, meno l'asse che la vista fa variare.
function without(p: Record<string, unknown>, ...keys: string[]) {
  const out = {...p}
  for (const k of keys) delete out[k]
  return out
}

const current = computed(() => {
  const out: Record<string, unknown> = {}
  for (const c of controls) {
    const v = state.value[c.key]
    if (v !== undefined && v !== '') out[c.key] = v
  }
  return out
})

const shapes: Record<string, Record<string, unknown>> = {
  ...scaleShapes,
  'caret': {caret: true},
  'disc': {disc: true},
}

// Lo stesso pulsante con e senza label o icona: l'altezza non deve cambiare.
const contents: Record<string, Record<string, unknown>> = {
  'solo label': {label: 'Salva'},
  'solo icona': {icon: 'i-ph-floppy-disk'},
  'icona e label': {icon: 'i-ph-floppy-disk', label: 'Salva'},
  'label e caret': {label: 'Salva', caret: true},
  'disc': {icon: 'i-ph-floppy-disk', disc: true},
}

const iconSizes = ['da size', 'xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <ShowcasePage
      title="Button"
      wraps="UButton"
      description="Il pulsante di Stem, sulla scala unica: size decide testo, icona, padding, gap e raggio; text-size, icon-size, space e roundness ne spostano uno. Aggiunge spinner, conferma, caret, disc e pillola."
  >
    <ShowcasePlayground v-model="state" tag="SButton" :controls="controls">
      <template #default="{props}">
        <SButton v-bind="props"/>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Variant × color"
        description="Tutte le combinazioni, alla size e con le opzioni scelte sopra."
    >
      <ShowcaseMatrix :rows="variants" :cols="colors">
        <template #cell="{row, col}">
          <SButton v-bind="without(current, 'variant', 'color', 'destructive')" :variant="row as any" :color="col as any" :label="current.label ? col : undefined"/>
        </template>
      </ShowcaseMatrix>
    </ShowcaseSection>

    <ShowcaseSection
        title="Ispezione"
        description="Box del pulsante (magenta), dell'icona (lime) e della label (cyan). Solo label, solo icona, entrambe, caret, disc: a parità di size, stessa altezza."
    >
      <ShowcaseStage body-class="space-y-5 p-8">
        <div v-for="s in sizes" :key="s" class="flex items-start gap-6">
          <span class="w-8 pt-2 font-mono text-[11px] text-(--ui-text-muted)">{{ s }}</span>
          <ShowcaseMeasure v-for="(c, name) in contents" :key="name" labels>
            <SButton v-bind="{...without(current, 'size', 'label', 'icon', 'trailingIcon', 'disc', 'caret'), ...c}" :size="s as any" class="b [&_.iconify]:b1 [&_[data-slot=label]]:b2"/>
          </ShowcaseMeasure>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Size"
        description="Altezza × larghezza, padding verticale/orizzontale, testo e icona in px."
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <SButton v-bind="without(current, 'size')" :size="item as any"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Spazio e forma"
        description="space, space-x, space-y, roundness e pillola, alla size scelta."
    >
      <ShowcaseScale :items="Object.keys(shapes)">
        <template #item="{item}">
          <SButton v-bind="{...without(current, 'space', 'spaceX', 'spaceY', 'roundness', 'rounded', 'disc', 'caret'), ...shapes[item]}"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Icona"
        description="L'icona è alta quanto il leading della size; icon-size la sposta su un altro gradino."
    >
      <ShowcaseScale :items="iconSizes">
        <template #item="{item}">
          <SButton v-bind="without(current, 'iconSize')" :icon="current.icon ?? 'i-ph-floppy-disk'" :icon-size="item === 'da size' ? undefined : item"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Conferma"
        description="Con on-confirm il click apre il dialog di conferma; confirm-match chiede di digitare un testo prima di procedere."
    >
      <ShowcaseStage>
        <SButton label="Archivia" icon="i-ph-archive" variant="soft" confirm-title="Archiviare il progetto?" confirm-message="Potrai ripristinarlo dall'archivio." :on-confirm="() => {}"/>
        <SButton label="Elimina" icon="i-ph-trash" destructive confirm-title="Eliminare il progetto?" confirm-message="L'operazione non si può annullare." :on-confirm="() => new Promise(r => setTimeout(r, 1200))"/>
        <SButton label="Elimina con match" icon="i-ph-trash" destructive variant="soft" confirm-title="Eliminare stem?" confirm-match="stem" :on-confirm="() => {}"/>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
