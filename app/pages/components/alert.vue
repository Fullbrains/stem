<script setup lang="ts">
import theme from '#build/ui/alert'
import toastTheme from '#build/ui/toast'
import type {ShowcaseControl} from '~/utils/showcase-controls'

const colors = themeKeys(theme, 'color')
const variants = themeKeys(theme, 'variant')
const orientations = themeKeys(theme, 'orientation')
const toastColors = themeKeys(toastTheme, 'color')

const icons = [
  {label: 'nessuna', value: undefined},
  {label: 'info', value: 'i-ph-info'},
  {label: 'check-circle', value: 'i-ph-check-circle'},
  {label: 'warning', value: 'i-ph-warning'},
  {label: 'warning-circle', value: 'i-ph-warning-circle'},
  {label: 'bell', value: 'i-ph-bell'},
  {label: 'lightbulb', value: 'i-ph-lightbulb'},
]

const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'variant', type: 'select', options: variants, default: 'solid'},
  {group: 'Aspetto', key: 'color', type: 'select', options: colors, default: 'primary'},
  {group: 'Aspetto', key: 'orientation', type: 'select', options: orientations, default: 'vertical'},
  {group: 'Aspetto', key: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'sm'},

  {group: 'Contenuto', key: 'title', type: 'text', initial: 'Modifiche salvate', placeholder: 'nessuno'},
  {group: 'Contenuto', key: 'description', type: 'text', initial: 'Le vedranno tutti i membri del progetto.', placeholder: 'nessuna'},
  {group: 'Contenuto', key: 'icon', type: 'select', options: icons, initial: 'i-ph-info'},
  {group: 'Contenuto', key: 'avatar', type: 'boolean', prop: false},

  {group: 'Azioni', key: 'actions', type: 'select', prop: false, default: 0, options: [
    {label: 'nessuna', value: 0}, {label: 'una', value: 1}, {label: 'due', value: 2},
  ]},
  {group: 'Azioni', key: 'close', type: 'boolean'},

  // L'alert resta squircle: niente pillola.
  ...scaleControls().filter(c => c.key !== 'rounded'),
]

const state = useShowcaseState<Record<string, any>>('alert', () => controlDefaults(controls))

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

const allActions = [
  {label: 'Annulla', color: 'neutral' as const, variant: 'outline' as const},
  {label: 'Riprova', color: 'neutral' as const, variant: 'subtle' as const},
]

function actionsFor(n: number | undefined) {
  return n ? allActions.slice(0, n) : undefined
}

const actions = computed(() => actionsFor(state.value.actions))
const avatar = computed(() => (state.value.avatar ? {src: 'https://i.pravatar.cc/96?img=12', alt: 'Anna'} : undefined))

const codeExtra = computed(() => [
  state.value.actions ? ':actions="actions"' : '',
  state.value.avatar ? ':avatar="{src: \'…\'}"' : '',
].filter(Boolean).join(' '))

// Toast: stesse opzioni del playground, dove UToast le accetta.
const toast = useToast()

function showToast(extra: Record<string, unknown> = {}) {
  toast.add({
    title: (current.value.title as string) ?? undefined,
    description: (current.value.description as string) ?? undefined,
    icon: current.value.icon as string | undefined,
    color: current.value.color as any,
    orientation: current.value.orientation as any,
    close: state.value.close ? undefined : false,
    actions: actions.value,
    avatar: avatar.value,
    ...extra,
  })
}
</script>

<template>
  <ShowcasePage
      title="Alert"
      wraps="UAlert"
      description="Un messaggio dentro la pagina. Stem ritocca solo i colori primary, secondary e neutral; gli altri restano quelli di Nuxt UI. I toast usano le stesse opzioni."
  >
    <ShowcasePlayground v-model="state" tag="SAlert" :controls="controls" :code-extra="codeExtra">
      <template #default="{props}">
        <SAlert v-bind="props" :actions="actions" :avatar="avatar" class="w-[28rem]"/>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Color × variant"
        description="Tutte le combinazioni, con le opzioni scelte sopra."
    >
      <ShowcaseMatrix :rows="colors" :cols="variants">
        <template #cell="{row, col}">
          <SAlert
              v-bind="without(current, 'variant', 'color', 'title', 'orientation')"
              :color="row as any"
              :variant="col as any"
              :title="row"
              class="w-60 text-left"
          />
        </template>
      </ShowcaseMatrix>
    </ShowcaseSection>

    <ShowcaseSection
        title="Orientamento"
        description="vertical mette le azioni sotto il testo, horizontal a destra, centrate."
    >
      <ShowcaseStage body-class="grid gap-4 p-8">
        <SAlert
            v-for="o in orientations"
            :key="o"
            v-bind="without(current, 'orientation')"
            :orientation="o as any"
            :actions="allActions"
            :title="(current.title as string) || o"
            close
        />
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Contenuto"
        description="Solo titolo, solo descrizione, con avatar al posto dell'icona, testo lungo che va a capo."
    >
      <ShowcaseStage body-class="grid gap-4 p-8 sm:grid-cols-2">
        <SAlert v-bind="without(current, 'description')" title="Solo il titolo"/>
        <SAlert v-bind="without(current, 'title')" description="Solo la descrizione, senza titolo."/>
        <SAlert v-bind="without(current, 'icon')" :avatar="{src: 'https://i.pravatar.cc/96?img=12', alt: 'Anna'}" title="Anna ti ha invitato" description="Progetto Stem, ruolo editor."/>
        <SAlert
            v-bind="current"
            title="Un titolo abbastanza lungo da andare a capo su due righe"
            description="Molti documenti hanno solo l'anno: cercare per date esatte li lascia fuori dai risultati, quindi conviene allargare l'intervallo."
        />
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Slot"
        description="title, description e actions accettano markup."
    >
      <ShowcaseStage body-class="grid gap-4 p-8">
        <SAlert v-bind="without(current, 'title', 'description')">
          <template #title>Import <strong>completato</strong></template>
          <template #description>
            128 righe importate, 3 scartate. <a href="#" class="underline underline-offset-2">Vedi il report</a>
          </template>
          <template #actions>
            <SButton label="Apri" size="xs" variant="outline" color="neutral"/>
          </template>
        </SAlert>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Contenuto sotto il testo"
        description="Lo slot di default di SAlert: parte dove parte il testo e, in orizzontale, corre fino al bordo destro, sotto le azioni."
    >
      <ShowcaseStage body-class="grid gap-4 p-8">
        <SAlert
            v-for="o in ['horizontal', 'vertical']"
            :key="o"
            v-bind="without(current, 'orientation', 'title', 'description')"
            :orientation="o as any"
            title="Scegli il formato"
            description="Lo useremo per tutti gli export di questo progetto."
            :actions="actions"
        >
          <div class="mt-2 flex flex-wrap gap-1.5">
            <SButton v-for="f in ['PDF', 'DOCX', 'Markdown', 'CSV']" :key="f" :label="f" size="xs" variant="soft" rounded/>
          </div>
        </SAlert>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Toast"
        description="useToast().add(): appaiono in basso a destra, fuori dai pannelli, quindi solo nel tema della pagina."
    >
      <div class="flex flex-wrap items-center gap-2 rounded-xl p-6 ring-1 ring-gray-200">
        <SButton label="Toast con le opzioni sopra" icon="i-ph-bell" @click="showToast()"/>
        <SButton
            v-for="c in toastColors"
            :key="c"
            :label="c"
            variant="soft"
            size="sm"
            @click="showToast({color: c, title: c})"
        />
        <SButton label="Con progress" variant="outline" color="neutral" size="sm" @click="showToast({duration: 6000, progress: true})"/>
        <SButton label="Senza scadenza" variant="outline" color="neutral" size="sm" @click="showToast({duration: 0, close: undefined})"/>
      </div>
    </ShowcaseSection>
  </ShowcasePage>
</template>
