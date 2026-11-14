<script setup lang="ts">
import checkboxTheme from '#build/ui/checkbox'
import switchTheme from '#build/ui/switch'
import radioTheme from '#build/ui/radio-group'
import type {ShowcaseControl} from '~/utils/showcase-controls'

const colors = themeKeys(checkboxTheme, 'color')
const sizes = themeKeys(checkboxTheme, 'size')
const switchSizes = themeKeys(switchTheme, 'size')
const radioSizes = themeKeys(radioTheme, 'size')
const checkboxVariants = themeKeys(checkboxTheme, 'variant')
const radioVariants = themeKeys(radioTheme, 'variant')
const indicators = themeKeys(checkboxTheme, 'indicator')
const orientations = themeKeys(radioTheme, 'orientation')

const UCheckbox = resolveComponent('SCheckbox')
const USwitch = resolveComponent('SSwitch')
const URadioGroup = resolveComponent('SRadioGroup')
const components = {UCheckbox, USwitch, URadioGroup} as Record<string, any>
type Tag = 'SCheckbox' | 'SSwitch' | 'SRadioGroup'
const tags: Tag[] = ['SCheckbox', 'SSwitch', 'SRadioGroup']

const plans = [
  {label: 'Base', value: 'base', description: 'Fino a 3 progetti.'},
  {label: 'Pro', value: 'pro', description: 'Progetti illimitati.'},
  {label: 'Team', value: 'team', description: 'Membri e ruoli.', disabled: true},
]
const plainPlans = plans.map(({label, value}) => ({label, value}))

const icons = [
  {label: 'default', value: undefined},
  {label: 'check-bold', value: 'i-ph-check-bold'},
  {label: 'x-bold', value: 'i-ph-x-bold'},
  {label: 'star-fill', value: 'i-ph-star-fill'},
]

const common: ShowcaseControl[] = [
  {group: 'Componente', key: 'component', label: 'componente', type: 'select', prop: false, default: 'SCheckbox', options: tags},
  {group: 'Aspetto', key: 'color', type: 'select', options: colors, default: 'primary'},
  {group: 'Aspetto', key: 'size', type: 'select', options: sizes, default: 'md'},
]

const stateControls: ShowcaseControl[] = [
  {group: 'Stato', key: 'disabled', type: 'boolean'},
  {group: 'Stato', key: 'required', type: 'boolean'},
]

const byTag: Record<Tag, ShowcaseControl[]> = {
  UCheckbox: [
    ...common,
    {group: 'Aspetto', key: 'variant', type: 'select', options: checkboxVariants, default: 'list'},
    {group: 'Aspetto', key: 'indicator', type: 'select', options: indicators, default: 'start'},
    {group: 'Contenuto', key: 'label', type: 'text', initial: 'Ricevi le notifiche', placeholder: 'nessuna'},
    {group: 'Contenuto', key: 'description', type: 'text', placeholder: 'nessuna'},
    {group: 'Contenuto', key: 'icon', type: 'select', options: icons},
    {group: 'Stato', key: 'indeterminate', type: 'boolean', prop: false},
    {group: 'Stato', key: 'highlight', type: 'boolean'},
    ...stateControls,
  ],
  USwitch: [
    ...common,
    {group: 'Contenuto', key: 'label', type: 'text', initial: 'Ricevi le notifiche', placeholder: 'nessuna'},
    {group: 'Contenuto', key: 'description', type: 'text', placeholder: 'nessuna'},
    {group: 'Contenuto', key: 'checkedIcon', label: 'checked-icon', type: 'select', options: icons},
    {group: 'Contenuto', key: 'uncheckedIcon', label: 'unchecked-icon', type: 'select', options: icons},
    {group: 'Stato', key: 'loading', type: 'boolean'},
    {group: 'Stato', key: 'highlight', type: 'boolean'},
    ...stateControls,
  ],
  URadioGroup: [
    ...common,
    {group: 'Aspetto', key: 'variant', type: 'select', options: radioVariants, default: 'list'},
    {group: 'Aspetto', key: 'indicator', type: 'select', options: indicators, default: 'start'},
    {group: 'Aspetto', key: 'orientation', type: 'select', options: orientations, default: 'vertical'},
    {group: 'Contenuto', key: 'legend', type: 'text', initial: 'Piano', placeholder: 'nessuna'},
    {group: 'Contenuto', key: 'descriptions', label: 'descrizioni', type: 'boolean', prop: false, initial: true},
    {group: 'Stato', key: 'highlight', type: 'boolean'},
    ...stateControls,
  ],
}

const allControls = [...byTag.UCheckbox, ...byTag.USwitch, ...byTag.URadioGroup]

const state = useShowcaseState<Record<string, any>>('checkbox', () => controlDefaults(allControls))

const tag = computed<Tag>(() => (state.value.component as Tag) ?? 'SCheckbox')
const controls = computed(() => byTag[tag.value])

const checked = ref<boolean | 'indeterminate'>(true)
const on = ref(true)
const plan = ref('pro')

watch(() => state.value.indeterminate, (v) => {
  checked.value = v ? 'indeterminate' : true
})

const codeExtra = computed(() => {
  if (tag.value === 'SRadioGroup') return ':items="plans" v-model="plan"'
  return 'v-model="value"'
})

function without(p: Record<string, unknown>, ...keys: string[]) {
  const out = {...p}
  for (const k of keys) delete out[k]
  return out
}

const current = computed(() => {
  const out: Record<string, unknown> = {}
  for (const c of controls.value) {
    if (c.prop === false) continue
    const v = state.value[c.key]
    if (v !== undefined && v !== '') out[c.key] = v
  }
  return out
})

const checkStates: Record<string, Record<string, unknown>> = {
  'spento': {defaultValue: false},
  'acceso': {defaultValue: true},
  'indeterminate': {defaultValue: 'indeterminate'},
  'disabled': {defaultValue: false, disabled: true},
  'disabled acceso': {defaultValue: true, disabled: true},
  'highlight': {defaultValue: false, highlight: true},
}

const switchStates: Record<string, Record<string, unknown>> = {
  'spento': {defaultValue: false},
  'acceso': {defaultValue: true},
  'loading': {defaultValue: true, loading: true},
  'disabled': {defaultValue: false, disabled: true},
  'disabled acceso': {defaultValue: true, disabled: true},
  'icone': {defaultValue: true, checkedIcon: 'i-ph-check-bold', uncheckedIcon: 'i-ph-x-bold'},
}
</script>

<template>
  <ShowcasePage
      title="Checkbox, Switch e Radio"
      wraps="UCheckbox · USwitch · URadioGroup"
      description="I controlli a scelta binaria o singola. Stem porta lo stato attivo di primary al grigio scuro del pulsante solid e il focus sul ferro."
  >
    <ShowcasePlayground v-model="state" :tag="tag" :controls="controls" :code-extra="codeExtra">
      <template #default="{props}">
        <SCheckbox v-if="tag === 'SCheckbox'" v-bind="props" v-model="checked"/>
        <SSwitch v-else-if="tag === 'SSwitch'" v-bind="props" v-model="on"/>
        <SRadioGroup v-else v-bind="props" v-model="plan" :items="state.descriptions ? plans : plainPlans"/>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Color"
        description="Acceso, per ogni colore. Stem ritocca solo primary."
    >
      <ShowcaseMatrix :rows="tags" :cols="colors">
        <template #cell="{row, col}">
          <SCheckbox v-if="row === 'SCheckbox'" :color="col as any" :size="current.size as any" :default-value="true"/>
          <SSwitch v-else-if="row === 'SSwitch'" :color="col as any" :size="current.size as any" :default-value="true"/>
          <SRadioGroup v-else :color="col as any" :size="current.size as any" :items="[{label: '', value: 'a'}]" default-value="a" class="inline-block"/>
        </template>
      </ShowcaseMatrix>
    </ShowcaseSection>

    <ShowcaseSection
        title="Size · Checkbox"
        description="Quadrato e testo dell'etichetta; con la descrizione sotto."
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <SCheckbox :size="item as any" :color="current.color as any" label="Etichetta" description="Descrizione" :default-value="true"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Size · Switch"
        description="Binario, pallino e testo dell'etichetta."
    >
      <ShowcaseScale :items="switchSizes">
        <template #item="{item}">
          <SSwitch :size="item as any" :color="current.color as any" label="Etichetta" description="Descrizione" :default-value="true"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Size · Radio"
        description="Il gruppo intero, in verticale."
    >
      <ShowcaseScale :items="radioSizes">
        <template #item="{item}">
          <SRadioGroup :size="item as any" :color="current.color as any" :items="plainPlans" default-value="pro"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="I tre alla stessa size"
        description="Per ogni size: checkbox, switch e radio affiancati, con il testo di un input accanto per confrontare il corpo."
    >
      <ShowcaseStage body-class="overflow-x-auto p-6">
        <table class="mx-auto border-separate border-spacing-x-6 border-spacing-y-4">
          <thead>
            <tr>
              <th/>
              <th v-for="c in [...tags, 'SInput']" :key="c" class="text-center font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ c }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in sizes" :key="s">
              <th class="pr-2 text-right font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ s }}</th>
              <td class="text-left align-middle">
                <ShowcaseMeasure labels>
                  <SCheckbox :size="s as any" :color="current.color as any" label="Etichetta" :default-value="true"/>
                </ShowcaseMeasure>
              </td>
              <td class="text-left align-middle">
                <ShowcaseMeasure labels>
                  <SSwitch :size="s as any" :color="current.color as any" label="Etichetta" :default-value="true"/>
                </ShowcaseMeasure>
              </td>
              <td class="text-left align-middle">
                <ShowcaseMeasure labels>
                  <SRadioGroup :size="s as any" :color="current.color as any" :items="[{label: 'Etichetta', value: 'a'}]" default-value="a"/>
                </ShowcaseMeasure>
              </td>
              <td class="text-left align-middle">
                <ShowcaseMeasure labels>
                  <SInput :size="s as any" placeholder="Etichetta" class="w-36"/>
                </ShowcaseMeasure>
              </td>
            </tr>
          </tbody>
        </table>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Stati · Checkbox"
        description="Spento, acceso, indeterminato, disabilitato ed evidenziato."
    >
      <ShowcaseScale :items="Object.keys(checkStates)">
        <template #item="{item}">
          <SCheckbox :key="item" :size="current.size as any" :color="current.color as any" label="Etichetta" v-bind="checkStates[item]"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Stati · Switch"
        description="Spento, acceso, in caricamento, disabilitato e con le icone nel pallino."
    >
      <ShowcaseScale :items="Object.keys(switchStates)">
        <template #item="{item}">
          <SSwitch :key="item" :size="current.size as any" :color="current.color as any" label="Etichetta" v-bind="switchStates[item]"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Variant e indicator"
        description="list è il default; card incornicia ogni voce; table, solo per il radio, le unisce in una tabella. indicator sposta o nasconde il segno."
    >
      <ShowcaseStage body-class="grid grid-cols-3 gap-6 p-8">
        <div v-for="v in radioVariants" :key="v" class="space-y-2">
          <p class="font-mono text-[10px] text-(--ui-text-dimmed)">radio {{ v }}</p>
          <SRadioGroup :variant="v as any" :size="current.size as any" :color="current.color as any" :items="plans" default-value="pro"/>
        </div>
        <div v-for="v in checkboxVariants" :key="`c-${v}`" class="space-y-2">
          <p class="font-mono text-[10px] text-(--ui-text-dimmed)">checkbox {{ v }}</p>
          <SCheckbox :variant="v as any" :size="current.size as any" :color="current.color as any" label="Ricevi le notifiche" description="Una mail per ogni commento." :default-value="true"/>
        </div>
        <div v-for="i in indicators" :key="`i-${i}`" class="space-y-2">
          <p class="font-mono text-[10px] text-(--ui-text-dimmed)">indicator {{ i }}</p>
          <SRadioGroup variant="card" :indicator="i as any" :size="current.size as any" :color="current.color as any" :items="plainPlans" default-value="pro"/>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Radio orizzontale"
        description="orientation horizontal, in list e in card."
    >
      <ShowcaseStage body-class="flex flex-col items-start gap-6 p-8">
        <SRadioGroup orientation="horizontal" :size="current.size as any" :color="current.color as any" :items="plainPlans" default-value="pro" legend="Piano"/>
        <SRadioGroup orientation="horizontal" variant="card" :size="current.size as any" :color="current.color as any" :items="plans" default-value="pro"/>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Nel FormField"
        description="Etichetta ed errore del FormField attorno ai controlli."
    >
      <ShowcaseStage body-class="grid grid-cols-3 gap-6 p-8">
        <UFormField label="Termini" error="Devi accettare i termini." required>
          <SCheckbox label="Accetto i termini di servizio" :size="current.size as any"/>
        </UFormField>
        <UFormField label="Notifiche" description="Puoi cambiarle in ogni momento.">
          <SSwitch label="Email" :size="current.size as any" :color="current.color as any" :default-value="true"/>
        </UFormField>
        <UFormField label="Piano" help="Il piano Team arriva presto.">
          <SRadioGroup :items="plainPlans" :size="current.size as any" :color="current.color as any" default-value="base"/>
        </UFormField>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
