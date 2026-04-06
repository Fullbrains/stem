<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  message?: string
  icon?: string
  confirmLabel?: string
  confirmColor?: string
}>(), {
  title: 'Info',
  confirmLabel: 'OK',
})

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <SModal
      :title="title"
      :description="message"
      :icon="icon"
      @close="emit('close')"
  >
    <template #footer>
      <SButton
          :label="confirmLabel"
          :color="confirmColor"
          @click="emit('close')"
      />
    </template>
  </SModal>
</template>
