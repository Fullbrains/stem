<script setup lang="ts">
import type {ShowcaseControl} from '~/utils/showcase-controls'

// ── Dati demo ──────────────────────────────────────────────────────────────
const statusOptions = [
  {value: 'active', label: 'Attivo', icon: 'i-ph-check-circle'},
  {value: 'pending', label: 'In attesa', icon: 'i-ph-clock'},
  {value: 'archived', label: 'Archiviato', icon: 'i-ph-archive'},
]
const categoryOptions = [
  {value: 'design', label: 'Design', icon: 'i-ph-palette'},
  {value: 'development', label: 'Sviluppo', icon: 'i-ph-code'},
  {value: 'marketing', label: 'Marketing', icon: 'i-ph-megaphone'},
  {value: 'support', label: 'Supporto', icon: 'i-ph-headset'},
]
const ownerOptions = [
  {value: 'me', label: 'Io'},
  {value: 'team', label: 'Il mio team'},
  {value: 'others', label: 'Altri'},
]
const orderOptions = [
  {value: 'newest', label: 'Più recenti'},
  {value: 'oldest', label: 'Meno recenti'},
  {value: 'name', label: 'Nome A–Z'},
]

const variants = ['outline', 'soft', 'subtle', 'ghost']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
const icons = [
  {label: 'default (ui.icons.search)', value: undefined},
  {label: 'sparkle', value: 'i-ph-sparkle'},
  {label: 'scales', value: 'i-ph-scales'},
  {label: 'book-open', value: 'i-ph-book-open'},
]

// Selezione condivisa da tutte le barre della pagina: i Set non vanno nel cookie.
const query = ref('')
const status = ref(new Set<string>())
const category = ref(new Set<string>())
const owner = ref(new Set<string>())
const order = ref('newest')

const activeCount = computed(() => [status, category, owner].filter(s => s.value.size > 0).length)

// ── Playground ─────────────────────────────────────────────────────────────
const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'variant', type: 'select', options: variants, default: 'outline'},
  {group: 'Aspetto', key: 'size', type: 'select', options: [{label: 'md (default)', value: undefined}, 'xs', 'sm', 'lg', 'xl']},
  {group: 'Aspetto', key: 'compact', type: 'boolean'},
  {group: 'Aspetto', key: 'icon', type: 'select', options: icons},

  {group: 'Testi', key: 'placeholder', type: 'text', default: 'Search...', initial: 'Cerca progetti…'},
  {group: 'Testi', key: 'filtersLabel', label: 'filters-label', type: 'text', default: 'Filters', initial: 'Filtri'},
  {group: 'Testi', key: 'hideClear', label: 'hide-clear', type: 'boolean'},

  {group: 'Slot', key: 'filters', label: '#filters', type: 'boolean', prop: false, initial: true},
  {group: 'Slot', key: 'more', label: '#more', type: 'boolean', prop: false},
  {group: 'Slot', key: 'trailing', label: '#trailing', type: 'boolean', prop: false},

  {group: 'Collasso', key: 'minInputWidth', label: 'min-input-width', type: 'select', default: 280, options: [
    {label: '160', value: 160}, {label: '280', value: 280}, {label: '400', value: 400},
  ]},
  {group: 'Collasso', key: 'width', label: 'larghezza demo', type: 'select', prop: false, initial: 640, options: [
    {label: '360', value: 360}, {label: '480', value: 480}, {label: '640', value: 640}, {label: '760', value: 760},
  ]},
]

const state = useShowcaseState<Record<string, any>>('search-bar', () => controlDefaults(controls))

const codeExtra = 'v-model="query" :active-filter-count="activeCount"'

// ── Collasso responsive ───────────────────────────────────────────────────
const clearA = ref('contratti 2024')
const clearB = ref('contratti 2024')

const resizeWidth = useShowcaseState<number>('search-bar-width', () => 720)
</script>

<template>
  <ShowcasePage
      title="SearchBar"
      description="La barra di ricerca: un campo a pillola con i filtri in linea. Quando lo spazio non basta i filtri finiscono sotto il pulsante a imbuto, che ne conta gli attivi."
  >
    <ShowcasePlayground v-model="state" tag="SSearchBar" :controls="controls" :code-extra="codeExtra">
      <template #default="{props, state: s, mode}">
        <PortalScope :mode="mode">
          <div :style="{width: `${s.width}px`}" class="max-w-full">
            <SSearchBar v-model="query" v-bind="props" :active-filter-count="activeCount">
              <template v-if="s.filters" #filters>
                <SSearchFilter v-model="status" :options="statusOptions" label="Stato" all-label="Tutti" reset-label="Azzera"/>
                <SSearchFilter v-model="category" :options="categoryOptions" label="Categoria" all-label="Tutte" reset-label="Azzera"/>
              </template>
              <template v-if="s.more" #more>
                <SSearchFilter v-model="owner" :options="ownerOptions" label="Proprietario" all-label="Tutti" reset-label="Azzera"/>
              </template>
              <template v-if="s.trailing" #trailing>
                <SSearchOrder v-model="order" :options="orderOptions" label="Ordina per"/>
              </template>
            </SSearchBar>
          </div>
        </PortalScope>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Collasso"
        description="Trascina: sotto min-input-width (280px di campo) i filtri di #filters lasciano la riga e si aprono dall'imbuto. Il contatore sull'imbuto conta i filtri attivi."
    >
      <div class="flex items-center gap-3 text-[12px] text-gray-500">
        <input v-model.number="resizeWidth" type="range" min="240" max="960" step="10" class="w-72 accent-gray-900">
        <span class="font-mono tabular-nums">{{ resizeWidth }}px</span>
      </div>
      <ShowcaseStage body-class="p-8">
        <template #default="{mode}">
          <PortalScope :mode="mode">
            <div :style="{width: `${resizeWidth}px`}" class="max-w-full">
              <SSearchBar v-model="query" placeholder="Cerca progetti…" filters-label="Filtri" :active-filter-count="activeCount">
                <template #filters>
                  <SSearchFilter v-model="status" :options="statusOptions" label="Stato" all-label="Tutti" reset-label="Azzera"/>
                  <SSearchFilter v-model="category" :options="categoryOptions" label="Categoria" all-label="Tutte" reset-label="Azzera"/>
                  <SSearchOrder v-model="order" :options="orderOptions" label="Ordina per"/>
                </template>
              </SSearchBar>
            </div>
          </PortalScope>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Size"
        description="La barra è alta come un SButton della sua size; i chip dei filtri prendono la sua size, più bassi di due gradini."
    >
      <ShowcaseStage body-class="grid grid-cols-1 gap-4 p-8">
        <template #default="{mode}">
          <PortalScope :mode="mode">
            <div v-for="sz in sizes" :key="sz" class="flex items-center gap-4">
              <span class="w-14 shrink-0 text-right font-mono text-[10px] text-(--ui-text-dimmed)">{{ sz }}</span>
              <SSearchBar v-model="query" :size="sz as any" placeholder="Cerca…" class="flex-1" :active-filter-count="activeCount">
                <template #filters>
                  <SSearchFilter v-model="status" :options="statusOptions" label="Stato" all-label="Tutti" reset-label="Azzera"/>
                  <SSearchFilter v-model="category" :options="categoryOptions" label="Categoria" all-label="Tutte" reset-label="Azzera"/>
                </template>
              </SSearchBar>
            </div>
          </PortalScope>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Variant"
        description="outline e subtle hanno un ring interno (non un bordo: la barra resta alta 40px), soft e ghost solo il fondo. Al focus il ring si scurisce."
    >
      <ShowcaseStage body-class="grid grid-cols-1 gap-4 p-8">
        <template #default="{mode}">
          <PortalScope :mode="mode">
            <div v-for="v in variants" :key="v" class="flex items-center gap-4">
              <span class="w-14 shrink-0 text-right font-mono text-[10px] text-(--ui-text-dimmed)">{{ v }}</span>
              <SSearchBar v-model="query" :variant="v as any" placeholder="Cerca…" class="flex-1" :active-filter-count="activeCount">
                <template #filters>
                  <SSearchFilter v-model="status" :options="statusOptions" label="Stato" all-label="Tutti" reset-label="Azzera"/>
                </template>
              </SSearchBar>
            </div>
          </PortalScope>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Compact"
        description="32px invece di 40px, testo sm, e i chip dei filtri si stringono con la barra."
    >
      <ShowcaseStage body-class="grid grid-cols-1 gap-4 p-8">
        <template #default="{mode}">
          <PortalScope :mode="mode">
            <div v-for="c in [false, true]" :key="String(c)" class="flex flex-col items-center gap-1.5">
              <ShowcaseMeasure labels>
                <SSearchBar v-model="query" :compact="c" placeholder="Cerca…" class="w-[560px]" :active-filter-count="activeCount">
                  <template #filters>
                    <SSearchFilter v-model="status" :options="statusOptions" label="Stato" all-label="Tutti" reset-label="Azzera"/>
                    <SSearchFilter v-model="category" :options="categoryOptions" label="Categoria" all-label="Tutte" reset-label="Azzera"/>
                  </template>
                </SSearchBar>
              </ShowcaseMeasure>
              <span class="font-mono text-[11px] font-medium text-(--ui-text-muted)">{{ c ? 'compact' : 'normale' }}</span>
            </div>
          </PortalScope>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Slot"
        description="#filters sta in riga finché c'è posto; #more vive sempre sotto l'imbuto; #trailing resta in riga e non collassa."
    >
      <ShowcaseStage body-class="grid grid-cols-1 gap-4 p-8">
        <template #default="{mode}">
          <PortalScope :mode="mode">
            <div class="space-y-1.5">
              <p class="font-mono text-[10px] text-(--ui-text-dimmed)">#filters + #more</p>
              <SSearchBar v-model="query" placeholder="Cerca…" filters-label="Filtri" :active-filter-count="activeCount">
                <template #filters>
                  <SSearchFilter v-model="status" :options="statusOptions" label="Stato" all-label="Tutti" reset-label="Azzera"/>
                </template>
                <template #more>
                  <SSearchFilter v-model="category" :options="categoryOptions" label="Categoria" all-label="Tutte" reset-label="Azzera"/>
                  <SSearchFilter v-model="owner" :options="ownerOptions" label="Proprietario" all-label="Tutti" reset-label="Azzera"/>
                </template>
              </SSearchBar>
            </div>
            <div class="space-y-1.5">
              <p class="font-mono text-[10px] text-(--ui-text-dimmed)">#filters + #trailing</p>
              <SSearchBar v-model="query" placeholder="Cerca…" :active-filter-count="activeCount">
                <template #filters>
                  <SSearchFilter v-model="status" :options="statusOptions" label="Stato" all-label="Tutti" reset-label="Azzera"/>
                  <SSearchFilter v-model="category" :options="categoryOptions" label="Categoria" all-label="Tutte" reset-label="Azzera"/>
                </template>
                <template #trailing>
                  <SSearchOrder v-model="order" :options="orderOptions" label="Ordina per"/>
                </template>
              </SSearchBar>
            </div>
            <div class="space-y-1.5">
              <p class="font-mono text-[10px] text-(--ui-text-dimmed)">solo campo</p>
              <SSearchBar v-model="query" placeholder="Cerca…"/>
            </div>
          </PortalScope>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Icona e clear"
        description="L'icona di default è ui.icons.search dell'app.config; icon la cambia per una barra. Con del testo compare il pulsante che svuota, tolto da hide-clear."
    >
      <ShowcaseStage body-class="grid grid-cols-1 gap-4 p-8 lg:grid-cols-2">
        <SSearchBar v-model="clearA" placeholder="Cerca…"/>
        <SSearchBar v-model="clearB" placeholder="Cerca…" hide-clear/>
        <SSearchBar icon="i-ph-sparkle" placeholder="Chiedi all'assistente…"/>
        <SSearchBar icon="i-ph-scales" placeholder="Cerca nella normativa…"/>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
