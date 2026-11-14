<script setup lang="ts">
import {stemIcons} from '../../../src/config'
import {stemScale} from '../../../src/theme/scale'

const scale = Object.entries(stemScale).map(([k, v]) => [k, `${v.icon}px`] as const)
const iconPx = Object.fromEntries(scale) as Record<string, string>
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const icons = Object.entries(stemIcons)
const filter = ref('')
const shown = computed(() => icons.filter(([k, v]) => !filter.value || `${k} ${v}`.includes(filter.value)))
</script>

<template>
  <ShowcasePage
      title="Icone"
      description="Phosphor, in sei pesi. L'icona fa parte della scala: a ogni size ha la sua misura, e il leading del testo è uguale."
  >
    <ShowcaseSection title="Accanto al testo" description="Icona e testo della stessa size, sulla stessa riga.">
      <ShowcaseScale :items="[...sizes]">
        <template #item="{item}">
          <span class="inline-flex items-center gap-(--s-gap) text-(length:--s-text) leading-(--s-icon-size)" :class="`s-size-${item}`">
            <UIcon name="i-ph-floppy-disk" class="size-(--s-icon-size) shrink-0"/>
            Salva
          </span>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection title="Scala delle icone" description="L'icona di ogni size della scala unica (stemScale in src/theme/scale.ts): 12, 16, 20, 24, 28px.">
      <ShowcaseScale :items="scale.map(([k]) => k)">
        <template #item="{item}">
          <UIcon name="i-ph-floppy-disk" :style="{width: iconPx[item], height: iconPx[item]}"/>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection title="Icone di sistema" description="stemIcons in src/config.ts: le icone che Nuxt UI usa per chiudere, caricare, espandere…">
      <div class="mb-2 flex justify-end">
        <input
            v-model="filter"
            placeholder="Filtra"
            class="w-48 rounded-md bg-white px-2 py-1 text-[12px] ring-1 ring-gray-200 outline-none focus:ring-gray-400"
        >
      </div>
      <ShowcaseStage body-class="grid grid-cols-6 gap-2 p-6">
        <div
            v-for="[key, name] in shown"
            :key="key"
            class="flex flex-col items-center gap-2 rounded-lg p-3 text-center"
            :title="name"
        >
          <UIcon :name="name" class="size-5"/>
          <span class="font-mono text-[10px] text-(--ui-text-muted)">{{ key }}</span>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
