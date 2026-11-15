<script setup lang="ts">
import theme from '#build/ui/button'
import type {ShowcaseControl} from '~/utils/showcase-controls'

const colors = themeKeys(theme, 'color')
const variants = themeKeys(theme, 'variant')
const sizes = themeKeys(theme, 'size')

const icons = [
  {label: 'copy', value: 'i-ph-copy'},
  {label: 'copy-simple', value: 'i-ph-copy-simple'},
  {label: 'clipboard', value: 'i-ph-clipboard-text'},
  {label: 'link', value: 'i-ph-link'},
]

const copiedIcons = [
  {label: 'check', value: 'i-ph-check'},
  {label: 'check-circle', value: 'i-ph-check-circle'},
  {label: 'checks', value: 'i-ph-checks'},
]

const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'variant', type: 'select', options: variants, default: 'soft'},
  {group: 'Aspetto', key: 'color', type: 'select', options: colors, default: 'neutral'},
  {group: 'Aspetto', key: 'size', type: 'select', options: sizes, default: 'md'},

  {group: 'Contenuto', key: 'text', type: 'text', initial: 'npx nuxi module add @fullbrains/stem', placeholder: 'testo da copiare'},
  {group: 'Contenuto', key: 'label', label: 'label (aria)', type: 'text', default: 'Copy', initial: 'Copia'},
  {group: 'Contenuto', key: 'icon', type: 'select', options: icons, default: 'i-ph-copy'},
  {group: 'Contenuto', key: 'copiedIcon', label: 'copied-icon', type: 'select', options: copiedIcons, default: 'i-ph-check'},
  {group: 'Contenuto', key: 'duration', type: 'select', default: 1500, options: [
    {label: '800 ms', value: 800}, {label: '1500 ms', value: 1500}, {label: '3000 ms', value: 3000},
  ]},

  ...scaleControls(),

  {group: 'Stato', key: 'disabled', type: 'boolean'},
]

const state = useShowcaseState<Record<string, any>>('copy-button', () => controlDefaults(controls))

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
  if (!out.text) out.text = 'Copiato da Stem'
  return out
})

const shapes: Record<string, Record<string, unknown>> = {
  ...scaleShapes,
  'solo icona': {label: undefined},
  'square': {label: undefined, square: true},
  'square rounded': {label: undefined, square: true, rounded: true},
}

const lastCopied = ref<string>()
const lastError = ref<string>()

function onCopied(text: string) {
  lastCopied.value = text
  lastError.value = undefined
}

function onError(e: unknown) {
  lastError.value = e instanceof Error ? e.message : String(e)
}

const fetchSecret = () => new Promise<string>(r => setTimeout(() => r('sk_test_4f9a…c21e'), 600))
const nothing = () => null
const failing = () => Promise.reject(new Error('Permesso negato'))

const snippets = [
  'pnpm add @fullbrains/stem',
  'npx nuxi module add @fullbrains/stem',
]
</script>

<template>
  <ShowcasePage
      title="CopyButton"
      wraps="UButton"
      description="Copia un testo negli appunti e mostra un check al posto dell'icona finché la copia è fresca. Sotto c'è un SButton: color, variant, size e le forme passano dritte."
  >
    <ShowcasePlayground v-model="state" tag="SCopyButton" :controls="controls">
      <template #default="{props}">
        <SCopyButton v-bind="props as any" :text="(props.text as string) || 'Copiato da Stem'" @copied="onCopied" @error="onError"/>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Variant × color"
        description="Tutte le combinazioni, alla size e con le forme scelte sopra. Il default è neutral soft."
    >
      <ShowcaseMatrix :rows="variants" :cols="colors">
        <template #cell="{row, col}">
          <SCopyButton v-bind="without(current, 'variant', 'color') as any" :variant="row as any" :color="col as any"/>
        </template>
      </ShowcaseMatrix>
    </ShowcaseSection>

    <ShowcaseSection
        title="Size"
        description="Altezza × larghezza, padding, testo e icona in px. Solo icona: la size è quella di SButton."
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <SCopyButton v-bind="without(current, 'size') as any" :size="item as any"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Forme"
        description="Le forme di SButton, che passano senza modifiche."
    >
      <ShowcaseScale :items="Object.keys(shapes)">
        <template #item="{item}">
          <SCopyButton v-bind="{...without(current, 'space', 'spaceX', 'spaceY', 'roundness', 'rounded'), ...shapes[item]} as any"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Testo calcolato al click"
        description="text può essere una funzione, chiamata al click: per un valore letto solo quando serve. Se restituisce null non copia nulla; un errore esce come evento error e l'icona resta com'è."
    >
      <ShowcaseStage>
        <div class="flex items-center gap-2 text-sm">
          <SCopyButton :text="fetchSecret" label="Copia la chiave" @copied="onCopied" @error="onError"/>
          <span class="text-(--ui-text-muted)">asincrono, 600 ms</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <SCopyButton :text="nothing" label="Non copia nulla" @copied="onCopied" @error="onError"/>
          <span class="text-(--ui-text-muted)">restituisce null</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <SCopyButton :text="failing" label="Fallisce" @copied="onCopied" @error="onError"/>
          <span class="text-(--ui-text-muted)">rifiuta</span>
        </div>
      </ShowcaseStage>
      <p class="font-mono text-[11px] text-gray-500">
        <template v-if="lastError">error: {{ lastError }}</template>
        <template v-else-if="lastCopied">copied: {{ lastCopied }}</template>
        <template v-else>Nessun evento ancora.</template>
      </p>
    </ShowcaseSection>

    <ShowcaseSection
        title="Accanto a un valore"
        description="L'uso tipico: un comando o un identificativo con il pulsante al fianco, ghost, square e rounded per non pesare sulla riga."
    >
      <ShowcaseStage body-class="flex flex-col gap-2 p-8">
        <div
            v-for="s in snippets"
            :key="s"
            class="flex items-center gap-2 rounded-lg bg-(--ui-bg-elevated) py-1 pr-1 pl-3"
        >
          <code class="flex-1 truncate font-mono text-xs">{{ s }}</code>
          <SCopyButton :text="s" label="Copia il comando" variant="ghost" size="sm" square rounded/>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
