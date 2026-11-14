<script setup lang="ts">
import inputTheme from '#build/ui/input'
import {inputContainerClasses} from '~~/src/theme/input-container'
import type {ShowcaseControl} from '~/utils/showcase-controls'

// SColorPicker non passa dal tema di Nuxt UI: colori e varianti vengono dalla
// sua tabella (input-container.ts), le size dalla scala degli input.
const colors = Object.keys(inputContainerClasses)
const variants = Object.keys(inputContainerClasses.primary)
const sizes = themeKeys(inputTheme, 'size')

const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'variant', type: 'select', options: variants, default: 'outline'},
  {group: 'Aspetto', key: 'color', type: 'select', options: colors, default: 'primary'},
  {group: 'Aspetto', key: 'size', type: 'select', options: sizes, default: 'sm'},
  {
    group: 'Aspetto', key: 'iconSize', label: 'icon-size', type: 'select',
    options: [{label: 'dalla size', value: undefined}, 'sm', 'md', 'lg', 'xl', '1.25em'],
  },

  {group: 'Valore', key: 'placeholder', type: 'text', initial: '#000000', placeholder: 'nessuno'},
  {group: 'Valore', key: 'defaultValue', label: 'default-value', type: 'select', options: [
    {label: 'nessuno', value: undefined}, '#3b82f6', '#ef4444', '#10b981',
  ]},
  {group: 'Valore', key: 'allowEmpty', label: 'allow-empty', type: 'boolean'},

  {group: 'Stato', key: 'disabled', type: 'boolean'},
]

const state = useCookie<Record<string, any>>('showcase-color-picker', {default: () => controlDefaults(controls)})

const color = ref('#3b82f6')
const changed = ref('#ef4444')
const empty = ref('')
const invalid = ref('#10b981')

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

const iconSizes = ['dalla size', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <ShowcasePage
      title="ColorPicker"
      wraps="UColorPicker"
      description="Un campo esadecimale con il campione del colore e il selettore in un popover. Ha lo stesso aspetto degli input di Stem; la size di default è sm."
  >
    <ShowcasePlayground v-model="state" tag="SColorPicker" :controls="controls" code-extra='v-model="color"'>
      <template #default="{props}">
        <div class="w-60">
          <SColorPicker v-bind="props" v-model="color"/>
        </div>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Variant × color"
        description="Le varianti e i colori che SColorPicker accetta, alla size scelta sopra."
    >
      <ShowcaseMatrix :rows="variants" :cols="colors">
        <template #cell="{row, col}">
          <div class="w-40">
            <SColorPicker v-bind="without(current, 'variant', 'color', 'defaultValue')" v-model="color" :variant="row as any" :color="col as any"/>
          </div>
        </template>
      </ShowcaseMatrix>
    </ShowcaseSection>

    <ShowcaseSection
        title="Size"
        description="Altezza × larghezza del campo; il campione è un gradino sopra la scala delle icone."
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <div class="w-44">
            <SColorPicker v-bind="without(current, 'size')" v-model="color" :size="item as any"/>
          </div>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="ColorPicker, Input e Button alla stessa size"
        description="Il contenitore è costruito a mano: per ogni size l'altezza deve coincidere con UInput e SButton."
    >
      <ShowcaseStage body-class="overflow-x-auto p-6">
        <table class="mx-auto border-separate border-spacing-x-6 border-spacing-y-4">
          <thead>
            <tr>
              <th/>
              <th v-for="c in ['SColorPicker', 'UInput', 'SButton']" :key="c" class="text-center font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ c }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in sizes" :key="s">
              <th class="pr-2 text-right font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ s }}</th>
              <td class="text-center align-top">
                <ShowcaseMeasure labels>
                  <div class="w-40">
                    <SColorPicker v-model="color" :size="s as any" :variant="current.variant as any" :color="current.color as any"/>
                  </div>
                </ShowcaseMeasure>
              </td>
              <td class="text-center align-top">
                <ShowcaseMeasure labels>
                  <UInput :size="s as any" :variant="current.variant as any" :color="current.color as any" icon="i-ph-palette" placeholder="#3b82f6" class="w-40"/>
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
        title="Icona"
        description="Il caret e il pulsante di reset seguono la scala delle icone; icon-size li fissa su un gradino."
    >
      <ShowcaseScale :items="iconSizes">
        <template #item="{item}">
          <div class="w-44">
            <SColorPicker v-bind="without(current, 'iconSize')" v-model="changed" default-value="#3b82f6" :icon-size="item === 'dalla size' ? undefined : item"/>
          </div>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Comportamento"
        description="Con default-value compare il pulsante per tornare al valore iniziale; allow-empty accetta il campo vuoto; un hex non valido colora il bordo di rosso all'uscita dal campo."
    >
      <ShowcaseStage body-class="grid grid-cols-2 gap-6 p-8 lg:grid-cols-4">
        <UFormField label="default-value" description="Valore cambiato: c'è il reset.">
          <SColorPicker v-bind="without(current, 'defaultValue', 'allowEmpty')" v-model="changed" default-value="#3b82f6"/>
        </UFormField>
        <UFormField label="allow-empty" description="Il campione è tratteggiato.">
          <SColorPicker v-bind="without(current, 'defaultValue', 'placeholder')" v-model="empty" allow-empty placeholder="Nessun colore"/>
        </UFormField>
        <UFormField label="Hex non valido" description="Scrivi «zzz» ed esci dal campo.">
          <SColorPicker v-bind="without(current, 'defaultValue', 'allowEmpty')" v-model="invalid"/>
        </UFormField>
        <UFormField label="disabled" description="Né campo né popover.">
          <SColorPicker v-bind="without(current, 'defaultValue')" v-model="color" disabled/>
        </UFormField>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
