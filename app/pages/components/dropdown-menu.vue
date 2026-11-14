<script setup lang="ts">
import theme from '#build/ui/dropdown-menu'
import type {DropdownMenuItem} from '@nuxt/ui'
import type {ShowcaseControl} from '~/utils/showcase-controls'

const sizes = themeKeys(theme, 'size')
const colors = themeKeys(theme, 'color')

const notifications = ref(true)
const compactView = ref(false)

const itemSets: Record<string, DropdownMenuItem[] | DropdownMenuItem[][]> = {
  'base': [
    {label: 'Profilo', icon: 'i-ph-user'},
    {label: 'Impostazioni', icon: 'i-ph-gear', disabled: true},
    {type: 'separator'},
    {label: 'Esci', icon: 'i-ph-sign-out', color: 'error'},
  ],
  'gruppi e label': [
    [
      {type: 'label', label: 'Mario Rossi', avatar: {text: 'MR'}},
    ],
    [
      {label: 'Profilo', icon: 'i-ph-user', kbds: ['meta', 'p']},
      {label: 'Fatturazione', icon: 'i-ph-credit-card', kbds: ['meta', 'b']},
      {label: 'Impostazioni', icon: 'i-ph-gear', kbds: ['meta', ',']},
    ],
    [
      {label: 'Esci', icon: 'i-ph-sign-out', color: 'error', kbds: ['shift', 'meta', 'q']},
    ],
  ],
  'descrizioni': [
    {label: 'Duplica', icon: 'i-ph-copy', description: 'Crea una copia nello stesso progetto'},
    {label: 'Sposta', icon: 'i-ph-arrow-square-right', description: 'Portalo in un altro progetto'},
    {label: 'Archivia', icon: 'i-ph-archive', description: 'Lo ritrovi nell\'archivio'},
  ],
  'checkbox': [
    {type: 'label', label: 'Vista'},
    {
      type: 'checkbox', label: 'Notifiche', icon: 'i-ph-bell',
      get checked() { return notifications.value },
      onUpdateChecked: (v: boolean) => (notifications.value = v),
      onSelect: (e: Event) => e.preventDefault(),
    },
    {
      type: 'checkbox', label: 'Vista compatta', icon: 'i-ph-rows',
      get checked() { return compactView.value },
      onUpdateChecked: (v: boolean) => (compactView.value = v),
      onSelect: (e: Event) => e.preventDefault(),
    },
  ],
  'sottomenu': [
    {label: 'Nuovo', icon: 'i-ph-plus', children: [
      {label: 'Documento', icon: 'i-ph-file-text'},
      {label: 'Cartella', icon: 'i-ph-folder'},
      {label: 'Da modello', icon: 'i-ph-squares-four', children: [
        {label: 'Riunione'},
        {label: 'Progetto'},
      ]},
    ]},
    {label: 'Condividi', icon: 'i-ph-share-network', children: [
      {label: 'Copia link', icon: 'i-ph-link'},
      {label: 'Invia per email', icon: 'i-ph-envelope'},
    ]},
    {type: 'separator'},
    {label: 'Elimina', icon: 'i-ph-trash', color: 'error'},
  ],
  'link e caricamento': [
    {label: 'Documentazione', icon: 'i-ph-book-open', to: 'https://ui.nuxt.com', target: '_blank'},
    {label: 'Sincronizzazione', icon: 'i-ph-arrows-clockwise', loading: true},
    {label: 'Pagina iniziale', icon: 'i-ph-house', to: '/'},
  ],
}

const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'size', type: 'select', options: sizes, default: 'md'},

  {group: 'Contenuto', key: 'items', label: 'voci', type: 'select', options: Object.keys(itemSets), default: 'base', prop: false},
  {group: 'Contenuto', key: 'arrow', type: 'boolean'},
  {group: 'Contenuto', key: 'filter', label: 'filter (ricerca)', type: 'boolean'},
  {group: 'Contenuto', key: 'checkedIcon', label: 'checked-icon', type: 'select', options: [
    {label: 'check (default)', value: undefined}, {label: 'check-circle', value: 'i-ph-check-circle'},
  ]},
  {group: 'Contenuto', key: 'externalIcon', label: 'external-icon', type: 'select', default: true, options: [
    {label: 'sì', value: true}, {label: 'no', value: false}, {label: 'arrow-up-right', value: 'i-ph-arrow-up-right'},
  ]},

  {group: 'Posizione', key: 'side', type: 'select', prop: false, default: 'bottom', options: ['bottom', 'top', 'right', 'left']},
  {group: 'Posizione', key: 'align', type: 'select', prop: false, default: 'start', options: ['start', 'center', 'end']},
  {group: 'Posizione', key: 'sideOffset', label: 'side-offset', type: 'select', prop: false, default: 8, options: [
    {label: '4', value: 4}, {label: '8', value: 8}, {label: '16', value: 16},
  ]},

  {group: 'Stato', key: 'pinned', label: 'tieni aperto', type: 'boolean', prop: false},
  {group: 'Stato', key: 'modal', type: 'boolean', default: true},
  {group: 'Stato', key: 'disabled', type: 'boolean'},
]

const state = useCookie<Record<string, any>>('showcase-dropdown-menu', {default: () => controlDefaults(controls)})

const items = computed(() => itemSets[state.value.items as string] ?? itemSets.base!)

// content è un oggetto: lo compongo dai tre controlli di posizione.
const content = computed(() => ({
  side: state.value.side ?? 'bottom',
  align: state.value.align ?? 'start',
  sideOffset: state.value.sideOffset ?? 8,
}))

const codeExtra = computed(() => {
  const parts: string[] = []
  if (content.value.side !== 'bottom') parts.push(`side: '${content.value.side}'`)
  if (content.value.align !== 'center') parts.push(`align: '${content.value.align}'`)
  if (content.value.sideOffset !== 8) parts.push(`sideOffset: ${content.value.sideOffset}`)
  const attrs = [':items="items"']
  if (parts.length) attrs.push(`:content="{${parts.join(', ')}}"`)
  return attrs.join(' ')
})

// Tenuto aperto: controllato e non modale, così i due temi restano aperti insieme.
const pinned = computed(() => state.value.pinned ? {open: true, modal: false} : {})

// Le anteprime fisse: aperte, non modali, nella pagina (portal off) per
// ereditare il tema del pannello, e senza rubare il focus all'apertura.
const still = {
  open: true,
  modal: false,
  portal: false,
}

function stillContent(extra: Record<string, unknown> = {}) {
  return {side: 'bottom', align: 'start', sideOffset: 6, onOpenAutoFocus: (e: Event) => e.preventDefault(), ...extra} as any
}

const colorItems = computed<DropdownMenuItem[]>(() => colors.map(c => ({
  label: c, icon: 'i-ph-circle', color: c as any,
})))
</script>

<template>
  <ShowcasePage
      title="DropdownMenu"
      wraps="UDropdownMenu"
      description="UDropdownMenu con il tema di Stem: il pannello ha l'ombra, il bordo e gli angoli superellittici dei menu fluttuanti, le voci seguono la regola d'oro delle size e l'icona è alta quanto il testo."
  >
    <ShowcasePlayground v-model="state" tag="UDropdownMenu" :controls="controls" :code-extra="codeExtra">
      <template #default="{props}">
        <UDropdownMenu
            v-bind="{...props, ...pinned}"
            :items="items"
            :content="{...content, onOpenAutoFocus: (e: Event) => state.pinned && e.preventDefault()} as any"
            :portal="false"
        >
          <SButton label="Azioni" variant="subtle" color="secondary" :size="props.size as any" trailing-icon="i-ph-caret-down" :disabled="props.disabled as boolean"/>
        </UDropdownMenu>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Size"
        description="I menu aperti, uno per size, con le voci scelte sopra. Il padding delle voci è in em e scala col testo; sm ha le misure di una riga selezionabile standard (36px)."
    >
      <ShowcaseStage body-class="flex flex-wrap items-start justify-center gap-x-6 gap-y-4 p-8">
        <div v-for="size in sizes" :key="size" class="flex h-[22rem] w-44 flex-col items-start gap-1">
          <span class="font-mono text-[11px] font-medium text-(--ui-text-muted)">{{ size }}</span>
          <UDropdownMenu
              v-bind="still"
              :items="items"
              :size="size as any"
              :arrow="state.arrow"
              :checked-icon="state.checkedIcon"
              :content="stillContent()"
          >
            <SButton :label="size.toUpperCase()" variant="subtle" color="secondary" :size="size as any" trailing-icon="i-ph-caret-down"/>
          </UDropdownMenu>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Colori delle voci"
        description="Il colore è di ogni voce (item.color), non del menu: tinge etichetta e icona."
    >
      <ShowcaseStage body-class="flex justify-center p-8">
        <div class="flex h-[19rem] flex-col items-start">
          <UDropdownMenu v-bind="still" :items="colorItems" :size="state.size" :content="stillContent()">
            <SButton label="Colori" variant="subtle" color="secondary" :size="state.size" trailing-icon="i-ph-caret-down"/>
          </UDropdownMenu>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Tipi di voce"
        description="Gruppi con label e scorciatoie, descrizioni, checkbox, sottomenu, link esterni e caricamento. Clicca per aprirli."
    >
      <ShowcaseStage>
        <UDropdownMenu
            v-for="(set, name) in itemSets"
            :key="name"
            :items="set"
            :size="state.size"
            :portal="false"
            :content="{align: 'start', sideOffset: 8}"
        >
          <SButton :label="name" variant="subtle" color="secondary" :size="state.size" trailing-icon="i-ph-caret-down"/>
        </UDropdownMenu>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Posizione"
        description="content.side e content.align decidono dove si apre rispetto al trigger; arrow aggiunge la freccia."
    >
      <ShowcaseStage>
        <template v-for="side in ['bottom', 'top', 'right', 'left']" :key="side">
          <UDropdownMenu
              :items="itemSets.base"
              :size="state.size"
              :portal="false"
              arrow
              :content="{side: side as any, align: 'center', sideOffset: 4}"
          >
            <SButton :label="side" variant="subtle" color="secondary" :size="state.size"/>
          </UDropdownMenu>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
