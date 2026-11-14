<script setup lang="ts">
import type {ShowcaseModes} from '~/composables/useShowcase'

// L'html resta in chiaro: il tema scuro vive dentro le anteprime (vedi useShowcase).
const colorMode = useColorMode()
colorMode.preference = 'light'

const route = useRoute()
const {modes, measure, checker} = useShowcase()

// I playground mandano i loro controlli nella sidebar a destra (#showcase-options).
const optionsCount = useState('showcase-options-count', () => 0)

const modeOptions: {value: ShowcaseModes, label: string, icon: string}[] = [
  {value: 'both', label: 'Entrambi', icon: 'i-ph-circle-half'},
  {value: 'light', label: 'Chiaro', icon: 'i-ph-sun'},
  {value: 'dark', label: 'Scuro', icon: 'i-ph-moon'},
]
</script>

<template>
  <div class="min-h-screen bg-white text-gray-800">
    <aside class="fixed inset-y-0 left-0 z-30 flex w-56 flex-col border-r border-gray-200 bg-gray-50/80 backdrop-blur">
      <NuxtLink to="/" class="block px-5 pt-6 pb-4 text-sm font-semibold tracking-tight text-gray-900">
        Stem
      </NuxtLink>
      <nav class="flex-1 overflow-y-auto px-3 pb-6">
        <div v-for="group in showcaseNav" :key="group.label" class="mb-4">
          <p class="px-2 pb-1 text-[11px] font-medium text-gray-400">{{ group.label }}</p>
          <template v-for="item in group.items" :key="item.to">
            <span
                v-if="item.soon"
                class="block cursor-default rounded-md px-2 py-1 text-[13px] text-gray-300"
            >{{ item.label }}</span>
            <NuxtLink
                v-else
                :to="item.to"
                class="block rounded-md px-2 py-1 text-[13px] transition-colors"
                :class="route.path === item.to
                  ? 'bg-white text-gray-900 shadow-xs ring-1 ring-gray-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
            >{{ item.label }}</NuxtLink>
          </template>
        </div>
      </nav>
      <NuxtLink to="/legacy" class="border-t border-gray-200 px-5 py-3 text-[12px] text-gray-400 hover:text-gray-700">
        Vecchio showcase
      </NuxtLink>
    </aside>

    <aside
        v-show="optionsCount > 0"
        id="showcase-options"
        class="fixed inset-y-0 right-0 z-30 w-64 overflow-y-auto border-l border-gray-200 bg-gray-50/80 backdrop-blur"
    />

    <div class="pl-56" :class="optionsCount > 0 && 'pr-64'">
      <header class="sticky top-0 z-20 flex h-12 items-center justify-end gap-4 border-b border-gray-200 bg-white/85 px-6 backdrop-blur">
        <div class="flex rounded-lg bg-gray-100 p-0.5">
          <button
              v-for="m in modeOptions"
              :key="m.value"
              type="button"
              class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] transition-colors"
              :class="modes === m.value ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'"
              @click="modes = m.value"
          >
            <UIcon :name="m.icon" class="size-3.5"/>
            {{ m.label }}
          </button>
        </div>
        <ShowcaseToggle v-model="measure" icon="i-ph-ruler" label="Misure"/>
        <ShowcaseToggle v-model="checker" icon="i-ph-checkerboard" label="Scacchiera"/>
      </header>
      <main class="mx-auto max-w-6xl px-8 py-10">
        <slot/>
      </main>
    </div>
  </div>
</template>
