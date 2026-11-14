<script setup lang="ts">
import theme from '#build/ui/textarea'
import type {ShowcaseControl} from '~/utils/showcase-controls'

const colors = themeKeys(theme, 'color')
const variants = themeKeys(theme, 'variant')
const sizes = themeKeys(theme, 'size')

const icons = [
  {label: 'nessuna', value: undefined},
  {label: 'note-pencil', value: 'i-ph-note-pencil'},
  {label: 'chat-text', value: 'i-ph-chat-text'},
  {label: 'sparkle', value: 'i-ph-sparkle'},
  {label: 'paper-plane', value: 'i-ph-paper-plane-tilt'},
]

const rowOptions = [1, 2, 3, 4, 6].map(n => ({label: String(n), value: n}))

const controls: ShowcaseControl[] = [
  {group: 'Aspetto', key: 'variant', type: 'select', options: variants, default: 'outline'},
  {group: 'Aspetto', key: 'color', type: 'select', options: colors, default: 'primary'},
  {group: 'Aspetto', key: 'size', type: 'select', options: sizes, default: 'md'},

  {group: 'Contenuto', key: 'placeholder', type: 'text', initial: 'Scrivi una nota', placeholder: 'nessuno'},
  {group: 'Contenuto', key: 'icon', type: 'select', options: icons},
  {group: 'Contenuto', key: 'trailingIcon', label: 'trailing-icon', type: 'select', options: icons},

  {group: 'Righe', key: 'rows', type: 'select', options: rowOptions, default: 3},
  {group: 'Righe', key: 'autoresize', type: 'boolean'},
  {group: 'Righe', key: 'maxrows', type: 'select', default: 0, options: [{label: 'nessuno', value: 0}, ...rowOptions.slice(2)]},

  {group: 'Stato', key: 'loading', type: 'boolean'},
  {group: 'Stato', key: 'disabled', type: 'boolean'},
  {group: 'Stato', key: 'readonly', type: 'boolean'},
  {group: 'Stato', key: 'required', type: 'boolean'},
  {group: 'Stato', key: 'highlight', type: 'boolean'},
  {group: 'Stato', key: 'fixed', type: 'boolean'},
]

const state = useCookie<Record<string, any>>('showcase-textarea', {default: () => controlDefaults(controls)})

const value = ref('')
const long = ref('Prima riga.\nSeconda riga.\nTerza riga.\nQuarta riga: scrivi ancora per vedere crescere il campo.')

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

const states: Record<string, Record<string, unknown>> = {
  'vuoto': {},
  'con valore': {modelValue: 'Una nota breve.'},
  'disabled': {disabled: true, modelValue: 'Una nota breve.'},
  'readonly': {readonly: true, modelValue: 'Una nota breve.'},
  'loading': {loading: true, icon: 'i-ph-note-pencil'},
  'highlight': {highlight: true},
}

const iconCases: Record<string, Record<string, unknown>> = {
  'leading': {icon: 'i-ph-note-pencil'},
  'trailing': {trailingIcon: 'i-ph-paper-plane-tilt'},
  'entrambe': {icon: 'i-ph-chat-text', trailingIcon: 'i-ph-sparkle'},
  'loading': {icon: 'i-ph-chat-text', loading: true},
}
</script>

<template>
  <ShowcasePage
      title="Textarea"
      wraps="UTextarea"
      description="Il campo di testo su più righe. Condivide con Input lo stile di Stem: stessi bordi, sfondi, focus e size."
  >
    <ShowcasePlayground v-model="state" tag="UTextarea" :controls="controls" code-extra='v-model="value"'>
      <template #default="{props}">
        <UTextarea v-bind="props" v-model="value" class="w-72"/>
      </template>
    </ShowcasePlayground>

    <ShowcaseSection
        title="Variant × color"
        description="Tutte le combinazioni, alla size e con le opzioni scelte sopra."
    >
      <ShowcaseMatrix :rows="variants" :cols="colors">
        <template #cell="{row, col}">
          <UTextarea v-bind="without(current, 'variant', 'color', 'placeholder')" :variant="row as any" :color="col as any" :placeholder="col" class="w-40"/>
        </template>
      </ShowcaseMatrix>
    </ShowcaseSection>

    <ShowcaseSection
        title="Size"
        description="Altezza × larghezza alle righe scelte sopra."
    >
      <ShowcaseScale :items="sizes">
        <template #item="{item}">
          <UTextarea v-bind="without(current, 'size')" :size="item as any" class="w-48"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Una riga contro Input e Button"
        description="Con rows 1 la textarea deve avere l'altezza di un input e di un pulsante della stessa size."
    >
      <ShowcaseStage body-class="overflow-x-auto p-6">
        <table class="mx-auto border-separate border-spacing-x-6 border-spacing-y-4">
          <thead>
            <tr>
              <th/>
              <th v-for="c in ['UTextarea rows 1', 'UInput', 'SButton']" :key="c" class="text-center font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ c }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in sizes" :key="s">
              <th class="pr-2 text-right font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ s }}</th>
              <td class="text-center align-top">
                <ShowcaseMeasure labels>
                  <UTextarea :size="s as any" :variant="current.variant as any" :color="current.color as any" :rows="1" placeholder="Una riga" class="w-44"/>
                </ShowcaseMeasure>
              </td>
              <td class="text-center align-top">
                <ShowcaseMeasure labels>
                  <UInput :size="s as any" :variant="current.variant as any" :color="current.color as any" placeholder="Una riga" class="w-44"/>
                </ShowcaseMeasure>
              </td>
              <td class="text-center align-top">
                <ShowcaseMeasure labels>
                  <SButton :size="s as any" label="Invia"/>
                </ShowcaseMeasure>
              </td>
            </tr>
          </tbody>
        </table>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Righe"
        description="L'altezza a 1, 2, 3, 4 e 6 righe, alla size scelta."
    >
      <ShowcaseScale :items="rowOptions.map(r => r.label)">
        <template #item="{item}">
          <UTextarea v-bind="without(current, 'rows', 'autoresize', 'maxrows')" :rows="Number(item)" class="w-40"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Autoresize"
        description="Con autoresize il campo cresce col testo; maxrows lo ferma e da lì scorre."
    >
      <ShowcaseStage>
        <UFormField label="autoresize" description="rows 2">
          <UTextarea v-bind="without(current, 'rows', 'maxrows')" v-model="long" autoresize :rows="2" class="w-64"/>
        </UFormField>
        <UFormField label="autoresize + maxrows 3" description="rows 1">
          <UTextarea v-bind="without(current, 'rows', 'maxrows')" v-model="long" autoresize :rows="1" :maxrows="3" class="w-64"/>
        </UFormField>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Icone"
        description="Le icone stanno in alto, allineate alla prima riga."
    >
      <ShowcaseScale :items="Object.keys(iconCases)">
        <template #item="{item}">
          <UTextarea v-bind="{...without(current, 'icon', 'trailingIcon', 'loading'), ...iconCases[item]}" class="w-48"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="Stati"
        description="Vuoto, compilato, disabilitato, sola lettura, in caricamento ed evidenziato."
    >
      <ShowcaseScale :items="Object.keys(states)">
        <template #item="{item}">
          <UTextarea v-bind="{...without(current, 'disabled', 'readonly', 'loading', 'highlight'), ...states[item]}" class="w-44"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection
        title="FormField"
        description="Etichetta, descrizione, help ed errore attorno alla textarea."
    >
      <ShowcaseStage body-class="grid grid-cols-2 gap-6 p-8">
        <UFormField label="Messaggio" description="Sarà visibile a tutto il team." hint="Facoltativo">
          <UTextarea v-bind="current" class="w-full"/>
        </UFormField>
        <UFormField label="Motivo" error="Spiega il motivo in almeno 20 caratteri." required>
          <UTextarea v-bind="without(current, 'color')" model-value="Troppo breve" class="w-full"/>
        </UFormField>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
