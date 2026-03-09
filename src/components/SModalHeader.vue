<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: string
  separator?: boolean
  closeable?: boolean
  disabled?: boolean
}>(), {
  separator: false,
  closeable: true,
  disabled: false,
})

defineEmits<{
  close: []
}>()
</script>

<template>
  <header
      class="p-6 flex relative shrink-0 w-full"
      :class="[
      description ? 'items-start' : 'items-center',
      separator ? 'border-b border-(--ui-border)' : '',
    ]"
  >
    <div class="pr-8 flex flex-col truncate text-base gap-[1em]">
      <UIcon
          v-if="icon"
          :name="icon"
          class="size-10"
      />
      <div
          v-if="title"
          class="text-2xl leading-tight block truncate"
      >
        {{ title }}
      </div>
      <div
          v-if="description"
          class="text-base block whitespace-normal sm:whitespace-pre-line"
      >
        {{ description }}
      </div>
    </div>
    <UButton
        v-if="closeable"
        class="rounded-full! shrink-0 absolute py-1.5! px-[0.6em]! top-3 right-3 transition duration-200"
        :class="[
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer'
      ]"
        icon="i-ph-x"
        size="xl"
        variant="soft"
        :disabled="disabled"
        @click="$emit('close')"
    />
  </header>
</template>
