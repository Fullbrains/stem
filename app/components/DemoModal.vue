<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  side?: 'top' | 'right' | 'bottom' | 'left'
}>()

const emit = defineEmits<{
  close: [result?: string]
}>()

const dropdownItems: DropdownMenuItem[] = [
  { label: 'Edit', icon: 'i-lucide-pencil' },
  { label: 'Duplicate', icon: 'i-lucide-copy' },
  { type: 'separator' },
  { label: 'Delete', icon: 'i-lucide-trash' },
]

const overlay = useOverlay()
const nestedOpen = ref(false)
</script>

<template>
  <SModal
      :title="title ?? 'Example Modal'"
      :description="description ?? 'This is a basic SModal powered by USlideover.'"
      :size="size"
      :side="side"
      @close="emit('close')"
  >
    <template #body>
      <div class="p-6 space-y-4">
        <p>Modal body content goes here.</p>

        <div class="flex flex-wrap items-center gap-3">
          <UDropdownMenu :items="dropdownItems">
            <SButton label="Dropdown" icon="i-lucide-chevron-down" variant="soft" />
          </UDropdownMenu>

          <SButton label="Open nested modal" icon="i-lucide-layers" variant="soft" @click="nestedOpen = true" />
        </div>

        <SModal
            v-model:open="nestedOpen"
            title="Nested Modal"
            description="A modal inside a modal."
            size="sm"
        >
          <template #body>
            <div class="p-6">
              <p>This is a nested modal content.</p>
            </div>
          </template>
          <template #footer>
            <UButton label="Close" variant="soft" @click="nestedOpen = false" />
          </template>
        </SModal>
      </div>
    </template>
    <template #footer>
      <UButton label="Save" @click="emit('close', 'saved')"/>
      <UButton label="Cancel" variant="soft" @click="emit('close')"/>
    </template>
  </SModal>
</template>
