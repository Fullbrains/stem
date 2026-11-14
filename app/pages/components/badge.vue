<script setup lang="ts">
import theme from '#build/ui/badge'
import avatarTheme from '#build/ui/avatar'
import type {ShowcaseControl} from '~/utils/showcase-controls'

const colors = themeKeys(theme, 'color')
const variants = themeKeys(theme, 'variant')
const sizes = themeKeys(theme, 'size')
const avatarSizes = themeKeys(avatarTheme, 'size')
const avatarColors = themeKeys(avatarTheme, 'color')

const icons = [
  {label: 'nessuna', value: undefined},
  {label: 'tag', value: 'i-ph-tag'},
  {label: 'check', value: 'i-ph-check'},
  {label: 'star', value: 'i-ph-star'},
  {label: 'circle', value: 'i-ph-circle-fill'},
  {label: 'x', value: 'i-ph-x'},
  {label: 'caret-down', value: 'i-ph-caret-down'},
]

const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'variant', type: 'select', options: variants, default: 'solid'},
  {group: 'Aspetto', key: 'color', type: 'select', options: colors, default: 'primary'},
  {group: 'Aspetto', key: 'size', type: 'select', options: sizes, default: 'md'},

  {group: 'Contenuto', key: 'label', type: 'text', initial: 'Bozza', placeholder: 'nessuna'},
  {group: 'Contenuto', key: 'icon', type: 'select', options: icons},
  {group: 'Contenuto', key: 'trailingIcon', label: 'trailing-icon', type: 'select', options: icons},
  {group: 'Contenuto', key: 'avatar', type: 'boolean', prop: false},
  {
    group: 'Contenuto', key: 'iconSize', label: 'icon-size', type: 'select',
    options: [{label: 'segue il testo', value: undefined}, 'sm', 'md', 'lg', 'xl', '1.25em'],
  },

  {group: 'Forma', key: 'compact', type: 'select', default: false, options: [
    {label: 'no', value: false}, {label: 'sì', value: true}, 'x', 'y',
  ]},
  {group: 'Forma', key: 'square', type: 'boolean'},
]

const state = useCookie<Record<string, any>>('showcase-badge', {default: () => controlDefaults(controls)})

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

const avatar = computed(() => (state.value.avatar ? {src: 'https://i.pravatar.cc/64?img=5', alt: 'Anna'} : undefined))
const codeExtra = computed(() => (state.value.avatar ? ':avatar="{src: \'…\'}"' : ''))

const shapes: Record<string, Record<string, unknown>> = {
  'normale': {},
  'compact': {compact: true},
  'compact x': {compact: 'x'},
  'compact y': {compact: 'y'},
  'square': {square: true},
  'square compact': {square: true, compact: true},
}

const iconSizes = ['segue il testo', 'sm', 'md', 'lg', 'xl']

const people = [
  {src: 'https://i.pravatar.cc/96?img=5', alt: 'Anna Rossi'},
  {alt: 'Marco Bianchi'},
  {icon: 'i-ph-user'},
]
</script>

<template>
  <ShowcasePage
      title="Badge"
      wraps="UBadge"
      description="Etichetta breve, a pillola. Stem aggiunge il compact, che stringe il padding su uno o entrambi gli assi, e icon-size."
  >
    <ShowcasePlayground v-model="state" tag="SBadge" :controls="controls" :code-extra="codeExtra">
      <template #default="{props}">
        <SBadge v-bind="props" :avatar="avatar"/>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Variant × color"
        description="Tutte le combinazioni, alla size e con le opzioni scelte sopra."
    >
      <ShowcaseMatrix :rows="variants" :cols="colors">
        <template #cell="{row, col}">
          <SBadge v-bind="without(current, 'variant', 'color')" :variant="row as any" :color="col as any" :label="current.label ? col : undefined"/>
        </template>
      </ShowcaseMatrix>
    </ShowcaseSection>

    <ShowcaseSection
        title="Size"
        description="Altezza × larghezza, padding verticale/orizzontale, testo e icona in px."
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <SBadge v-bind="without(current, 'size')" :size="item as any"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Forme"
        description="Il compact di Stem e lo square di Nuxt UI, alla size scelta."
    >
      <ShowcaseScale :items="Object.keys(shapes)">
        <template #item="{item}">
          <SBadge v-bind="{...without(current, 'compact', 'square'), ...shapes[item]}"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Icona"
        description="Di default l'icona è alta 1em e segue il testo; icon-size la fissa su un gradino della scala."
    >
      <ShowcaseScale :items="iconSizes">
        <template #item="{item}">
          <SBadge v-bind="without(current, 'iconSize')" :icon="(current.icon as string) ?? 'i-ph-tag'" :icon-size="item === 'segue il testo' ? undefined : item"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Slot"
        description="leading, default e trailing: qui un pallino di stato, un conteggio e un'azione."
    >
      <ShowcaseStage>
        <SBadge v-bind="without(current, 'label', 'icon')">
          <template #leading><span class="size-[0.5em] rounded-full bg-emerald-500"/></template>
          Online
        </SBadge>
        <SBadge v-bind="without(current, 'label', 'trailingIcon')">
          Commenti
          <template #trailing><span class="font-medium tabular-nums">12</span></template>
        </SBadge>
        <SBadge v-bind="without(current, 'label', 'trailingIcon')">
          Filtro attivo
          <template #trailing><UIcon name="i-ph-x" class="size-(--s-icon-size) shrink-0 cursor-pointer opacity-70 hover:opacity-100"/></template>
        </SBadge>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Avatar"
        description="UAvatar non è un componente di Stem, ma il tema gli cambia lo sfondo del fallback (iron-500/10)."
    >
      <ShowcaseScale :items="avatarSizes">
        <template #item="{item}">
          <UAvatar :size="item as any" alt="Anna Rossi"/>
        </template>
      </ShowcaseScale>
      <ShowcaseStage>
        <UAvatar v-for="(p, i) in people" :key="i" v-bind="p" size="lg"/>
        <UAvatar v-for="c in avatarColors" :key="c" :color="c as any" :alt="c" size="lg"/>
        <UAvatar alt="Anna Rossi" size="lg" chip/>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
