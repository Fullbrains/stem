<script setup lang="ts">
import type {ShowcaseControl} from '~/utils/showcase-controls'

// La scala di Stem: SCloseButton → SModalButton → SButton.
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']

const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'size', type: 'select', options: sizes, default: 'sm'},
  {group: 'Contenuto', key: 'label', label: 'label (aria)', type: 'text', placeholder: 'modal.close del locale'},
  {group: 'Stato', key: 'disabled', type: 'boolean'},
  ...scaleControls(),
]

const state = useShowcaseState<Record<string, any>>('close-button', () => controlDefaults(controls))

const current = computed(() => {
  const out: Record<string, unknown> = {}
  for (const c of controls) {
    const v = state.value[c.key]
    if (v !== undefined && v !== '') out[c.key] = v
  }
  return out
})

const surfaces = [
  {size: 'sm', title: 'Modifica progetto', where: 'Header di un modal', box: 'w-96 rounded-2xl px-5 py-4', text: 'text-lg'},
  {size: 'xs', title: 'Filtri', where: 'Popover', box: 'w-72 rounded-xl px-3 py-2.5', text: 'text-sm'},
  {size: 'xs', space: '2xs', title: 'Suggerimento', where: 'Card accanto a un link', box: 'w-60 rounded-lg px-2.5 py-2', text: 'text-xs'},
] as const

</script>

<template>
  <ShowcasePage
      title="CloseButton"
      wraps="UButton"
      description="Il pulsante di chiusura delle superfici di Stem: la pillola soft con la X dell'header di SModal. Solo icona: label è il nome accessibile, e senza diventa la parola di Nuxt UI per «chiudi» nel locale dell'app."
  >
    <ShowcasePlayground v-model="state" tag="SCloseButton" :controls="controls" code-extra='@click="close"'>
      <template #default="{props}">
        <SCloseButton v-bind="props"/>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Size"
        description="md per l'header di un modal (32px), sm per un popover (24px), xs per una card (20px). L'icona è fissa sulla scala, non segue il testo."
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <SCloseButton v-bind="current" :size="item as any"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Con gli altri pulsanti dell'header"
        description="È un SModalButton con la X: le azioni accanto (con o senza etichetta) hanno lo stesso fondo, la stessa altezza e la stessa icona, e la riga si legge come una cosa sola."
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <div class="flex items-center gap-1.5">
            <SModalButton :size="item as any" icon="i-ph-trash" label="Rimuovi"/>
            <SModalButton :size="item as any" icon="i-ph-arrow-square-out" aria-label="Apri a parte"/>
            <SCloseButton :size="item as any"/>
          </div>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Sulle superfici"
        description="Il posizionamento è di chi lo usa: qui in alto a destra, allineato al titolo, alla size adatta a ogni superficie."
    >
      <ShowcaseStage body-class="flex flex-wrap items-start justify-center gap-6 p-8">
        <div v-for="s in surfaces" :key="s.size" class="flex flex-col items-center gap-2">
          <div
              class="flex items-center justify-between gap-3 bg-(--ui-bg) shadow-sm ring-1 ring-(--ui-border)"
              :class="s.box"
          >
            <span class="font-medium" :class="s.text">{{ s.title }}</span>
            <SCloseButton :size="s.size" :space="s.space"/>
          </div>
          <span class="font-mono text-[11px] text-(--ui-text-muted)">{{ s.where }} · {{ s.size }}{{ s.space ? ` space ${s.space}` : '' }}</span>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Stato"
        description="Disabilitato resta al suo posto, più chiaro e senza click."
    >
      <ShowcaseScale :items="['attivo', 'disabled']">
        <template #item="{item}">
          <SCloseButton v-bind="current" :disabled="item === 'disabled'"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>
  </ShowcasePage>
</template>
