<script setup lang="ts">
import {ref} from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  message?: string
  label?: string
  cancelLabel?: string
  icon?: string
  destructive?: boolean
  onConfirm?: () => Promise<void> | void
}>(), {
  title: 'Confirm',
  message: 'Are you sure?',
  label: 'Confirm',
  cancelLabel: 'Cancel',
})

const emit = defineEmits<{
  close: [confirmed: boolean]
}>()

const loading = ref(false)

async function handleConfirm() {
  if (props.onConfirm) {
    loading.value = true
    try {
      await props.onConfirm()
    } finally {
      loading.value = false
    }
  }
  emit('close', true)
}
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
          @click="handleConfirm"
      />
      <SButton
          :label="cancelLabel"
          variant="soft"
          :disabled="loading"
          @click="emit('close', false)"
      />
    </template>
  </SModal>
</template>
