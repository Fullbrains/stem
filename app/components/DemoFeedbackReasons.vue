<script setup lang="ts">
const reasons = ['Inaccurate', 'Incomplete', 'Wrong sources', 'Too long']
const picked = ref<string[]>([])

function toggle(reason: string) {
  picked.value = picked.value.includes(reason)
    ? picked.value.filter(r => r !== reason)
    : [...picked.value, reason]
}
</script>

<template>
  <div class="flex flex-wrap gap-1.5">
    <SButton
      v-for="reason in reasons"
      :key="reason"
      :label="reason"
      size="sm"
      rounded
      compact
      :variant="picked.includes(reason) ? 'solid' : 'soft'"
      @click="toggle(reason)"
    />
  </div>
</template>
