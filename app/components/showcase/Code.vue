<script setup lang="ts">
const props = defineProps<{
  code: string
}>()

const copied = ref(false)
let t: ReturnType<typeof setTimeout> | undefined

async function copy() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  clearTimeout(t)
  t = setTimeout(() => (copied.value = false), 1200)
}
</script>

<template>
  <div class="group relative rounded-lg bg-gray-50 ring-1 ring-gray-200">
    <pre class="overflow-x-auto px-4 py-3 font-mono text-[12px] leading-relaxed text-gray-700">{{ code }}</pre>
    <button
        type="button"
        class="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[11px] text-gray-500 opacity-0 ring-1 ring-gray-200 transition-opacity group-hover:opacity-100 hover:text-gray-900"
        @click="copy"
    >
      <UIcon :name="copied ? 'i-ph-check' : 'i-ph-copy'" class="size-3.5"/>
      {{ copied ? 'Copiato' : 'Copia' }}
    </button>
  </div>
</template>
