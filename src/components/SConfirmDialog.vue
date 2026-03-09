<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  message?: string
  label?: string
  icon?: string
  destructive?: boolean
}>(), {
  title: 'Confirm',
  message: 'Are you sure?',
  label: 'Confirm',
})

const emit = defineEmits<{
  close: [confirmed: boolean]
}>()

const loading = ref(false)
</script>

<template>
  <SModal
      :title="title"
      :description="message"
      :icon="icon"
      :disabled="loading"
      @close="emit('close', false)"
  >
    <template #footer>
      <SButton
          :label="label"
          :destructive="destructive"
          :loading="loading"
          @click="emit('close', true)"
      />
      <SButton
          label="Cancel"
          variant="soft"
          :disabled="loading"
          @click="emit('close', false)"
      />
    </template>
  </SModal>
</template>
