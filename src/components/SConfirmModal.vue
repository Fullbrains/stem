<script setup lang="ts">
import {ref, computed} from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  message?: string
  label?: string
  cancelLabel?: string
  icon?: string
  destructive?: boolean
  confirmMatch?: string
  confirmPlaceholder?: string
  /**
   * A line under the title, as SModal's `headerSeparator`. The message then
   * moves from the header into the body, under the line: in the header the
   * line would fall after the message, right against the footer's own.
   */
  headerSeparator?: boolean
  /** SModal's compact header: a smaller title, less air around it. */
  headerCompact?: boolean
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
const inputValue = ref('')

const confirmDisabled = computed(() =>
    loading.value || (props.confirmMatch != null && inputValue.value !== props.confirmMatch),
)

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
      :description="headerSeparator ? undefined : message"
      :icon="icon"
      :disabled="loading"
      :header-separator="headerSeparator"
      :header-compact="headerCompact"
      @close="emit('close', false)"
  >
    <template v-if="headerSeparator || confirmMatch != null" #body>
      <p
          v-if="headerSeparator && message"
          class="px-6 pt-6 text-base whitespace-normal sm:whitespace-pre-line"
          :class="{ 'pb-6': confirmMatch == null }"
      >{{ message }}</p>
      <div v-if="confirmMatch != null" class="p-6">
        <UInput
            v-model="inputValue"
            :placeholder="confirmPlaceholder"
            autofocus
            size="sm"
            class="w-full max-w-100"
            @keydown.enter="!confirmDisabled && handleConfirm()"
        />
      </div>
    </template>
    <template #footer>
      <SButton
          :label="label"
          :destructive="destructive"
          :loading="loading"
          :disabled="confirmDisabled"
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
