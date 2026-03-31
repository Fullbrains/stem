<script setup lang="ts">
import {computed} from 'vue'

export interface SSearchFilterOption {
  readonly value: string
  readonly label: string
  readonly icon?: string
  readonly iconClass?: string
  readonly group?: string
}

export interface SSearchFilterGroup {
  readonly value: string
  readonly label: string
}

const open = defineModel<boolean>('open')

const props = withDefaults(defineProps<{
  modelValue: Set<string>
  options: readonly SSearchFilterOption[]
  label: string
  multiple?: boolean
  placeholder?: string
  allLabel?: string
  groups?: readonly SSearchFilterGroup[]
  nullable?: boolean
  nullLabel?: string
  nullValue?: string
  nullIcon?: string
  nullIconClass?: string
  counts?: Record<string, number>
  chipClass?: string
  threshold?: number
  contentClass?: string
  alignEnd?: boolean
}>(), {
  multiple: true,
  placeholder: 'None selected',
  allLabel: 'All',
  nullable: false,
  nullLabel: 'Not Contacted',
  nullValue: 'not_contacted',
  nullIcon: 'i-ph-dots-three',
  nullIconClass: 'text-(--ui-text-muted)',
  threshold: 3,
  contentClass: 'min-w-48',
})

const emit = defineEmits<{
  'update:modelValue': [value: Set<string>]
}>()

const selectedSet = computed(() => props.modelValue)

const totalOptions = computed(() => props.options.length + (props.nullable ? 1 : 0))
const isAllSelected = computed(() => props.multiple && (props.modelValue.size === 0 || props.modelValue.size >= totalOptions.value))
const showReset = computed(() => props.multiple && !isAllSelected.value)

function emitOrReset(newSet: Set<string>) {
  if (newSet.size === 0 || newSet.size >= totalOptions.value) {
    emit('update:modelValue', new Set())
  } else {
    emit('update:modelValue', newSet)
  }
}

function selectAll() {
  emit('update:modelValue', new Set())
}

function selectSingle(value: string) {
  emit('update:modelValue', new Set([value]))
  open.value = false
}

function toggle(value: string) {
  if (!props.multiple) {
    selectSingle(value)
    return
  }
  if (isAllSelected.value) {
    emit('update:modelValue', new Set([value]))
    return
  }
  const newSet = new Set(props.modelValue)
  if (newSet.has(value)) {
    newSet.delete(value)
  } else {
    newSet.add(value)
  }
  emitOrReset(newSet)
}

function toggleGroup(groupValue: string) {
  if (!props.groups) return
  const values = props.options.filter(o => o.group === groupValue).map(o => o.value)
  if (isAllSelected.value) {
    emit('update:modelValue', new Set(values))
    return
  }
  const allGroupSelected = values.every(v => props.modelValue.has(v))
  const newSet = new Set(props.modelValue)
  if (allGroupSelected) {
    for (const v of values) newSet.delete(v)
  } else {
    for (const v of values) newSet.add(v)
  }
  emitOrReset(newSet)
}

const selectedGroups = computed(() => {
  if (!props.groups || isAllSelected.value) return new Set<string>()
  const result = new Set<string>()
  for (const group of props.groups) {
    const groupOptions = props.options.filter(o => o.group === group.value)
    if (groupOptions.every(o => selectedSet.value.has(o.value))) {
      result.add(group.value)
    }
  }
  return result
})

const singleLabel = computed(() => {
  if (props.modelValue.size === 0) return null
  const value = [...props.modelValue][0]
  if (props.nullable && value === props.nullValue) return props.nullLabel
  return props.options.find(o => o.value === value)?.label ?? value
})

const selectedLabels = computed(() => {
  if (isAllSelected.value) {
    return Array.from({length: totalOptions.value}, (_, i) => String(i))
  }
  if (!props.groups) {
    return [...props.modelValue].map((v) => {
      if (props.nullable && v === props.nullValue) return props.nullLabel
      return props.options.find(o => o.value === v)?.label ?? v
    })
  }
  const labels: string[] = []
  if (props.nullable && props.modelValue.has(props.nullValue)) {
    labels.push(props.nullLabel!)
  }
  for (const group of props.groups) {
    const groupOptions = props.options.filter(o => o.group === group.value)
    const selectedInGroup = groupOptions.filter(o => props.modelValue.has(o.value))
    if (selectedInGroup.length === groupOptions.length) {
      labels.push(group.label)
    } else if (selectedInGroup.length > 0) {
      labels.push(...selectedInGroup.map(o => o.label))
    }
  }
  return labels
})

const preventDefault = (e: Event) => e.preventDefault()

const items = computed(() => {
  const selected = selectedSet.value
  const allSelected = isAllSelected.value
  const multi = props.multiple
  const result: Record<string, unknown>[][] = []

  if (multi) {
    const totalCount = props.counts
        ? Object.values(props.counts).reduce((sum, n) => sum + n, 0)
        : undefined

    result.push([
      {
        slot: 'filter-all' as const,
        label: props.allLabel,
        checked: allSelected,
        count: totalCount,
        onSelect: () => selectAll(),
      },
    ])
  }

  if (props.nullable) {
    result.push([
      {
        slot: 'filter-item' as const,
        value: props.nullValue,
        icon: props.nullIcon,
        iconClass: props.nullIconClass,
        label: props.nullLabel,
        ...(multi ? {type: 'checkbox' as const} : {}),
        checked: multi ? !allSelected && selected.has(props.nullValue!) : selected.has(props.nullValue!),
        count: props.counts?.[props.nullValue!],
        ...(multi
            ? {onUpdateChecked: () => toggle(props.nullValue!), onSelect: preventDefault}
            : {onSelect: () => selectSingle(props.nullValue!)}),
      },
    ])
  }

  if (props.groups) {
    const selectedGroupsSet = selectedGroups.value
    for (const group of props.groups) {
      const groupOptions = props.options.filter(o => o.group === group.value)
      result.push([
        ...(multi
            ? [{
              slot: 'group-header' as const,
              label: group.label,
              type: 'checkbox' as const,
              checked: !allSelected && selectedGroupsSet.has(group.value),
              onUpdateChecked: () => toggleGroup(group.value),
              onSelect: preventDefault,
            }]
            : [{
              slot: 'group-header' as const,
              label: group.label,
              disabled: true,
            }]),
        ...groupOptions.map(o => ({
          slot: 'filter-item' as const,
          value: o.value,
          icon: o.icon,
          iconClass: o.iconClass,
          label: o.label,
          ...(multi ? {type: 'checkbox' as const} : {}),
          checked: multi ? !allSelected && selected.has(o.value) : selected.has(o.value),
          count: props.counts?.[o.value],
          ...(multi
              ? {onUpdateChecked: () => toggle(o.value), onSelect: preventDefault}
              : {onSelect: () => selectSingle(o.value)}),
        })),
      ])
    }
  } else {
    result.push(
        props.options.map(o => ({
          slot: 'filter-item' as const,
          value: o.value,
          icon: o.icon,
          iconClass: o.iconClass,
          label: o.label,
          ...(multi ? {type: 'checkbox' as const} : {}),
          checked: multi ? !allSelected && selected.has(o.value) : selected.has(o.value),
          count: props.counts?.[o.value],
          ...(multi
              ? {onUpdateChecked: () => toggle(o.value), onSelect: preventDefault}
              : {onSelect: () => selectSingle(o.value)}),
        })),
    )
  }

  return result
})
</script>

<template>
  <div
      class="flex items-stretch overflow-hidden rounded-full"
      :class="chipClass"
  >
    <UDropdownMenu
        v-model:open="open"
        :items="(items as any)"
        :content="{align: alignEnd ? 'end' as const : 'start' as const, sideOffset: 3}"
        :ui="{
        content: contentClass,
        item: 'px-3! min-h-7 py-1! text-sm',
        itemTrailing: 'flex items-center justify-end',
      }"
    >
      <SSearchChip
          trailing-icon="i-ph-caret-down"
          :active="open"
          :label="label"
          :selected-values="multiple ? selectedLabels : [singleLabel ?? placeholder]"
          :count="multiple ? totalOptions : Infinity"
          :threshold="threshold"
          class="flex-1 min-w-0 rounded-r-none!"
          :class="showReset ? 'pr-1!' : ''"
      />

      <template #filter-all="{item: _item}">
        <div class="flex items-center gap-2 w-full py-[0.2em]">
          <span class="truncate mr-auto h-5">{{ (_item as any).label }}</span>
          <span
              v-if="(_item as any).count != null"
              class="text-(--ui-text-muted) text-xs tabular-nums ml-6"
          >{{ (_item as any).count }}</span>
          <UIcon
              v-if="(_item as any).checked"
              name="i-ph-check"
              class="size-4"
          />
          <div v-else class="w-4"/>
        </div>
      </template>

      <template #group-header="{item: _item}">
        <div class="flex items-center gap-2 w-full cursor-pointer py-[0.2em]">
          <span class="text-(--ui-text-highlighted) normal-case! flex-1 text-left">
            {{ (_item as any).label }}
          </span>
          <UIcon
              v-if="(_item as any).checked"
              name="i-ph-check"
              class="size-4"
          />
        </div>
      </template>

      <template #filter-item="{item: _item}">
        <div
            class="flex items-center gap-2 w-full py-[0.2em]"
            :class="(_item as any).iconClass"
        >
          <slot name="leading" :option="_item">
            <UIcon
                v-if="(_item as any).icon"
                :name="(_item as any).icon"
                class="size-5 shrink-0"
            />
          </slot>
          <span class="truncate mr-auto h-5">{{ (_item as any).label }}</span>
          <span
              v-if="(_item as any).count != null"
              class="text-(--ui-text-muted) text-xs tabular-nums ml-6"
          >{{ (_item as any).count }}</span>
          <UIcon
              v-if="(_item as any).checked"
              name="i-ph-check"
              class="size-4"
          />
          <div v-else class="w-4"/>
        </div>
      </template>
    </UDropdownMenu>
    <div
        class="shrink-0 overflow-hidden flex transition-all duration-150"
        :class="showReset ? 'w-6.5' : 'w-0'"
    >
      <button
          class="grow w-6.5 flex items-center justify-start rounded-r-full bg-slate-400/20 cursor-pointer hover:bg-slate-400/30 transition duration-150"
          :tabindex="showReset ? 0 : -1"
          @click.stop.prevent="selectAll()"
      >
        <UIcon
            name="i-ph-x"
            class="size-3.5 ml-1"
        />
      </button>
    </div>
  </div>
</template>
