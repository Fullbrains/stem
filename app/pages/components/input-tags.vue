<script setup lang="ts">
import theme from '#build/ui/input-tags'
import type {ShowcaseControl} from '~/utils/showcase-controls'

const colors = themeKeys(theme, 'color')
const variants = themeKeys(theme, 'variant')
const sizes = themeKeys(theme, 'size')

const icons = [
  {label: 'nessuna', value: undefined},
  {label: 'tag', value: 'i-ph-tag'},
  {label: 'hash', value: 'i-ph-hash'},
  {label: 'at', value: 'i-ph-at'},
  {label: 'users', value: 'i-ph-users'},
]

const deleteIcons = [
  {label: 'default', value: undefined},
  {label: 'x', value: 'i-ph-x'},
  {label: 'x-circle', value: 'i-ph-x-circle'},
  {label: 'minus', value: 'i-ph-minus'},
]

const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'variant', type: 'select', options: variants, default: 'outline'},
  {group: 'Aspetto', key: 'color', type: 'select', options: colors, default: 'primary'},
  {group: 'Aspetto', key: 'size', type: 'select', options: sizes, default: 'md'},

  {group: 'Contenuto', key: 'placeholder', type: 'text', initial: 'Aggiungi un tag', placeholder: 'nessuno'},
  {group: 'Contenuto', key: 'icon', type: 'select', options: icons, initial: 'i-ph-tag'},
  {group: 'Contenuto', key: 'trailingIcon', label: 'trailing-icon', type: 'select', options: icons},
  {group: 'Contenuto', key: 'deleteIcon', label: 'delete-icon', type: 'select', options: deleteIcons},

  {group: 'Inserimento', key: 'max', type: 'select', default: 0, options: [{label: 'nessuno', value: 0}, {label: '3', value: 3}, {label: '5', value: 5}]},
  {group: 'Inserimento', key: 'maxLength', label: 'max-length', type: 'select', options: [{label: 'nessuno', value: undefined}, {label: '8', value: 8}, {label: '16', value: 16}]},
  {group: 'Inserimento', key: 'addOnPaste', label: 'add-on-paste', type: 'boolean'},
  {group: 'Inserimento', key: 'addOnTab', label: 'add-on-tab', type: 'boolean'},
  {group: 'Inserimento', key: 'addOnBlur', label: 'add-on-blur', type: 'boolean'},
  {group: 'Inserimento', key: 'duplicate', type: 'boolean'},

  {group: 'Stato', key: 'loading', type: 'boolean'},
  {group: 'Stato', key: 'disabled', type: 'boolean'},
  {group: 'Stato', key: 'required', type: 'boolean'},
  {group: 'Stato', key: 'highlight', type: 'boolean'},
  {group: 'Stato', key: 'fixed', type: 'boolean'},
  ...scaleControls(),
]

const state = useCookie<Record<string, any>>('showcase-input-tags', {default: () => controlDefaults(controls)})

const value = ref(['Vue', 'Nuxt'])
const many = ref(['Vue', 'Nuxt', 'Tailwind', 'Reka UI', 'TypeScript', 'Vite', 'Pinia', 'Vitest'])

function without(p: Record<string, unknown>, ...keys: string[]) {
  const out = {...p}
  for (const k of keys) delete out[k]
  return out
}

const current = computed(() => {
  const out: Record<string, unknown> = {}
  for (const c of controls) {
    const v = state.value[c.key]
    if (v !== undefined && v !== '') out[c.key] = v
  }
  return out
})

// Per matrice e scale contano l'aspetto e i tag, non le regole d'inserimento.
const look = computed(() => without(current.value, 'max', 'maxLength', 'addOnPaste', 'addOnTab', 'addOnBlur', 'duplicate'))

const states: Record<string, Record<string, unknown>> = {
  'vuoto': {modelValue: []},
  'con tag': {modelValue: ['Vue', 'Nuxt']},
  'disabled': {disabled: true, modelValue: ['Vue', 'Nuxt']},
  'loading': {loading: true, modelValue: ['Vue']},
  'highlight': {highlight: true, modelValue: ['Vue']},
}
</script>

<template>
  <ShowcasePage
      title="InputTags"
      wraps="SInputTags"
      description="Un campo che raccoglie più valori come tag. Il focus sta sull'input interno: Stem disegna l'anello sul contenitore con has-focus."
  >
    <ShowcasePlayground v-model="state" tag="SInputTags" :controls="controls" code-extra='v-model="tags"'>
      <template #default="{props}">
        <SInputTags v-bind="props" v-model="value" class="w-72"/>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Variant × color"
        description="Tutte le combinazioni, alla size e con le opzioni scelte sopra."
    >
      <ShowcaseMatrix :rows="variants" :cols="colors">
        <template #cell="{row, col}">
          <SInputTags v-bind="without(look, 'variant', 'color', 'placeholder')" :variant="row as any" :color="col as any" :placeholder="col" :default-value="['Vue']" class="w-44"/>
        </template>
      </ShowcaseMatrix>
    </ShowcaseSection>

    <ShowcaseSection
        title="Size"
        description="Con due tag: il campo non deve crescere rispetto a quello vuoto."
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <SInputTags v-bind="without(look, 'size')" :size="item as any" :default-value="['Vue', 'Nuxt']" class="w-56"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Vuoto, pieno, Input e Button"
        description="Per ogni size: InputTags vuoto e con tag, Input e Button devono avere la stessa altezza."
    >
      <ShowcaseStage body-class="overflow-x-auto p-6">
        <table class="mx-auto border-separate border-spacing-x-5 border-spacing-y-4">
          <thead>
            <tr>
              <th/>
              <th v-for="c in ['vuoto', 'con tag', 'SInput', 'SButton']" :key="c" class="text-center font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ c }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in sizes" :key="s">
              <th class="pr-2 text-right font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ s }}</th>
              <td class="text-center align-top">
                <ShowcaseMeasure labels>
                  <SInputTags :size="s as any" :variant="look.variant as any" :color="look.color as any" icon="i-ph-tag" placeholder="Tag" class="w-44"/>
                </ShowcaseMeasure>
              </td>
              <td class="text-center align-top">
                <ShowcaseMeasure labels>
                  <SInputTags :size="s as any" :variant="look.variant as any" :color="look.color as any" icon="i-ph-tag" :default-value="['Vue', 'Nuxt']" class="w-44"/>
                </ShowcaseMeasure>
              </td>
              <td class="text-center align-top">
                <ShowcaseMeasure labels>
                  <SInput :size="s as any" :variant="look.variant as any" :color="look.color as any" icon="i-ph-tag" placeholder="Tag" class="w-44"/>
                </ShowcaseMeasure>
              </td>
              <td class="text-center align-top">
                <ShowcaseMeasure labels>
                  <SButton :size="s as any" label="Aggiungi"/>
                </ShowcaseMeasure>
              </td>
            </tr>
          </tbody>
        </table>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Tanti tag"
        description="Quando i tag non stanno su una riga il campo va a capo: conta lo spazio fra le righe."
    >
      <ShowcaseScale :items="['sm', 'md', 'lg']">
        <template #item="{item}">
          <SInputTags v-bind="without(look, 'size')" v-model="many" :size="item as any" class="w-64"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Regole d'inserimento"
        description="Scrivi e premi Invio. max limita il numero di tag, max-length la lunghezza; add-on-blur aggiunge uscendo dal campo; duplicate ammette doppioni."
    >
      <ShowcaseStage>
        <UFormField label="max 3">
          <SInputTags v-bind="look" :max="3" :default-value="['Vue', 'Nuxt']" class="w-60"/>
        </UFormField>
        <UFormField label="max-length 8">
          <SInputTags v-bind="look" :max-length="8" class="w-60"/>
        </UFormField>
        <UFormField label="add-on-blur, add-on-paste">
          <SInputTags v-bind="look" add-on-blur add-on-paste class="w-60"/>
        </UFormField>
        <UFormField label="duplicate">
          <SInputTags v-bind="look" duplicate :default-value="['Vue', 'Vue']" class="w-60"/>
        </UFormField>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Stati"
        description="Vuoto, con tag, disabilitato, in caricamento ed evidenziato."
    >
      <ShowcaseScale :items="Object.keys(states)">
        <template #item="{item}">
          <SInputTags v-bind="{...without(look, 'disabled', 'loading', 'highlight'), ...states[item]}" class="w-48"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="FormField"
        description="Etichetta, descrizione ed errore attorno al campo."
    >
      <ShowcaseStage body-class="grid grid-cols-2 gap-6 p-8">
        <UFormField label="Competenze" description="Premi Invio dopo ogni voce.">
          <SInputTags v-bind="look" :default-value="['Vue']" class="w-full"/>
        </UFormField>
        <UFormField label="Destinatari" error="Aggiungi almeno un destinatario." required>
          <SInputTags v-bind="without(look, 'color')" icon="i-ph-at" class="w-full"/>
        </UFormField>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
