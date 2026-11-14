<script setup lang="ts">
import theme from '#build/ui/button'
import type {ShowcaseControl} from '~/utils/showcase-controls'

const colors = themeKeys(theme, 'color')
const variants = themeKeys(theme, 'variant')
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']

const icons = [
  {label: 'nessuna', value: undefined},
  'i-ph-arrow-square-out',
  'i-ph-trash',
  'i-ph-download-simple',
  'i-ph-x',
]

const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'size', type: 'select', options: sizes, default: 'sm'},
  {group: 'Aspetto', key: 'variant', type: 'select', options: variants, default: 'soft'},
  {group: 'Aspetto', key: 'color', type: 'select', options: colors, default: 'primary'},

  {group: 'Contenuto', key: 'icon', type: 'select', options: icons, initial: 'i-ph-arrow-square-out'},
  {group: 'Contenuto', key: 'label', type: 'text', placeholder: 'nessuna'},
  {group: 'Contenuto', key: 'ariaLabel', label: 'aria-label', type: 'text', initial: 'Apri a parte'},

  // rounded è il default di SModalButton: true finché non lo si spegne.
  ...scaleControls().map(c => c.key === 'rounded' ? {...c, default: true} : c),

  {group: 'Stato', key: 'loading', type: 'boolean'},
  {group: 'Stato', key: 'disabled', type: 'boolean'},
]

const state = useShowcaseState<Record<string, any>>('modal-button', () => controlDefaults(controls))

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

// Il default e i modi di forzarlo, alla size scelta.
const spacing: Record<string, Record<string, unknown>> = {
  'default': {},
  'space sm': {space: 'sm'},
  'space-x lg': {spaceX: 'lg'},
  'space-y md': {spaceY: 'md'},
}
</script>

<template>
  <ShowcasePage
      title="ModalButton"
      wraps="SButton"
      description="Il pulsante dell'header di una modale: un SButton soft e rounded, nient'altro di suo. Di default è sm, con space-x un passo sopra la size e space-y uno sotto; space, space-x e space-y passati a mano vincono. SCloseButton è questo, con la X."
  >
    <ShowcasePlayground v-model="state" tag="SModalButton" :controls="controls">
      <template #default="{props}">
        <SModalButton v-bind="props"/>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Size"
        description="Solo icona, con label e la chiusura, a ogni size: space-x un passo sopra, space-y uno sotto."
    >
      <ShowcaseStage body-class="space-y-5 p-8">
        <div v-for="s in sizes" :key="s" class="flex items-start gap-6">
          <span class="w-8 pt-1 font-mono text-[11px] text-(--ui-text-muted)">{{ s }}</span>
          <ShowcaseMeasure labels>
            <SModalButton :size="s as any" icon="i-ph-arrow-square-out" aria-label="Apri a parte"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <SModalButton :size="s as any" icon="i-ph-trash" label="Rimuovi"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <SCloseButton :size="s as any"/>
          </ShowcaseMeasure>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Default e forzato"
        description="Il default (x su, y giù) e ciò che succede passando space, space-x o space-y, alla size scelta sopra."
    >
      <ShowcaseScale :items="Object.keys(spacing)">
        <template #item="{item}">
          <SModalButton v-bind="{...without(current, 'space', 'spaceX', 'spaceY'), ...spacing[item]}"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Nell'header"
        description="Le azioni accanto alla chiusura: stessa pillola, stessa altezza."
    >
      <ShowcaseStage>
        <div class="flex w-96 items-center gap-2 rounded-2xl bg-(--ui-bg-elevated) px-5 py-4">
          <span class="flex-1 text-lg font-semibold text-(--ui-text-highlighted)">Documento.pdf</span>
          <SModalButton icon="i-ph-download-simple" label="Scarica"/>
          <SModalButton icon="i-ph-arrow-square-out" aria-label="Apri a parte"/>
          <SCloseButton/>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
