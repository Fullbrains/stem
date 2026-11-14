<script setup lang="ts">
import theme from '#build/ui/input'
import formFieldTheme from '#build/ui/form-field'
import type {ShowcaseControl} from '~/utils/showcase-controls'

const colors = themeKeys(theme, 'color')
const variants = themeKeys(theme, 'variant')
const sizes = themeKeys(theme, 'size')
const formFieldSizes = themeKeys(formFieldTheme, 'size')

const icons = [
  {label: 'nessuna', value: undefined},
  {label: 'magnifying-glass', value: 'i-ph-magnifying-glass'},
  {label: 'envelope', value: 'i-ph-envelope'},
  {label: 'lock', value: 'i-ph-lock'},
  {label: 'user', value: 'i-ph-user'},
  {label: 'at', value: 'i-ph-at'},
  {label: 'calendar', value: 'i-ph-calendar'},
  {label: 'x', value: 'i-ph-x'},
]

const avatarSrc = 'https://github.com/benjamincanac.png'

const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'variant', type: 'select', options: variants, default: 'outline'},
  {group: 'Aspetto', key: 'color', type: 'select', options: colors, default: 'primary'},
  {group: 'Aspetto', key: 'size', type: 'select', options: sizes, default: 'md'},

  {group: 'Contenuto', key: 'placeholder', type: 'text', initial: 'Cerca un progetto', placeholder: 'nessuno'},
  {group: 'Contenuto', key: 'type', type: 'select', default: 'text', options: ['text', 'email', 'password', 'number', 'search', 'date']},
  {group: 'Contenuto', key: 'icon', type: 'select', options: icons, initial: 'i-ph-magnifying-glass'},
  {group: 'Contenuto', key: 'trailingIcon', label: 'trailing-icon', type: 'select', options: icons},
  {group: 'Contenuto', key: 'avatar', type: 'boolean', prop: false},

  {group: 'Stato', key: 'loading', type: 'boolean'},
  {group: 'Stato', key: 'disabled', type: 'boolean'},
  {group: 'Stato', key: 'readonly', type: 'boolean'},
  {group: 'Stato', key: 'required', type: 'boolean'},
  {group: 'Stato', key: 'highlight', type: 'boolean'},
  {group: 'Stato', key: 'fixed', type: 'boolean'},
  ...scaleControls(),
]

const state = useCookie<Record<string, any>>('showcase-input', {default: () => controlDefaults(controls)})

const value = ref('')
const filled = ref('Stem')

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
  if (state.value.avatar) out.avatar = {src: avatarSrc}
  return out
})

const codeExtra = computed(() => [
  state.value.avatar ? `:avatar="{src: '${avatarSrc}'}"` : '',
  'v-model="value"',
].filter(Boolean).join(' '))

const states: Record<string, Record<string, unknown>> = {
  'vuoto': {},
  'con valore': {modelValue: 'Stem'},
  'disabled': {disabled: true, modelValue: 'Stem'},
  'readonly': {readonly: true, modelValue: 'Stem'},
  'loading': {loading: true},
  'highlight': {highlight: true},
}

const iconCases: Record<string, Record<string, unknown>> = {
  'nessuna': {icon: undefined, trailingIcon: undefined},
  'leading': {icon: 'i-ph-magnifying-glass', trailingIcon: undefined},
  'trailing': {icon: undefined, trailingIcon: 'i-ph-at'},
  'entrambe': {icon: 'i-ph-envelope', trailingIcon: 'i-ph-check'},
  'loading leading': {icon: 'i-ph-magnifying-glass', loading: true},
  'loading trailing': {trailingIcon: 'i-ph-at', loading: true, leading: false, trailing: true},
  'avatar': {icon: undefined, avatar: {src: avatarSrc}},
}
</script>

<template>
  <ShowcasePage
      title="Input"
      wraps="SInput"
      description="Il campo di testo. Stem ridisegna bordi, sfondi e anello di focus per primary, error e success; i colori restanti sono quelli di Nuxt UI."
  >
    <ShowcasePlayground v-model="state" tag="SInput" :controls="controls" :code-extra="codeExtra">
      <template #default="{props}">
        <SInput v-bind="props" v-model="value" :avatar="state.avatar ? {src: avatarSrc} : undefined"/>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Variant × color"
        description="Tutte le combinazioni, alla size e con le opzioni scelte sopra. Clic su un campo per vedere il focus."
    >
      <ShowcaseMatrix :rows="variants" :cols="colors">
        <template #cell="{row, col}">
          <SInput v-bind="without(current, 'variant', 'color', 'placeholder')" :variant="row as any" :color="col as any" :placeholder="col" class="w-40"/>
        </template>
      </ShowcaseMatrix>
    </ShowcaseSection>

    <ShowcaseSection
        title="Size"
        description="Altezza × larghezza dell'input; il padding sta sul campo interno, non sul contenitore misurato."
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <SInput v-bind="without(current, 'size')" :size="item as any" class="w-44"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Input, Select e Button alla stessa size"
        description="Per ogni size le altezze devono coincidere: la regola d'oro vale per tutti i controlli."
    >
      <ShowcaseStage body-class="overflow-x-auto p-6">
        <table class="mx-auto border-separate border-spacing-x-6 border-spacing-y-4">
          <thead>
            <tr>
              <th/>
              <th v-for="c in ['SInput', 'SSelect', 'SButton', 'SButton icona']" :key="c" class="text-center font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ c }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in sizes" :key="s">
              <th class="pr-2 text-right font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ s }}</th>
              <td class="text-center align-top">
                <ShowcaseMeasure labels>
                  <SInput :size="s as any" :variant="current.variant as any" :color="current.color as any" icon="i-ph-magnifying-glass" placeholder="Cerca" class="w-40"/>
                </ShowcaseMeasure>
              </td>
              <td class="text-center align-top">
                <ShowcaseMeasure labels>
                  <SSelect :size="s as any" :variant="current.variant as any" :color="current.color as any" :items="['Tutti', 'Attivi']" default-value="Tutti" class="w-32"/>
                </ShowcaseMeasure>
              </td>
              <td class="text-center align-top">
                <ShowcaseMeasure labels>
                  <SButton :size="s as any" label="Cerca" icon="i-ph-magnifying-glass"/>
                </ShowcaseMeasure>
              </td>
              <td class="text-center align-top">
                <ShowcaseMeasure labels>
                  <SButton :size="s as any" icon="i-ph-magnifying-glass" variant="soft"/>
                </ShowcaseMeasure>
              </td>
            </tr>
          </tbody>
        </table>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="FieldGroup"
        description="Input e pulsante incollati: gli angoli interni si azzerano e uno scarto d'altezza salta all'occhio."
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <UFieldGroup :size="item as any">
            <SInput v-bind="without(current, 'size', 'trailingIcon')" class="w-40"/>
            <SButton icon="i-ph-arrow-right" label="Vai"/>
          </UFieldGroup>
        </template>
      </ShowcaseScale>
      <ShowcaseStage>
        <UFieldGroup>
          <SButton label="https://" variant="soft" color="secondary"/>
          <SInput placeholder="stem.dev" class="w-40"/>
        </UFieldGroup>
        <UFieldGroup>
          <SInput placeholder="Importo" type="number" class="w-28"/>
          <SSelect :items="['EUR', 'USD']" default-value="EUR" class="w-24"/>
        </UFieldGroup>
        <UFieldGroup>
          <SInput icon="i-ph-magnifying-glass" placeholder="Cerca" class="w-40"/>
          <SButton icon="i-ph-faders" variant="soft"/>
          <SButton label="Cerca"/>
        </UFieldGroup>
        <UFieldGroup orientation="vertical" class="w-48">
          <SInput placeholder="Nome"/>
          <SInput placeholder="Email"/>
          <SButton label="Iscriviti" block/>
        </UFieldGroup>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Icone"
        description="Leading, trailing, entrambe, lo spinner di caricamento al posto dell'icona e l'avatar."
    >
      <ShowcaseScale :items="Object.keys(iconCases)">
        <template #item="{item}">
          <SInput v-bind="{...without(current, 'icon', 'trailingIcon', 'loading'), ...iconCases[item]}" class="w-44"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Stati"
        description="Vuoto, compilato, disabilitato, sola lettura, in caricamento ed evidenziato."
    >
      <ShowcaseScale :items="Object.keys(states)">
        <template #item="{item}">
          <SInput v-bind="{...without(current, 'disabled', 'readonly', 'loading', 'highlight'), ...states[item]}" class="w-44"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="FormField"
        description="Etichetta, descrizione, hint, help ed errore attorno all'input. Con error il campo prende il colore error."
    >
      <ShowcaseStage body-class="grid grid-cols-2 gap-6 p-8 lg:grid-cols-3">
        <UFormField label="Email" description="Useremo questo indirizzo per le notifiche.">
          <SInput v-bind="without(current, 'icon')" icon="i-ph-envelope" placeholder="nome@esempio.it" class="w-full"/>
        </UFormField>
        <UFormField label="Password" hint="Almeno 8 caratteri" required>
          <SInput v-bind="without(current, 'icon', 'type')" icon="i-ph-lock" type="password" class="w-full"/>
        </UFormField>
        <UFormField label="Nome utente" help="Visibile a tutto il team.">
          <SInput v-bind="without(current, 'icon')" v-model="filled" icon="i-ph-user" class="w-full"/>
        </UFormField>
        <UFormField label="Dominio" error="Questo dominio è già in uso.">
          <SInput v-bind="without(current, 'icon', 'color')" icon="i-ph-at" model-value="stem" class="w-full"/>
        </UFormField>
        <UFormField label="Disabilitato" description="Il campo non si può modificare.">
          <SInput v-bind="current" disabled class="w-full"/>
        </UFormField>
        <UFormField label="Orizzontale" description="orientation horizontal" orientation="horizontal">
          <SInput v-bind="current" class="w-40"/>
        </UFormField>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="FormField × size"
        description="La size del FormField passa all'input: etichetta e campo crescono insieme."
    >
      <ShowcaseScale :items="formFieldSizes">
        <template #item="{item}">
          <UFormField :size="item as any" label="Etichetta" description="Descrizione" hint="hint" class="w-48">
            <SInput v-bind="without(current, 'size')" class="w-full"/>
          </UFormField>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>
  </ShowcasePage>
</template>
