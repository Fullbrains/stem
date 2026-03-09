<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  side?: 'top' | 'right' | 'bottom' | 'left'
}>()

const emit = defineEmits<{
  close: [result?: string]
}>()
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
      <div class="p-6">
        <p class="">
          Modal body content goes here.
        </p>
      </div>
    </template>
    <template #footer>
      <UButton label="Save" @click="emit('close', 'saved')"/>
      <UButton label="Cancel" variant="soft" @click="emit('close')"/>
    </template>
  </SModal>
</template>
