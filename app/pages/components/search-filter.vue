<script setup lang="ts">
import type {ShowcaseControl} from '~/utils/showcase-controls'

// ── Dati demo ──────────────────────────────────────────────────────────────
const statusOptions = [
  {value: 'active', label: 'Attivo', icon: 'i-ph-check-circle', iconClass: 'text-emerald-600 dark:text-emerald-400'},
  {value: 'pending', label: 'In attesa', icon: 'i-ph-clock', iconClass: 'text-amber-600 dark:text-amber-400'},
  {value: 'archived', label: 'Archiviato', icon: 'i-ph-archive'},
]
const categoryOptions = [
  {value: 'design', label: 'Design', icon: 'i-ph-palette', group: 'product'},
  {value: 'development', label: 'Sviluppo', icon: 'i-ph-code', group: 'product'},
  {value: 'research', label: 'Ricerca', icon: 'i-ph-flask', group: 'product'},
  {value: 'marketing', label: 'Marketing', icon: 'i-ph-megaphone', group: 'business'},
  {value: 'sales', label: 'Vendite', icon: 'i-ph-handshake', group: 'business'},
  {value: 'support', label: 'Supporto', icon: 'i-ph-headset', group: 'business'},
]
const categoryGroups = [
  {value: 'product', label: 'Prodotto'},
  {value: 'business', label: 'Business'},
]
const statusCounts = {active: 24, pending: 7, archived: 112, not_contacted: 5}
const categoryCounts = {design: 12, development: 31, research: 4, marketing: 9, sales: 6, support: 18}

const orderOptions = [
  {value: 'newest', label: 'Più recenti'},
  {value: 'oldest', label: 'Meno recenti'},
  {value: 'name', label: 'Nome A–Z'},
  {value: 'updated', label: 'Ultima modifica'},
]

const colorOptions = [
  {value: 'red', label: 'Rosso'},
  {value: 'amber', label: 'Ambra'},
  {value: 'emerald', label: 'Smeraldo'},
  {value: 'sky', label: 'Cielo'},
  {value: 'violet', label: 'Viola'},
]
const swatch: Record<string, string> = {
  red: 'bg-red-500', amber: 'bg-amber-500', emerald: 'bg-emerald-500', sky: 'bg-sky-500', violet: 'bg-violet-500',
}

// ── SSearchFilter: playground ──────────────────────────────────────────────
const filterControls: ShowcaseControl[] = [
  {group: 'Dati', key: 'data', label: 'opzioni', type: 'select', prop: false, initial: 'stato', options: ['stato', 'categoria']},
  {group: 'Dati', key: 'withGroups', label: 'groups', type: 'boolean', prop: false},
  {group: 'Dati', key: 'withCounts', label: 'counts', type: 'boolean', prop: false},

  {group: 'Comportamento', key: 'multiple', type: 'boolean', default: true},
  {group: 'Comportamento', key: 'nullable', type: 'boolean'},
  {group: 'Comportamento', key: 'threshold', type: 'select', default: 3, options: [
    {label: '1', value: 1}, {label: '2', value: 2}, {label: '3', value: 3}, {label: '5', value: 5},
  ]},
  {group: 'Comportamento', key: 'alignEnd', label: 'align-end', type: 'boolean'},

  {group: 'Testi', key: 'label', type: 'text', initial: 'Stato'},
  {group: 'Testi', key: 'icon', type: 'select', options: [
    {label: 'nessuna', value: undefined}, {label: 'circle-half', value: 'i-ph-circle-half'}, {label: 'tag', value: 'i-ph-tag'}, {label: 'funnel', value: 'i-ph-funnel'},
  ]},
  {group: 'Testi', key: 'allLabel', label: 'all-label', type: 'text', default: 'All', initial: 'Tutti'},
  {group: 'Testi', key: 'placeholder', type: 'text', default: 'None selected', initial: 'Nessuno'},
  {group: 'Testi', key: 'selectedTemplate', label: 'selected-template', type: 'text', default: '% selected', initial: '% selezionati'},
  {group: 'Testi', key: 'resetLabel', label: 'reset-label', type: 'text', default: 'Reset', initial: 'Azzera'},
  {group: 'Testi', key: 'nullLabel', label: 'null-label', type: 'text', default: 'Not Contacted', initial: 'Mai contattato'},
  {group: 'Testi', key: 'nullIcon', label: 'null-icon', type: 'select', default: 'i-ph-dots-three', options: [
    {label: 'dots-three', value: 'i-ph-dots-three'}, {label: 'minus-circle', value: 'i-ph-minus-circle'}, {label: 'prohibit', value: 'i-ph-prohibit'},
  ]},

  {group: 'Classi', key: 'contentClass', label: 'content-class', type: 'select', default: 'min-w-48', options: ['min-w-48', 'min-w-64', 'w-80']},
]

const filterState = useShowcaseState<Record<string, any>>('search-filter', () => controlDefaults(filterControls))

// Il Set non va nel cookie: la selezione resta in memoria.
const filterValue = ref(new Set<string>())
watch(() => [filterState.value.data, filterState.value.multiple], () => (filterValue.value = new Set()))

const filterData = computed(() => {
  const isStatus = filterState.value.data !== 'categoria'
  return {
    options: isStatus ? statusOptions : categoryOptions,
    groups: !isStatus && filterState.value.withGroups ? categoryGroups : undefined,
    counts: filterState.value.withCounts ? (isStatus ? statusCounts : categoryCounts) : undefined,
  }
})

const filterCodeExtra = computed(() => [
  'v-model="selected"',
  ':options="options"',
  filterData.value.groups && ':groups="groups"',
  filterData.value.counts && ':counts="counts"',
].filter(Boolean).join(' '))

// ── SSearchFilter: stati della selezione ───────────────────────────────────
const selectionStates: Record<string, string[]> = {
  'tutti': [],
  '1 valore': ['design'],
  '2 valori': ['design', 'development'],
  '3 valori': ['design', 'development', 'research'],
  'oltre la soglia': ['design', 'development', 'research', 'marketing'],
}
const selections = reactive<Record<string, Set<string>>>(
  Object.fromEntries(Object.entries(selectionStates).map(([k, v]) => [k, new Set(v)])),
)

// Una selezione per ciascun esempio delle sezioni.
const ex = reactive({
  icon: new Set<string>(['active']),
  iconAll: new Set<string>(),
  single: new Set<string>(['pending']),
  groups: new Set<string>(['design', 'development', 'research']),
  nullable: new Set<string>(['not_contacted']),
  counts: new Set<string>(),
  chip: new Set<string>(['red', 'sky']),
  item: new Set<string>(),
})

// ── SSearchChip: playground ────────────────────────────────────────────────
const chipValues: Record<string, string[] | undefined> = {
  'nessuno': undefined,
  '1': ['Attivo'],
  '2': ['Attivo', 'In attesa'],
  '4': ['Attivo', 'In attesa', 'Archiviato', 'Bozza'],
}

const chipControls: ShowcaseControl[] = [
  {group: 'Contenuto', key: 'label', type: 'text', initial: 'Stato'},
  {group: 'Contenuto', key: 'values', label: 'selected-values', type: 'select', prop: false, initial: '2', options: Object.keys(chipValues)},
  {group: 'Contenuto', key: 'count', type: 'select', initial: 4, options: [
    {label: 'nessuno', value: undefined}, {label: '2', value: 2}, {label: '4', value: 4}, {label: '6', value: 6},
  ]},
  {group: 'Contenuto', key: 'threshold', type: 'select', default: 3, options: [
    {label: '1', value: 1}, {label: '2', value: 2}, {label: '3', value: 3},
  ]},
  {group: 'Contenuto', key: 'allLabel', label: 'all-label', type: 'text', default: 'All', initial: 'Tutti'},
  {group: 'Contenuto', key: 'selectedTemplate', label: 'selected-template', type: 'text', default: '% selected', initial: '% selezionati'},
  {group: 'Contenuto', key: 'slot', label: 'slot default', type: 'text', prop: false, initial: 'Filtri', placeholder: 'vale senza label'},

  {group: 'Icone', key: 'leadingIcon', label: 'leading-icon', type: 'select', options: [
    {label: 'nessuna', value: undefined}, {label: 'tag', value: 'i-ph-tag'}, {label: 'calendar', value: 'i-ph-calendar-blank'},
  ]},
  {group: 'Icone', key: 'labelIcon', label: 'label-icon', type: 'select', options: [
    {label: 'nessuna', value: undefined}, {label: 'circle-half', value: 'i-ph-circle-half'}, {label: 'user', value: 'i-ph-user'},
  ]},
  {group: 'Icone', key: 'trailingIcon', label: 'trailing-icon', type: 'select', options: [
    {label: 'nessuna', value: undefined}, {label: 'caret-down', value: 'i-ph-caret-down'},
  ]},

  {group: 'Stato', key: 'active', type: 'boolean'},
]

const chipState = useShowcaseState<Record<string, any>>('search-filter-chip', () => controlDefaults(chipControls))

const chipCodeExtra = computed(() => {
  const v = chipValues[chipState.value.values]
  return v ? `:selected-values="[${v.map(s => `'${s}'`).join(', ')}]"` : ''
})

const chipStates: Record<string, Record<string, unknown>> = {
  'testo libero': {},
  'leading-icon': {leadingIcon: 'i-ph-tag'},
  'active': {active: true},
  '1 valore': {label: 'Stato', selectedValues: ['Attivo'], count: 3},
  'sotto soglia': {label: 'Stato', selectedValues: ['Attivo', 'In attesa'], count: 4},
  'oltre soglia': {label: 'Stato', selectedValues: ['Attivo', 'In attesa', 'Bozza', 'Chiuso'], count: 6, selectedTemplate: '% selezionati'},
  'tutti': {label: 'Stato', selectedValues: ['a', 'b', 'c'], count: 3, allLabel: 'Tutti'},
  'label-icon': {label: 'Stato', labelIcon: 'i-ph-circle-half', selectedValues: ['Attivo'], count: 3},
}

// ── SSearchOrder: playground ───────────────────────────────────────────────
const orderControls: ShowcaseControl[] = [
  {key: 'label', type: 'text', default: 'Order by', initial: 'Ordina per'},
  {key: 'contentClass', label: 'content-class', type: 'select', default: 'min-w-36 w-full', options: ['min-w-36 w-full', 'min-w-48', 'w-64']},
  {key: 'chipClass', label: 'chip-class', type: 'select', options: [{label: 'nessuna', value: undefined}, 'max-w-40']},
]

const orderState = useShowcaseState<Record<string, any>>('search-filter-order', () => controlDefaults(orderControls))
const order = ref('newest')
</script>

<template>
  <ShowcasePage
      title="SearchFilter"
      description="I chip di filtro della ricerca: SSearchFilter apre una lista a selezione multipla o singola, SSearchOrder sceglie l'ordinamento, SSearchChip è il chip sotto entrambi."
  >
    <ShowcasePlayground v-model="filterState" tag="SSearchFilter" :controls="filterControls" :code-extra="filterCodeExtra">
      <template #default="{props, mode}">
        <PortalScope :mode="mode">
          <SSearchFilter v-model="filterValue" v-bind="props" :label="props.label ?? ''" :options="filterData.options" :groups="filterData.groups" :counts="filterData.counts"/>
        </PortalScope>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Selezione"
        description="Cosa scrive il chip: il testo «tutti» senza filtro, i valori fino a threshold, poi il conteggio. Con un filtro attivo compare la X che azzera."
    >
      <ShowcaseScale :items="Object.keys(selectionStates)">
        <template #item="{item, mode}">
          <PortalScope :mode="mode">
            <SSearchFilter v-model="selections[item]!" :options="categoryOptions" label="Categoria" all-label="Tutte" selected-template="% selezionate" reset-label="Azzera"/>
          </PortalScope>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Con icona"
        description="Con icon il chip mostra l'icona al posto della label (che resta nel tooltip e come nome accessibile); con un solo valore prende l'icona di quel valore."
    >
      <ShowcaseStage>
        <template #default="{mode}">
          <PortalScope :mode="mode">
            <SSearchFilter v-model="ex.iconAll" :options="statusOptions" label="Stato" icon="i-ph-circle-half" all-label="Tutti" reset-label="Azzera"/>
            <SSearchFilter v-model="ex.icon" :options="statusOptions" label="Stato" icon="i-ph-circle-half" all-label="Tutti" reset-label="Azzera"/>
          </PortalScope>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Singola"
        description="multiple false: un valore alla volta, il menu si chiude alla scelta, niente «tutti» né X."
    >
      <ShowcaseStage>
        <template #default="{mode}">
          <PortalScope :mode="mode">
            <SSearchFilter v-model="ex.single" :options="statusOptions" :multiple="false" label="Stato" placeholder="Nessuno"/>
          </PortalScope>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Gruppi, nullable, counts"
        description="groups divide la lista e un gruppo intero si sceglie dal titolo; nullable aggiunge il valore «vuoto»; counts scrive quanti risultati ha ogni voce."
    >
      <ShowcaseStage>
        <template #default="{mode}">
          <PortalScope :mode="mode">
            <SSearchFilter v-model="ex.groups" :options="categoryOptions" :groups="categoryGroups" label="Categoria" all-label="Tutte" reset-label="Azzera"/>
            <SSearchFilter v-model="ex.nullable" :options="statusOptions" nullable null-label="Mai contattato" label="Stato" all-label="Tutti" reset-label="Azzera"/>
            <SSearchFilter v-model="ex.counts" :options="categoryOptions" :counts="categoryCounts" label="Categoria" all-label="Tutte" reset-label="Azzera"/>
          </PortalScope>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Slot chip e item"
        description="chip disegna la selezione al posto di label e valori (qui i campioni di colore); item ridisegna ogni voce della lista."
    >
      <ShowcaseStage>
        <template #default="{mode}">
          <PortalScope :mode="mode">
            <SSearchFilter v-model="ex.chip" :options="colorOptions" label="Colore" all-label="Tutti" reset-label="Azzera">
              <template #chip="{values}">
                <span class="flex -space-x-1">
                  <span v-for="v in values" :key="v" class="size-3.5 rounded-full ring-2 ring-(--ui-bg)" :class="swatch[v]"/>
                </span>
              </template>
            </SSearchFilter>
            <SSearchFilter v-model="ex.item" :options="colorOptions" label="Colore" all-label="Tutti" reset-label="Azzera">
              <template #item="{option, checked}">
                <div class="flex w-full items-center gap-2">
                  <span class="size-3 rounded-full" :class="swatch[option.value]"/>
                  <span class="mr-auto">{{ option.label }}</span>
                  <UIcon v-if="checked" name="i-ph-check" class="size-4"/>
                </div>
              </template>
            </SSearchFilter>
          </PortalScope>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="SearchChip"
        description="Il chip da solo: un SButton soft, sm, a pillola, space-x un gradino sotto la size, con il caret. Con label e selected-values scrive la selezione."
    >
      <ShowcasePlayground v-model="chipState" tag="SSearchChip" :controls="chipControls" :code-extra="chipCodeExtra">
        <template #default="{props, state: s}">
          <SSearchChip v-bind="props" :selected-values="chipValues[s.values]">{{ s.slot }}</SSearchChip>
        </template>
      </ShowcasePlayground>
      <ShowcaseScale :items="Object.keys(chipStates)">
        <template #item="{item}">
          <SSearchChip v-bind="chipStates[item]">Filtri</SSearchChip>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="SearchOrder"
        description="Un chip a selezione singola per l'ordinamento: mostra sempre il criterio scelto. v-model è il value dell'opzione."
    >
      <ShowcasePlayground v-model="orderState" tag="SSearchOrder" :controls="orderControls" code-extra='v-model="order" :options="options"'>
        <template #default="{props, mode}">
          <PortalScope :mode="mode">
            <SSearchOrder v-model="order" v-bind="props" :options="orderOptions"/>
          </PortalScope>
        </template>
      </ShowcasePlayground>
    </ShowcaseSection>
  </ShowcasePage>
</template>
