<script setup lang="ts">
import type {ShowcaseControl} from '~/utils/showcase-controls'

// SSpinner non ha size a gradini: size è una lunghezza CSS libera.
const pxSizes = ['12px', '16px', '20px', '24px', '32px', '48px', '64px']
const strokes = ['0.5', '1', '1.5', '2', '3', '4']
const textSizes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl']

const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'size', type: 'select', default: undefined, initial: '32px', options: [
    {label: 'ambiente (--s-icon-size, 1em)', value: undefined},
    '12px', '16px', '20px', '24px', '32px', '48px', '64px', '1em', '2rem',
  ]},
  {group: 'Aspetto', key: 'stroke', type: 'select', default: 1, options: [
    {label: '0.5', value: 0.5}, {label: '1', value: 1}, {label: '1.5', value: 1.5},
    {label: '2', value: 2}, {label: '3', value: 3}, {label: '4', value: 4},
  ]},
  {group: 'Aspetto', key: 'grow', type: 'boolean'},

  {group: 'Demo', key: 'tone', label: 'colore del testo', type: 'select', prop: false, default: 'text-(--ui-text)', options: [
    {label: 'testo', value: 'text-(--ui-text)'},
    {label: 'muted', value: 'text-(--ui-text-muted)'},
    {label: 'primary', value: 'text-(--ui-primary)'},
    {label: 'error', value: 'text-(--ui-error)'},
    {label: 'success', value: 'text-(--ui-success)'},
  ]},
]

const state = useShowcaseState<Record<string, any>>('spinner', () => controlDefaults(controls))

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

const tone = computed(() => state.value.tone ?? 'text-(--ui-text)')

// grow si anima solo al mount: la chiave lo rimonta.
const growKey = ref(0)
const loading = ref(false)
</script>

<template>
  <ShowcasePage
      title="Spinner"
      description="Uno spinner SVG in currentColor. Di default è grande quanto l'icona che sostituisce (--s-icon-size, altrimenti 1em); si usa anche fuori dal modulo."
  >
    <ShowcasePlayground v-model="state" tag="SSpinner" :controls="controls">
      <template #default="{props}">
        <span :class="tone" class="inline-flex">
          <SSpinner v-bind="props"/>
        </span>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Size"
        description="Lunghezze fisse in px, allo stroke scelto."
    >
      <ShowcaseScale :items="pxSizes">
        <template #item="{item}">
          <span :class="tone" class="inline-flex">
            <SSpinner v-bind="without(current, 'size', 'grow')" :size="item"/>
          </span>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Segue il testo"
        description="Senza size, fuori da un componente che fissa --s-icon-size, lo spinner è alto 1em."
    >
      <ShowcaseScale :items="textSizes">
        <template #item="{item}">
          <span :class="[item, tone]" class="inline-flex items-center gap-[0.4em]">
            <SSpinner v-bind="without(current, 'size', 'grow')"/>Carico
          </span>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Stroke"
        description="Lo spessore è in unità del viewBox (24): a 48px, stroke 1 vale 2px."
    >
      <ShowcaseScale :items="strokes">
        <template #item="{item}">
          <span :class="tone" class="inline-flex">
            <SSpinner v-bind="without(current, 'stroke', 'grow')" :size="(current.size as string) ?? '48px'" :stroke="Number(item)"/>
          </span>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Grow"
        description="Con grow lo spinner entra allargandosi da zero, così il testo accanto scivola invece di saltare."
    >
      <ShowcaseStage>
        <span :key="growKey" :class="tone" class="inline-flex items-center gap-2 text-sm">
          <SSpinner v-bind="without(current, 'size', 'grow')" grow/>Salvataggio in corso
        </span>
        <SButton label="Rigioca" icon="i-ph-arrow-counter-clockwise" size="sm" variant="ghost" color="neutral" @click="growKey++"/>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Al posto dell'icona"
        description="Nei componenti di Stem lo spinner prende la misura dell'icona: il box non cambia."
    >
      <ShowcaseStage>
        <SButton label="Salva" icon="i-ph-floppy-disk" :loading="loading" @click="loading = !loading"/>
        <SButton label="Salva" icon="i-ph-floppy-disk" variant="soft" loading/>
        <SButton icon="i-ph-arrows-clockwise" square rounded variant="outline" color="neutral" loading/>
        <SEmpty label="Caricamento…" loading size="sm" orientation="horizontal"/>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
