<script setup lang="ts">
import type {ShowcaseControl} from '~/utils/showcase-controls'

const fadeSizes = ['0.75rem', '1.5rem', '3rem']

const surfaces = {
  pagina: '',
  elevata: 'bg-(--ui-bg-elevated)',
  gradiente: 'bg-gradient-to-br from-sky-200 to-violet-300 dark:from-sky-900 dark:to-violet-900',
} as const

const controls: ShowcaseControl[] = [
  {group: 'Sfumatura', key: 'fade', type: 'boolean', default: true},
  {group: 'Sfumatura', key: 'fadeMode', label: 'fade-mode', type: 'select', options: ['color', 'mask'], default: 'color'},
  {group: 'Sfumatura', key: 'fadeSize', label: 'fade-size', type: 'select', options: fadeSizes, default: '1.5rem'},
  {group: 'Sfumatura', key: 'fadeColor', label: 'fade-color', type: 'select', options: [
    {label: 'automatico', value: undefined},
    {label: 'rosso (prova)', value: '#f43f5e'},
    {label: 'var(--ui-bg-muted)', value: 'var(--ui-bg-muted)'},
  ]},

  {group: 'Demo', key: 'rows', label: 'righe', type: 'select', prop: false, default: 20, options: [
    {label: '3 (niente overflow)', value: 3}, {label: '20', value: 20}, {label: '60', value: 60},
  ]},
  {group: 'Demo', key: 'padded', label: 'padding sul contenitore', type: 'boolean', prop: false},
  {group: 'Demo', key: 'surface', label: 'superficie', type: 'select', prop: false, default: 'pagina', options: Object.keys(surfaces)},
]

const state = useCookie<Record<string, any>>('showcase-scroll-area', {default: () => controlDefaults(controls)})

const current = computed(() => {
  const out: Record<string, unknown> = {}
  for (const c of controls) {
    if (c.prop === false) continue
    const v = state.value[c.key]
    if (v !== undefined && v !== '') out[c.key] = v
  }
  return out
})

const surfaceClass = computed(() => surfaces[state.value.surface as keyof typeof surfaces] ?? '')
const codeExtra = computed(() => state.value.padded ? 'class="h-48 p-4"' : 'class="h-48"')

const box = 'h-48 w-72 rounded-lg ring-1 ring-(--ui-border)'
const row = 'rounded-md bg-(--ui-bg-accented)/60 px-3 py-2 text-sm text-(--ui-text-muted)'
</script>

<template>
  <ShowcasePage
      title="ScrollArea"
      wraps="UScrollArea"
      description="UScrollArea con le sfumature in alto e in basso, che compaiono solo quando c'è altro da scorrere da quella parte. Il colore della sfumatura si ricava da solo risalendo gli sfondi; con mask sfuma il contenuto stesso."
  >
    <ShowcasePlayground v-model="state" tag="SScrollArea" :controls="controls" :code-extra="codeExtra">
      <template #default="{props}">
        <div class="rounded-xl p-3" :class="surfaceClass">
          <SScrollArea v-bind="props" :class="[box, state.padded ? 'p-4' : '']">
            <div class="flex flex-col gap-2" :class="!state.padded && 'p-4'">
              <div v-for="i in state.rows" :key="i" :class="row">Riga {{ i }}</div>
            </div>
          </SScrollArea>
        </div>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Fade-size"
        description="Quanto è alta la sfumatura. Scorri un poco per vederla anche in alto."
    >
      <ShowcaseScale :items="fadeSizes">
        <template #item="{item}">
          <SScrollArea v-bind="current" :fade-size="item" :class="box">
            <div class="flex flex-col gap-2 p-4">
              <div v-for="i in 20" :key="i" :class="row">Riga {{ i }}</div>
            </div>
          </SScrollArea>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Color e mask"
        description="color dipinge un gradiente del colore della superficie: serve una superficie di un colore solo. mask sfuma il contenuto verso il trasparente, e dietro si vede quel che c'è: un gradiente, un'immagine, un fondo traslucido."
    >
      <ShowcaseStage body-class="flex flex-wrap items-start justify-center gap-8 p-8">
        <template v-for="(cls, name) in {elevata: surfaces.elevata, gradiente: surfaces.gradiente}" :key="name">
          <div v-for="mode in ['color', 'mask']" :key="`${name}-${mode}`" class="flex flex-col items-center gap-2">
            <div class="rounded-xl p-3" :class="cls">
              <SScrollArea v-bind="current" :fade-mode="mode as any" class="h-48 w-56">
                <div class="flex flex-col gap-2">
                  <div v-for="i in 20" :key="i" :class="row">Riga {{ i }}</div>
                </div>
              </SScrollArea>
            </div>
            <span class="font-mono text-[11px] text-(--ui-text-muted)">{{ mode }} · {{ name }}</span>
          </div>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Colore automatico"
        description="Senza fade-color la sfumatura prende il primo sfondo non trasparente risalendo i genitori: su ogni superficie si fonde senza dirle nulla."
    >
      <ShowcaseStage body-class="flex flex-wrap items-start justify-center gap-6 p-8">
        <div
            v-for="cls in ['', 'bg-(--ui-bg-muted)', 'bg-(--ui-bg-elevated)', 'bg-(--ui-bg-accented)']"
            :key="cls"
            class="flex flex-col items-center gap-2"
        >
          <div class="rounded-xl p-3 ring-1 ring-(--ui-border)" :class="cls">
            <SScrollArea v-bind="current" fade-mode="color" class="h-40 w-44">
              <div class="flex flex-col gap-2">
                <div v-for="i in 15" :key="i" class="rounded-md px-3 py-2 text-sm ring-1 ring-(--ui-border) text-(--ui-text-muted)">Riga {{ i }}</div>
              </div>
            </SScrollArea>
          </div>
          <span class="font-mono text-[11px] text-(--ui-text-muted)">{{ cls ? cls.replace(/^bg-\(--ui-|\)$/g, '') : 'bg' }}</span>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Padding"
        description="Con il padding sul contenitore la sfumatura resta attaccata al bordo e non al contenuto, e non copre la scrollbar."
    >
      <ShowcaseScale :items="['padding sul contenuto', 'padding sul contenitore']">
        <template #item="{item}">
          <SScrollArea v-bind="current" :class="[box, item === 'padding sul contenitore' && 'p-4']">
            <div class="flex flex-col gap-2" :class="item === 'padding sul contenuto' && 'p-4'">
              <div v-for="i in 20" :key="i" :class="row">Riga {{ i }}</div>
            </div>
          </SScrollArea>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Senza overflow e senza fade"
        description="Se il contenuto ci sta, non compare nessuna sfumatura; con :fade=&quot;false&quot; è un UScrollArea qualunque."
    >
      <ShowcaseScale :items="['niente overflow', 'fade false']">
        <template #item="{item}">
          <SScrollArea v-bind="current" :fade="item === 'fade false' ? false : current.fade as boolean" :class="box">
            <div class="flex flex-col gap-2 p-4">
              <div v-for="i in (item === 'niente overflow' ? 3 : 20)" :key="i" :class="row">Riga {{ i }}</div>
            </div>
          </SScrollArea>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>
  </ShowcasePage>
</template>
