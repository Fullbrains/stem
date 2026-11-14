<script setup lang="ts">
import theme from '#build/ui/select'
import type {ShowcaseControl} from '~/utils/showcase-controls'

const colors = themeKeys(theme, 'color')
const variants = themeKeys(theme, 'variant')
const sizes = themeKeys(theme, 'size')

const USelect = resolveComponent('SSelect')
const USelectMenu = resolveComponent('SSelectMenu')
const UInputMenu = resolveComponent('SInputMenu')
const components = {USelect, USelectMenu, UInputMenu} as Record<string, any>
type Tag = 'SSelect' | 'SSelectMenu' | 'SInputMenu'

const items = [
  {label: 'Backlog', value: 'backlog', icon: 'i-ph-circle-dashed'},
  {label: 'Da fare', value: 'todo', icon: 'i-ph-circle'},
  {label: 'In corso', value: 'in_progress', icon: 'i-ph-spinner', disabled: true},
  {label: 'In revisione', value: 'review', icon: 'i-ph-eye'},
  {label: 'Fatto', value: 'done', icon: 'i-ph-check-circle'},
]

const grouped = [
  [{type: 'label', label: 'Aperti'}, ...items.slice(0, 2)],
  [{type: 'separator'}],
  [{type: 'label', label: 'Chiusi'}, ...items.slice(3)],
]

const withDescription = [
  {label: 'Viewer', value: 'viewer', description: 'Può solo leggere.'},
  {label: 'Editor', value: 'editor', description: 'Può modificare i contenuti.'},
  {label: 'Admin', value: 'admin', description: 'Gestisce membri e fatturazione.'},
]

const icons = [
  {label: 'nessuna', value: undefined},
  {label: 'list', value: 'i-ph-list'},
  {label: 'funnel', value: 'i-ph-funnel'},
  {label: 'tag', value: 'i-ph-tag'},
  {label: 'user', value: 'i-ph-user'},
]

const trailingIcons = [
  {label: 'default', value: undefined},
  {label: 'caret-up-down', value: 'i-ph-caret-up-down'},
  {label: 'caret-down', value: 'i-ph-caret-down'},
]

const baseControls: ShowcaseControl[] = [
  {group: 'Componente', key: 'component', label: 'componente', type: 'select', prop: false, default: 'SSelect', options: ['SSelect', 'SSelectMenu', 'SInputMenu']},

  {group: 'Aspetto', key: 'variant', type: 'select', options: variants, default: 'outline'},
  {group: 'Aspetto', key: 'color', type: 'select', options: colors, default: 'primary'},
  {group: 'Aspetto', key: 'size', type: 'select', options: sizes, default: 'md'},

  {group: 'Contenuto', key: 'placeholder', type: 'text', initial: 'Scegli uno stato', placeholder: 'nessuno'},
  {group: 'Contenuto', key: 'icon', type: 'select', options: icons, initial: 'i-ph-list'},
  {group: 'Contenuto', key: 'trailingIcon', label: 'trailing-icon', type: 'select', options: trailingIcons},
  {group: 'Contenuto', key: 'arrow', type: 'boolean'},
]

const menuControls: ShowcaseControl[] = [
  {group: 'Menu', key: 'multiple', type: 'boolean'},
  {group: 'Menu', key: 'clear', type: 'boolean'},
  {group: 'Menu', key: 'createItem', label: 'create-item', type: 'boolean'},
]

const stateControls: ShowcaseControl[] = [
  {group: 'Stato', key: 'loading', type: 'boolean'},
  {group: 'Stato', key: 'disabled', type: 'boolean'},
  {group: 'Stato', key: 'required', type: 'boolean'},
  {group: 'Stato', key: 'highlight', type: 'boolean'},
  {group: 'Stato', key: 'fixed', type: 'boolean'},
]

const allControls: ShowcaseControl[] = [
  ...baseControls,
  {group: 'Menu', key: 'multiple', type: 'boolean'},
  {group: 'Menu', key: 'searchInput', label: 'search-input', type: 'boolean', default: true},
  {group: 'Menu', key: 'mode', type: 'select', default: 'combobox', options: ['combobox', 'autocomplete']},
  ...menuControls.slice(1),
  ...stateControls,
]

const state = useShowcaseState<Record<string, any>>('select', () => controlDefaults(allControls))

const tag = computed<Tag>(() => (state.value.component as Tag) ?? 'SSelect')

// Ogni componente ha il suo pannello: si mostrano solo le prop che accetta.
const controls = computed<ShowcaseControl[]>(() => {
  if (tag.value === 'SSelect') {
    return [...baseControls, menuControls[0]!, ...stateControls, ...scaleControls()]
  }
  if (tag.value === 'SSelectMenu') {
    return [
      ...baseControls,
      menuControls[0]!,
      {group: 'Menu', key: 'searchInput', label: 'search-input', type: 'boolean', default: true},
      ...menuControls.slice(1),
      ...stateControls,
      ...scaleControls(),
    ]
  }
  return [
    ...baseControls,
    menuControls[0]!,
    {group: 'Menu', key: 'mode', type: 'select', default: 'combobox', options: ['combobox', 'autocomplete']},
    ...menuControls.slice(1),
    ...stateControls,
    ...scaleControls(),
  ]
})

const single = ref<string | undefined>('todo')
const many = ref<string[]>(['todo', 'review'])

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

// Le prop che valgono per tutti e tre: per matrice e scale.
const shared = computed(() => without(current.value, 'multiple', 'clear', 'createItem', 'searchInput', 'mode'))

const codeExtra = computed(() => `:items="items" value-key="value" v-model="${state.value.multiple ? 'values' : 'value'}"`)

function model(multiple: unknown) {
  return multiple ? many.value : single.value
}

function setModel(multiple: unknown, v: any) {
  if (multiple) many.value = v ?? []
  else single.value = v
}

const states: Record<string, Record<string, unknown>> = {
  'vuoto': {modelValue: undefined},
  'con valore': {modelValue: 'todo'},
  'disabled': {disabled: true, modelValue: 'todo'},
  'loading': {loading: true, modelValue: 'todo'},
  'highlight': {highlight: true, modelValue: 'todo'},
}

const tags: Tag[] = ['SSelect', 'SSelectMenu', 'SInputMenu']
</script>

<template>
  <ShowcasePage
      title="Select"
      wraps="USelect · USelectMenu · UInputMenu"
      description="I tre campi a scelta: Select nativo di Reka, SelectMenu con ricerca, InputMenu con l'input sempre scrivibile. Stessa base di Input, più l'anello quando il menu è aperto."
  >
    <ShowcasePlayground v-model="state" :tag="tag" :controls="controls" :code-extra="codeExtra">
      <template #default="{props}">
        <component
            :is="components[tag]"
            v-bind="props"
            :key="`${tag}-${!!props.multiple}`"
            :items="items"
            value-key="value"
            :model-value="model(props.multiple)"
            class="w-60"
            @update:model-value="(v: any) => setModel(props.multiple, v)"
        />
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Variant × color"
        :description="`${tag}, alla size e con le opzioni scelte sopra.`"
    >
      <ShowcaseMatrix :rows="variants" :cols="colors">
        <template #cell="{row, col}">
          <component
              :is="components[tag]"
              v-bind="without(shared, 'variant', 'color', 'placeholder')"
              :variant="row"
              :color="col"
              :placeholder="col"
              :items="items"
              value-key="value"
              class="w-40"
          />
        </template>
      </ShowcaseMatrix>
    </ShowcaseSection>

    <ShowcaseSection
        title="Size"
        :description="`${tag} con un valore scelto: altezza × larghezza, padding, testo e icona.`"
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <component :is="components[tag]" v-bind="without(shared, 'size')" :size="item" :items="items" value-key="value" default-value="todo" class="w-44"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="I tre a confronto, con Input e Button"
        description="Per ogni size, le altezze di Select, SelectMenu, InputMenu, Input e Button devono coincidere."
    >
      <ShowcaseStage body-class="overflow-x-auto p-6">
        <table class="mx-auto border-separate border-spacing-x-5 border-spacing-y-4">
          <thead>
            <tr>
              <th/>
              <th v-for="c in [...tags, 'SInput', 'SButton']" :key="c" class="text-center font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ c }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in sizes" :key="s">
              <th class="pr-2 text-right font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ s }}</th>
              <td v-for="t in tags" :key="t" class="text-center align-top">
                <ShowcaseMeasure labels>
                  <component :is="components[t]" :size="s" :variant="shared.variant" :color="shared.color" icon="i-ph-list" :items="items" value-key="value" default-value="todo" class="w-36"/>
                </ShowcaseMeasure>
              </td>
              <td class="text-center align-top">
                <ShowcaseMeasure labels>
                  <SInput :size="s as any" :variant="shared.variant as any" :color="shared.color as any" icon="i-ph-list" placeholder="Da fare" class="w-36"/>
                </ShowcaseMeasure>
              </td>
              <td class="text-center align-top">
                <ShowcaseMeasure labels>
                  <SButton :size="s as any" label="Applica"/>
                </ShowcaseMeasure>
              </td>
            </tr>
          </tbody>
        </table>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Multiple"
        description="Più valori: Select e SelectMenu li elencano separati da virgola, InputMenu li mostra come tag."
    >
      <ShowcaseStage>
        <UFormField v-for="t in tags" :key="t" :label="t">
          <component :is="components[t]" v-bind="without(shared, 'placeholder')" v-model="many" multiple :items="items" value-key="value" placeholder="Scegli" class="w-60"/>
        </UFormField>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Gruppi, etichette e descrizioni"
        description="Voci raggruppate con label e separator; voci con descrizione; la voce disabilitata."
    >
      <ShowcaseStage>
        <UFormField v-for="t in tags" :key="t" :label="`${t} a gruppi`">
          <component :is="components[t]" v-bind="shared" :items="grouped" value-key="value" class="w-52"/>
        </UFormField>
        <UFormField label="USelectMenu con descrizioni">
          <SSelectMenu v-bind="shared" :items="withDescription" value-key="value" default-value="editor" class="w-52"/>
        </UFormField>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Menu: ricerca, clear e nuove voci"
        description="Le opzioni dei menu con ricerca: senza campo di ricerca, con il pulsante per svuotare, con la voce per creare un valore nuovo."
    >
      <ShowcaseStage>
        <UFormField label="search-input false">
          <SSelectMenu v-bind="shared" :search-input="false" :items="items" value-key="value" default-value="todo" class="w-52"/>
        </UFormField>
        <UFormField label="clear">
          <SSelectMenu v-bind="shared" clear :items="items" value-key="value" default-value="todo" class="w-52"/>
        </UFormField>
        <UFormField label="InputMenu clear">
          <SInputMenu v-bind="shared" clear :items="items" value-key="value" default-value="todo" class="w-52"/>
        </UFormField>
        <UFormField label="InputMenu autocomplete">
          <SInputMenu v-bind="shared" mode="autocomplete" :items="items.map(i => i.label)" class="w-52"/>
        </UFormField>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Stati"
        :description="`${tag}: vuoto, compilato, disabilitato, in caricamento ed evidenziato.`"
    >
      <ShowcaseScale :items="Object.keys(states)">
        <template #item="{item}">
          <component
              :is="components[tag]"
              v-bind="{...without(shared, 'disabled', 'loading', 'highlight'), ...states[item]}"
              :items="items"
              value-key="value"
              class="w-44"
          />
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="FieldGroup"
        description="Un select incollato a un input o a un pulsante: gli angoli interni si azzerano."
    >
      <ShowcaseStage>
        <UFieldGroup v-for="t in tags" :key="t">
          <component :is="components[t]" v-bind="without(shared, 'icon', 'placeholder')" :items="items" value-key="value" default-value="todo" class="w-36"/>
          <SButton icon="i-ph-plus" variant="soft"/>
        </UFieldGroup>
        <UFieldGroup>
          <SInput v-bind="without(shared, 'icon')" placeholder="Titolo" class="w-36"/>
          <SSelect v-bind="without(shared, 'icon', 'placeholder')" :items="items" value-key="value" default-value="todo" class="w-36"/>
        </UFieldGroup>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
