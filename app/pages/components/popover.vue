<script setup lang="ts">
import type {ShowcaseControl} from '~/utils/showcase-controls'

const sides = ['top', 'right', 'bottom', 'left']
const aligns = ['start', 'center', 'end']

const controls: ShowcaseControl[] = [
  {group: 'Apertura', key: 'mode', type: 'select', options: ['click', 'hover'], default: 'click'},
  {group: 'Apertura', key: 'openDelay', label: 'open-delay', type: 'select', default: 0, options: [
    {label: '0', value: 0}, {label: '150', value: 150}, {label: '500', value: 500},
  ]},
  {group: 'Apertura', key: 'closeDelay', label: 'close-delay', type: 'select', default: 0, options: [
    {label: '0', value: 0}, {label: '150', value: 150}, {label: '500', value: 500},
  ]},
  {group: 'Apertura', key: 'dismissible', type: 'boolean', default: true},
  {group: 'Apertura', key: 'modal', type: 'boolean'},

  {group: 'Posizione', key: 'side', type: 'select', prop: false, options: sides, initial: 'bottom'},
  {group: 'Posizione', key: 'align', type: 'select', prop: false, options: aligns, initial: 'center'},
  {group: 'Posizione', key: 'sideOffset', label: 'side-offset', type: 'select', prop: false, initial: 8, options: [
    {label: '0', value: 0}, {label: '4', value: 4}, {label: '8 (default)', value: 8}, {label: '16', value: 16},
  ]},
  {group: 'Posizione', key: 'arrow', type: 'boolean'},

  {group: 'Contenuto', key: 'example', label: 'contenuto', type: 'select', prop: false, initial: 'testo', options: ['testo', 'form', 'azioni']},
]

const state = useShowcaseState<Record<string, any>>('popover', () => controlDefaults(controls))

// side/align/side-offset vivono nell'oggetto `content`: il codice lo scrive a mano.
const content = computed(() => {
  const out: Record<string, unknown> = {}
  if (state.value.side && state.value.side !== 'bottom') out.side = state.value.side
  if (state.value.align && state.value.align !== 'center') out.align = state.value.align
  if (state.value.sideOffset !== undefined && state.value.sideOffset !== 8) out.sideOffset = state.value.sideOffset
  return out
})

const contentCode = computed(() => {
  const entries = Object.entries(content.value)
  if (!entries.length) return ''
  return `:content="{${entries.map(([k, v]) => `${k}: ${typeof v === 'string' ? `'${v}'` : v}`).join(', ')}}"`
})

// Le delay contano solo in hover: in click Reka le ignora.
function popoverProps(p: Record<string, unknown>) {
  const out = {...p}
  if (out.mode !== 'hover') {
    delete out.openDelay
    delete out.closeDelay
  }
  return out
}

const actions = [
  {label: 'Rinomina', icon: 'i-ph-pencil-simple'},
  {label: 'Duplica', icon: 'i-ph-copy'},
  {label: 'Sposta', icon: 'i-ph-folder-simple'},
]
</script>

<template>
  <ShowcasePage
      title="Popover"
      wraps="UPopover · SPopover"
      description="Il pannello flottante di Stem: la stessa ombra e lo stesso angolo superellittico dei menu a tendina. SPopover aggiunge la freccia di Stem quando serve (arrow)."
  >
    <ShowcasePlayground v-model="state" tag="SPopover" :controls="controls" :code-extra="contentCode">
      <template #default="{props, state: s, mode}">
        <PortalScope :mode="mode">
          <SPopover :key="String(props.mode)" v-bind="popoverProps(props)" :content="content">
            <SButton :label="props.mode === 'hover' ? 'Passa sopra' : 'Apri'" variant="soft" :icon="props.mode === 'hover' ? 'i-ph-cursor' : 'i-ph-cursor-click'"/>
            <template #content="{close}">
              <div v-if="s.example === 'testo'" class="w-64 space-y-1 p-4">
                <p class="text-sm font-semibold text-(--ui-text-highlighted)">Bozza salvata</p>
                <p class="text-sm text-(--ui-text-muted)">L'ultima modifica è di due minuti fa. Le bozze restano per 30 giorni.</p>
              </div>
              <div v-else-if="s.example === 'form'" class="w-72 space-y-3 p-4">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-semibold text-(--ui-text-highlighted)">Invita</p>
                  <SCloseButton size="xs" @click="close"/>
                </div>
                <SInput placeholder="Nome" size="sm" class="w-full"/>
                <SInput placeholder="Email" size="sm" class="w-full"/>
                <SButton label="Invia invito" size="sm" block @click="close"/>
              </div>
              <div v-else class="flex w-48 flex-col p-1">
                <SButton v-for="a in actions" :key="a.label" :label="a.label" :icon="a.icon" variant="ghost" color="neutral" size="sm" class="justify-start" @click="close"/>
              </div>
            </template>
          </SPopover>
        </PortalScope>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Superficie"
        description="Il pannello aperto, fermo: ombra s-floating-menu, angolo superellittico a 10px, nessun ring."
    >
      <ShowcaseStage>
        <ShowcaseMeasure labels>
          <div class="s-floating-menu s-corner w-64 space-y-1 bg-(--ui-bg) p-4 [--s-radius:10px]">
            <p class="text-sm font-semibold text-(--ui-text-highlighted)">Bozza salvata</p>
            <p class="text-sm text-(--ui-text-muted)">L'ultima modifica è di due minuti fa.</p>
          </div>
        </ShowcaseMeasure>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Mode"
        description="click apre e chiude al click e si chiude fuori; hover apre al passaggio, con open-delay e close-delay."
    >
      <ShowcaseStage>
        <template #default="{mode}">
          <PortalScope :mode="mode">
            <SPopover>
              <SButton label="click" icon="i-ph-cursor-click" variant="soft"/>
              <template #content>
                <p class="w-56 p-4 text-sm text-(--ui-text-muted)">Si chiude con un click fuori o con Esc.</p>
              </template>
            </SPopover>
            <SPopover mode="hover">
              <SButton label="hover" icon="i-ph-cursor" variant="soft"/>
              <template #content>
                <p class="w-56 p-4 text-sm text-(--ui-text-muted)">Si apre subito e si chiude quando il puntatore esce.</p>
              </template>
            </SPopover>
            <SPopover mode="hover" :open-delay="500" :close-delay="300">
              <SButton label="hover con delay" icon="i-ph-timer" variant="soft"/>
              <template #content>
                <p class="w-56 p-4 text-sm text-(--ui-text-muted)">open-delay 500, close-delay 300.</p>
              </template>
            </SPopover>
          </PortalScope>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Side × align"
        description="Dove si apre rispetto al trigger. Con arrow la freccia di Stem, punta arrotondata e lati che si raccordano al bordo, punta al trigger."
    >
      <ShowcaseStage body-class="grid grid-cols-1 gap-6 p-8">
        <template #default="{mode}">
          <PortalScope :mode="mode">
            <div v-for="withArrow in [false, true]" :key="String(withArrow)" class="space-y-2">
              <p class="font-mono text-[10px] text-(--ui-text-dimmed)">arrow {{ withArrow ? 'sì' : 'no' }}</p>
              <table class="border-separate border-spacing-x-3 border-spacing-y-2">
                <thead>
                  <tr>
                    <th/>
                    <th v-for="a in aligns" :key="a" class="text-center font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ a }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="side in sides" :key="side">
                    <th class="pr-2 text-right font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ side }}</th>
                    <td v-for="a in aligns" :key="a" class="text-center">
                      <SPopover :content="{side: side as any, align: a as any}" :arrow="withArrow">
                        <SButton :label="`${side} ${a}`" variant="soft" size="xs"/>
                        <template #content>
                          <p class="p-3 font-mono text-xs text-(--ui-text-muted)">{{ side }} · {{ a }}</p>
                        </template>
                      </SPopover>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </PortalScope>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Contenuti"
        description="Il popover non ha padding suo: lo dà il contenuto. Per chiuderlo da dentro, lo slot content passa close."
    >
      <ShowcaseStage>
        <template #default="{mode}">
          <PortalScope :mode="mode">
            <SPopover>
              <SButton label="Testo" variant="soft"/>
              <template #content>
                <div class="w-64 space-y-1 p-4">
                  <p class="text-sm font-semibold text-(--ui-text-highlighted)">Bozza salvata</p>
                  <p class="text-sm text-(--ui-text-muted)">L'ultima modifica è di due minuti fa.</p>
                </div>
              </template>
            </SPopover>
            <SPopover>
              <SButton label="Form" icon="i-ph-user-plus" variant="soft"/>
              <template #content="{close}">
                <div class="w-72 space-y-3 p-4">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-semibold text-(--ui-text-highlighted)">Invita</p>
                    <SCloseButton size="xs" @click="close"/>
                  </div>
                  <SInput placeholder="Nome" size="sm" class="w-full"/>
                  <SInput placeholder="Email" size="sm" class="w-full"/>
                  <SButton label="Invia invito" size="sm" block @click="close"/>
                </div>
              </template>
            </SPopover>
            <SPopover>
              <SButton icon="i-ph-dots-three" variant="soft" square rounded aria-label="Azioni"/>
              <template #content="{close}">
                <div class="flex w-48 flex-col p-1">
                  <SButton v-for="a in actions" :key="a.label" :label="a.label" :icon="a.icon" variant="ghost" color="neutral" size="sm" class="justify-start" @click="close"/>
                </div>
              </template>
            </SPopover>
          </PortalScope>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
