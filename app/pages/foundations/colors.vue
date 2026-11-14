<script setup lang="ts">
const appConfig = useAppConfig()

const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']

// Le palette di Stem (cambiano in scuro) e le Tailwind che i temi usano direttamente.
const palettes = [
  {name: 'stem', note: 'primary · chiaro: tar, scuro: zinc'},
  {name: 'iron', note: 'secondary e superfici · chiaro: slate, scuro: zinc'},
  {name: 'muto', note: 'neutral, testo · chiaro: gray, scuro: zinc'},
  {name: 'gray', note: 'Tailwind · primary in chiaro (solid, testo, anelli)'},
]

const semantic = computed(() => Object.entries(appConfig.ui.colors as Record<string, string>))

const uiTokens = [
  {group: 'Testo', items: ['text-dimmed', 'text-muted', 'text-toned', 'text', 'text-highlighted', 'text-inverted']},
  {group: 'Sfondi', items: ['bg', 'bg-muted', 'bg-elevated', 'bg-accented', 'bg-inverted']},
  {group: 'Bordi', items: ['border', 'border-muted', 'border-accented', 'border-inverted']},
]
</script>

<template>
  <ShowcasePage
      title="Colori"
      description="Le palette, i colori semantici e le variabili di Nuxt UI, risolti in chiaro e in scuro. Sotto ogni campione: hex e contrasto WCAG con lo sfondo del pannello."
  >
    <ShowcaseSection title="Colori semantici" description="Come app.config li mappa sulle palette: il gradino 500 e i suoi vicini.">
      <ShowcaseStage body-class="space-y-4 p-6">
        <div v-for="[role, palette] in semantic" :key="role" class="grid grid-cols-[8rem_repeat(11,minmax(0,1fr))] items-start gap-2">
          <div class="pt-3 text-[12px]">
            <div class="font-medium text-(--ui-text-highlighted)">{{ role }}</div>
            <div class="font-mono text-[10px] text-(--ui-text-muted)">{{ palette }}</div>
          </div>
          <ShowcaseSwatch v-for="s in steps" :key="s" :color="`var(--ui-color-${role}-${s})`" :label="s"/>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection title="Palette" description="Le tre palette di Stem cambiano gradini fra chiaro e scuro; gray è Tailwind puro.">
      <ShowcaseStage body-class="space-y-4 p-6">
        <div v-for="p in palettes" :key="p.name" class="grid grid-cols-[8rem_repeat(11,minmax(0,1fr))] items-start gap-2">
          <div class="pt-3 text-[12px]">
            <div class="font-medium text-(--ui-text-highlighted)">{{ p.name }}</div>
            <div class="text-[10px] leading-snug text-(--ui-text-muted)">{{ p.note }}</div>
          </div>
          <ShowcaseSwatch v-for="s in steps" :key="s" :color="`var(--color-${p.name}-${s})`" :label="s"/>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection title="Variabili di Nuxt UI" description="Testo, sfondi e bordi: --ui-*, quelle che usano i componenti non temizzati da Stem.">
      <ShowcaseStage direction="row" body-class="space-y-5 p-6">
        <div v-for="g in uiTokens" :key="g.group">
          <p class="mb-2 text-[11px] font-medium text-(--ui-text-muted)">{{ g.group }}</p>
          <div class="grid grid-cols-6 gap-2">
            <ShowcaseSwatch v-for="t in g.items" :key="t" :color="`var(--ui-${t})`" :label="t"/>
          </div>
        </div>
        <div>
          <p class="mb-2 text-[11px] font-medium text-(--ui-text-muted)">Testo sullo sfondo</p>
          <div class="space-y-1 text-[14px]">
            <p class="text-(--ui-text-highlighted)">highlighted — titoli e valori</p>
            <p class="text-(--ui-text)">text — il testo di base</p>
            <p class="text-(--ui-text-toned)">toned — testo secondario</p>
            <p class="text-(--ui-text-muted)">muted — descrizioni</p>
            <p class="text-(--ui-text-dimmed)">dimmed — segnaposto e note</p>
          </div>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
