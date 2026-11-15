<script setup lang="ts">
import type {ShowcaseControl} from '~/utils/showcase-controls'
import {darkPortalTarget} from '~/components/PortalScope.vue'

type Mode = 'light' | 'dark'

const icons = [
  {label: 'nessuna', value: undefined},
  {label: 'gear', value: 'i-ph-gear'},
  {label: 'user', value: 'i-ph-user'},
  {label: 'warning-circle', value: 'i-ph-warning-circle'},
  {label: 'folder', value: 'i-ph-folder'},
]

const sizes = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full']
const sides = ['top', 'right', 'bottom', 'left']

const controls: ShowcaseControl[] = [
  {group: 'Contenuto', key: 'title', type: 'text', initial: 'Impostazioni progetto', placeholder: 'nessuno'},
  {group: 'Contenuto', key: 'description', type: 'text', initial: 'Nome, visibilità e membri del progetto.', placeholder: 'nessuna'},
  {group: 'Contenuto', key: 'icon', type: 'select', options: icons},
  {group: 'Contenuto', key: 'body', label: 'corpo', type: 'select', prop: false, initial: 'breve', options: ['nessuno', 'breve', 'lungo']},
  {group: 'Contenuto', key: 'actions', label: 'slot actions', type: 'boolean', prop: false},
  {group: 'Contenuto', key: 'afterHeader', label: 'slot after-header', type: 'boolean', prop: false},

  {group: 'Posizione', key: 'side', type: 'select', options: sides, default: 'top'},
  {group: 'Posizione', key: 'width', type: 'select', default: 'xl', options: [...sizes, {label: '480 (px)', value: 480}]},
  {group: 'Scala', key: 'size', type: 'select', options: [{label: 'dal parent', value: undefined}, 'xs', 'sm', 'md', 'lg', 'xl']},
  ...scaleControls(),

  {group: 'Header', key: 'header', type: 'boolean', default: true},
  {group: 'Header', key: 'headerCompact', label: 'header-compact', type: 'select', default: false, options: [
    {label: 'no', value: false}, {label: 'sì', value: true}, 'mobileOnly',
  ]},
  {group: 'Header', key: 'headerWrap', label: 'header-wrap', type: 'boolean'},
  {group: 'Header', key: 'headerSeparator', label: 'header-separator', type: 'boolean'},
  {group: 'Header', key: 'closeable', type: 'boolean', default: true},

  {group: 'Footer', key: 'footer', type: 'boolean', default: true},
  {group: 'Footer', key: 'footerSeparator', label: 'footer-separator', type: 'boolean', default: true},

  {group: 'Stato', key: 'disabled', type: 'boolean'},
]

const state = useShowcaseState<Record<string, any>>('modal', () => controlDefaults(controls))

// Uno stato di apertura per pannello: chiaro e scuro aprono ciascuno il proprio.
const open = reactive<Record<string, boolean>>({})
const sizeOpen = reactive<Record<string, boolean>>({})
const sideOpen = reactive<Record<string, boolean>>({})
const nestedOpen = reactive<Record<string, boolean>>({})
const innerOpen = reactive<Record<string, boolean>>({})

/**
 * useConfirmModal e useAlertModal non passano `portal`: qui si apre lo stesso
 * componente con useOverlay, e nel pannello scuro gli si dà il contenitore
 * `.dark` (la prop arriva a USlideover come attributo, attraverso SModal).
 */
const overlay = useOverlay()
const SConfirmModal = resolveComponent('SConfirmModal')
const SAlertModal = resolveComponent('SAlertModal')

function portalFor(mode: Mode) {
  return mode === 'dark' ? darkPortalTarget() : true
}

function confirm(mode: Mode, options: Record<string, unknown>) {
  overlay.create(SConfirmModal as any, {destroyOnClose: true})
    .open({onConfirm: () => new Promise(r => setTimeout(r, 1000)), ...options, portal: portalFor(mode)})
}

function alert(mode: Mode, options: Record<string, unknown>) {
  overlay.create(SAlertModal as any, {destroyOnClose: true})
    .open({...options, portal: portalFor(mode)})
}

const confirms: {label: string, icon?: string, destructive?: boolean, options: Record<string, unknown>}[] = [
  {label: 'Base', options: {title: 'Pubblicare la pagina?', message: 'Sarà visibile a tutti i membri.', label: 'Pubblica', cancelLabel: 'Annulla'}},
  {label: 'Con icona', icon: 'i-ph-arrow-counter-clockwise', options: {title: 'Ripristinare le impostazioni?', message: 'Le preferenze torneranno a quelle di default.', icon: 'i-ph-arrow-counter-clockwise', label: 'Ripristina', cancelLabel: 'Annulla'}},
  {label: 'Destructive', icon: 'i-ph-trash', destructive: true, options: {title: 'Eliminare il progetto?', message: 'L\'operazione non si può annullare.', destructive: true, label: 'Elimina', cancelLabel: 'Annulla'}},
  {label: 'Confirm match', icon: 'i-ph-robot', destructive: true, options: {title: 'Eliminare il bot?', message: 'Digita <b>Il mio bot</b> per confermare.', destructive: true, confirmMatch: 'Il mio bot', confirmPlaceholder: 'Nome del bot', label: 'Elimina', cancelLabel: 'Annulla'}},
  {label: 'Header separator', options: {title: 'Archiviare 12 elementi?', message: 'Potrai ripristinarli dall\'archivio.\nGli elementi archiviati non compaiono nelle ricerche.', headerSeparator: true, label: 'Archivia', cancelLabel: 'Annulla'}},
  {label: 'Header compact', options: {title: 'Uscire senza salvare?', message: 'Le modifiche andranno perse.', headerCompact: true, label: 'Esci', cancelLabel: 'Resta'}},
]

const alerts: {label: string, icon?: string, color?: string, options: Record<string, unknown>}[] = [
  {label: 'Semplice', icon: 'i-ph-info', options: {title: 'Fatto', message: 'Operazione completata.'}},
  {label: 'Errore', icon: 'i-ph-warning-circle', color: 'error', options: {title: 'Errore', message: 'Qualcosa è andato storto. Riprova.', icon: 'i-ph-warning-circle', confirmColor: 'error'}},
  {label: 'Con icona', icon: 'i-ph-hand-waving', options: {title: 'Benvenuto', message: 'Grazie per aver provato Stem.', icon: 'i-ph-hand-waving', confirmLabel: 'Inizia'}},
]

const headers: {label: string, props: Record<string, unknown>, actions?: boolean}[] = [
  {label: 'normale', props: {title: 'Impostazioni'}},
  {label: 'con descrizione', props: {title: 'Impostazioni', description: 'Nome, visibilità e membri.'}},
  {label: 'con icona', props: {title: 'Impostazioni', description: 'Nome, visibilità e membri.', icon: 'i-ph-gear'}},
  {label: 'compact', props: {title: 'Impostazioni', compact: true}},
  {label: 'compact con icona', props: {title: 'Impostazioni', description: 'Nome, visibilità e membri.', icon: 'i-ph-gear', compact: true}},
  {label: 'con azioni', props: {title: 'Documento.pdf', compact: true}, actions: true},
  {label: 'titolo lungo, troncato', props: {title: 'Relazione trimestrale sull\'andamento dei progetti del secondo semestre'}},
  {label: 'titolo lungo, wrap', props: {title: 'Relazione trimestrale sull\'andamento dei progetti del secondo semestre', wrap: true}},
  {label: 'senza close', props: {title: 'Impostazioni', closeable: false}},
]

const modalButtonSizes = ['xs', 'sm', 'md', 'lg', 'xl']

const confirmCode = `const {confirm} = useConfirmModal()

await confirm({
  title: 'Eliminare il progetto?',
  message: "L'operazione non si può annullare.",
  label: 'Elimina',
  destructive: true,
  confirmMatch: 'stem', // facoltativo: il testo da digitare
  onConfirm: async () => { await remove() },
})`

const alertCode = `const {alert} = useAlertModal()

await alert('Operazione completata.')
await alert({title: 'Errore', message: 'Riprova.', icon: 'i-ph-warning-circle', confirmColor: 'error'})`
</script>

<template>
  <ShowcasePage
      title="Modal"
      wraps="USlideover"
      description="La modale di Stem: uno slideover dall'alto con header, body e footer già impaginati. Sotto sm diventa un foglio dal basso."
  >
    <ShowcasePlayground v-model="state" tag="SModal" :controls="controls" code-extra='v-model:open="open"'>
      <template #default="{props, state: s, mode}">
        <PortalScope :mode="mode">
          <SButton label="Apri" icon="i-ph-arrow-square-out" @click="open[mode] = true"/>
          <SModal v-bind="props" v-model:open="open[mode]">
            <template v-if="s.actions" #actions>
              <SModalButton icon="i-ph-arrow-square-out" aria-label="Apri a parte"/>
              <SModalButton icon="i-ph-trash" label="Rimuovi"/>
            </template>
            <template v-if="s.afterHeader" #after-header>
              <div class="px-6 pb-4 text-sm text-(--ui-text-muted)">Slot after-header: tab, filtri, una barra sotto il titolo.</div>
            </template>
            <template v-if="s.body !== 'nessuno'" #body>
              <div class="space-y-4 p-6">
                <UFormField label="Nome">
                  <SInput model-value="Stem" class="w-full"/>
                </UFormField>
                <UFormField label="Visibilità">
                  <SSelect model-value="team" :items="[{label: 'Solo io', value: 'me'}, {label: 'Team', value: 'team'}, {label: 'Pubblico', value: 'public'}]" class="w-full"/>
                </UFormField>
                <template v-if="s.body === 'lungo'">
                  <p v-for="n in 12" :key="n" class="text-sm text-(--ui-text-muted)">
                    Paragrafo {{ n }}. Il corpo scorre dentro la modale, che non supera l'altezza dello schermo: header e footer restano fermi.
                  </p>
                </template>
              </div>
            </template>
            <template #footer="{button, primary}">
              <SModalButton v-bind="primary" label="Salva" @click="open[mode] = false"/>
              <SModalButton v-bind="button" label="Annulla" @click="open[mode] = false"/>
            </template>
          </SModal>
        </PortalScope>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Header"
        description="SModalHeader da solo, fuori dalla modale: le sue varianti affiancate."
    >
      <ShowcaseStage body-class="grid grid-cols-1 gap-6 p-8 lg:grid-cols-2">
        <div v-for="h in headers" :key="h.label" class="space-y-1.5">
          <p class="font-mono text-[10px] text-(--ui-text-dimmed)">{{ h.label }}</p>
          <div class="s-corner overflow-hidden bg-(--ui-bg) shadow-xl ring-1 ring-black/5 [--s-radius:16px] dark:ring-white/10">
            <SModalHeader v-bind="h.props">
              <template v-if="h.actions" #actions>
                <SModalButton icon="i-ph-download-simple" label="Scarica"/>
              </template>
            </SModalHeader>
          </div>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="ModalButton"
        description="Il pulsante dell'header: un SButton soft e rounded, sm (32px) di default come l'header della modale; size e scala sono quelle di SButton."
    >
      <ShowcaseScale :items="modalButtonSizes">
        <template #item="{item}">
          <SModalButton :size="item as any" icon="i-ph-arrow-square-out" aria-label="Apri a parte"/>
        </template>
      </ShowcaseScale>
      <ShowcaseScale :items="modalButtonSizes">
        <template #item="{item}">
          <SModalButton :size="item as any" icon="i-ph-trash" label="Rimuovi"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Footer"
        description="SModalFooter, sulle regole dell'alert: padding due gradini sopra la size (md: 14px), pulsanti SModalButton della size, space-y un gradino sotto, distanti un gradino meno del padding."
    >
      <ShowcaseStage body-class="grid grid-cols-1 gap-6 p-8 lg:grid-cols-2">
        <div v-for="sep in [true, false]" :key="String(sep)" class="space-y-1.5">
          <p class="font-mono text-[10px] text-(--ui-text-dimmed)">separator {{ sep ? 'sì' : 'no' }}</p>
          <div class="s-corner overflow-hidden bg-(--ui-bg) shadow-xl ring-1 ring-black/5 [--s-radius:16px] dark:ring-white/10">
            <div class="h-16"/>
            <SModalFooter v-slot="{button, primary}" :separator="sep">
              <SModalButton v-bind="primary" label="Salva"/>
              <SModalButton v-bind="button" label="Annulla"/>
            </SModalFooter>
          </div>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Width"
        description="La larghezza massima, da sm a full; un numero la fissa in px. size è la scala, che passa a tutto il contenuto."
    >
      <ShowcaseStage>
        <template #default="{mode}">
          <PortalScope :mode="mode">
            <template v-for="s in [...sizes, 480]" :key="s">
              <SButton :label="String(s)" variant="soft" size="sm" @click="sizeOpen[`${mode}-${s}`] = true"/>
              <SModal v-model:open="sizeOpen[`${mode}-${s}`]" :width="s as any" :title="`width ${s}`" description="La larghezza cambia, header e footer restano uguali.">
                <template #body>
                  <p class="p-6 text-sm text-(--ui-text-muted)">Contenuto della modale.</p>
                </template>
                <template #footer="{button}">
                  <SModalButton v-bind="button" label="Chiudi" @click="sizeOpen[`${mode}-${s}`] = false"/>
                </template>
              </SModal>
            </template>
          </PortalScope>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Side"
        description="Il lato da cui entra. Sotto sm la modale è sempre un foglio dal basso."
    >
      <ShowcaseStage>
        <template #default="{mode}">
          <PortalScope :mode="mode">
            <template v-for="s in sides" :key="s">
              <SButton :label="s" variant="soft" size="sm" @click="sideOpen[`${mode}-${s}`] = true"/>
              <SModal v-model:open="sideOpen[`${mode}-${s}`]" :side="s as any" :title="`side ${s}`" description="Entra da questo lato.">
                <template #body>
                  <p class="p-6 text-sm text-(--ui-text-muted)">Contenuto della modale.</p>
                </template>
                <template #footer="{button}">
                  <SModalButton v-bind="button" label="Chiudi" @click="sideOpen[`${mode}-${s}`] = false"/>
                </template>
              </SModal>
            </template>
          </PortalScope>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Annidata"
        description="Una modale aperta da un'altra: si impila sopra, e la chiusura torna alla prima."
    >
      <ShowcaseStage>
        <template #default="{mode}">
          <PortalScope :mode="mode">
            <SButton label="Apri" icon="i-ph-stack" variant="soft" @click="nestedOpen[mode] = true"/>
            <SModal v-model:open="nestedOpen[mode]" title="Prima modale" description="Da qui se ne apre un'altra." :footer="false">
              <template #body>
                <div class="flex flex-wrap gap-3 p-6">
                  <SDropdownMenu :items="[{label: 'Modifica', icon: 'i-ph-pencil-simple'}, {label: 'Duplica', icon: 'i-ph-copy'}, {type: 'separator'}, {label: 'Elimina', icon: 'i-ph-trash'}]">
                    <SButton label="Menu" variant="soft" caret/>
                  </SDropdownMenu>
                  <SButton label="Apri la seconda" icon="i-ph-stack" variant="soft" @click="innerOpen[mode] = true"/>
                </div>
                <SModal v-model:open="innerOpen[mode]" title="Seconda modale" width="sm">
                  <template #body>
                    <p class="p-6 text-sm text-(--ui-text-muted)">Sopra la prima.</p>
                  </template>
                  <template #footer="{button}">
                    <SModalButton v-bind="button" label="Chiudi" @click="innerOpen[mode] = false"/>
                  </template>
                </SModal>
              </template>
            </SModal>
          </PortalScope>
        </template>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Conferma"
        description="SConfirmModal, aperta con useConfirmModal().confirm({...}) o da SButton con on-confirm. Il pulsante resta in caricamento finché on-confirm non si risolve."
    >
      <ShowcaseStage>
        <template #default="{mode}">
          <SButton
              v-for="c in confirms"
              :key="c.label"
              :label="c.label"
              :icon="c.icon"
              :color="c.destructive ? 'error' : undefined"
              variant="soft"
              @click="confirm(mode, c.options)"
          />
        </template>
      </ShowcaseStage>
      <ShowcaseCode :code="confirmCode"/>
    </ShowcaseSection>

    <ShowcaseSection
        title="Avviso"
        description="SAlertModal, un messaggio con un solo pulsante, aperta con useAlertModal().alert(...)."
    >
      <ShowcaseStage>
        <template #default="{mode}">
          <SButton
              v-for="a in alerts"
              :key="a.label"
              :label="a.label"
              :icon="a.icon"
              :color="a.color as any"
              variant="soft"
              @click="alert(mode, a.options)"
          />
        </template>
      </ShowcaseStage>
      <ShowcaseCode :code="alertCode"/>
    </ShowcaseSection>
  </ShowcasePage>
</template>
