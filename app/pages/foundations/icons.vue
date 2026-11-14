<script setup lang="ts">
import {stemIcons} from '../../../src/config'
import {iconSizeScale} from '../../../src/theme/icon-sizes'

const scale = Object.entries(iconSizeScale)
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const textClass: Record<string, string> = {
  xs: 'text-xs', sm: 'text-sm', md: 'text-base', lg: 'text-lg', xl: 'text-xl',
}
const icons = Object.entries(stemIcons)
const filter = ref('')
const shown = computed(() => icons.filter(([k, v]) => !filter.value || `${k} ${v}`.includes(filter.value)))
</script>

<template>
  <ShowcasePage
      title="Icone"
      description="Phosphor. Accanto al testo l'icona è alta 1em e lo segue; da sola usa la scala fissa sm/md/lg/xl."
  >
    <ShowcaseSection title="Accanto al testo" description="1em: l'icona segue la size del testo.">
      <ShowcaseScale :items="[...sizes]">
        <template #item="{item}">
          <span class="inline-flex items-center gap-[0.5em]" :class="textClass[item]">
            <UIcon name="i-ph-floppy-disk" class="size-[1em] shrink-0"/>
            Salva
          </span>
        </template>
      </ShowcaseScale>
    </ShowcaseSection>

    <ShowcaseSection title="Scala fissa" description="Per le icone da sole: iconSizeScale in src/theme/icon-sizes.ts.">
      <ShowcaseScale :items="scale.map(([k]) => k)">
        <template #item="{item}">
          <UIcon name="i-ph-floppy-disk" :style="{width: iconSizeScale[item as keyof typeof iconSizeScale], height: iconSizeScale[item as keyof typeof iconSizeScale]}"/>
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
