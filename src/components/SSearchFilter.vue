<script setup lang="ts">
import {stemScaleClasses, type StemScaleProps, type StemSize} from '../theme/scale'
import {computed, inject, ref, useSlots} from 'vue'
import {SEARCH_BAR_PANEL} from '../composables/searchBarContext'

defineOptions({inheritAttrs: false})

const slots = useSlots()

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

// The menu anchors to the whole PILL (chip + reset button), not to the chip
// trigger: the pill's edges never move when the reset button animates in and
// out, so the menu stays put — no jumps, no offset math.
const rootEl = ref<HTMLElement>()
const inPanel = inject(SEARCH_BAR_PANEL, false)

const props = withDefaults(defineProps<StemScaleProps & {
  /** On the Stem scale, for the chip, the menu and the reset: sm by default. */
  size?: StemSize
  modelValue: Set<string>
  options: readonly SSearchFilterOption[]
  label: string
  /** Drawn before the label, which then shows only while everything is selected; the label stays as the accessible name. */
  icon?: string
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
  /** Accessible name of the reset (X) button shown on a partial selection. */
  resetLabel?: string
  /** Chip text for a multi-selection past the threshold; `%` is replaced by the count. */
  selectedTemplate?: string
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
  resetLabel: 'Reset',
  size: 'sm',
  rounded: true,
})

// The scale props, forwarded to the chip and the menu as they are.
const scale = computed(() => ({
  size: props.size,
  textSize: props.textSize,
  iconSize: props.iconSize,
  space: props.space,
  spaceX: props.spaceX,
  spaceY: props.spaceY,
  roundness: props.roundness,
  rounded: props.rounded,
}))
// The reset sits outside the chip, on the root: it reads the scale there.
const rootScale = computed(() => [`s-size-${props.size}`, ...stemScaleClasses(props)])

const emit = defineEmits<{
  'update:modelValue': [value: Set<string>]
}>()

const selectedSet = computed(() => props.modelValue)

const totalOptions = computed(() => props.options.length + (props.nullable ? 1 : 0))
// Picking every option means "all", except when there is only one: then
// "all" and that option would be the same click, and the option could never
// be checked.
const coversAll = (size: number) => size === 0 || (totalOptions.value > 1 && size >= totalOptions.value)
const isAllSelected = computed(() => props.multiple && coversAll(props.modelValue.size))
const showReset = computed(() => props.multiple && !isAllSelected.value)
// The chip slot draws a selection; with everything selected there is none,
// so the chip reads like any other: icon, label and the "all" text.
const drawsSelection = computed(() => !!slots.chip && !isAllSelected.value)

function emitOrReset(newSet: Set<string>) {
  if (coversAll(newSet.size)) {
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

// With one option picked, the chip wears that option's icon instead of the
// filter's own, the way it shows that option's label instead of the count.
const chipIcon = computed(() => {
  if (!props.icon || props.modelValue.size !== 1 || isAllSelected.value) return props.icon
  const value = [...props.modelValue][0]
  if (props.nullable && value === props.nullValue) return props.nullIcon
  return props.options.find(o => o.value === value)?.icon ?? props.icon
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
  <!-- Without its label text (a filtering chip with an icon, or the chip slot)
       the chip shows the label on hover at once, so it still says what it is. -->
  <UTooltip
      :text="label"
      :delay-duration="0"
      :disabled="isAllSelected || (!icon && !$slots.chip)"
  >
    <div
        ref="rootEl"
        v-bind="$attrs"
        class="flex items-stretch overflow-hidden s-corner"
        :class="[rootScale, chipClass]"
    >
      <!-- The menu's items are controls of the same scale as the chip. -->
      <SDropdownMenu
          v-model:open="open"
          v-bind="scale"
          :items="(items as any)"
          :content="{align: alignEnd && !inPanel ? 'end' as const : 'start' as const, sideOffset: 3, updatePositionStrategy: 'always' as const, reference: rootEl}"
          :ui="{
          content: contentClass,
          itemTrailing: 'flex items-center justify-end',
        }"
      >
        <SSearchChip
            v-bind="scale"
            :active="open"
            :label="drawsSelection ? undefined : label"
            :label-icon="chipIcon"
            :all-label="allLabel"
            :selected-template="selectedTemplate"
            :selected-values="multiple ? selectedLabels : [singleLabel ?? placeholder]"
            :count="multiple && isAllSelected ? totalOptions : Infinity"
            :threshold="threshold"
            class="flex-1 min-w-0 rounded-r-none!"
            :class="showReset ? 'pe-(--s-gap)!' : ''"
        >
          <!-- The chip slot replaces label and values together while something is
               filtered: an app that draws the selection itself (avatars,
               swatches) says what is filtered without the label beside it. -->
          <template v-if="drawsSelection" #default>
            <slot
                name="chip"
                :values="[...modelValue]"
            />
          </template>
        </SSearchChip>

        <template #filter-all="{item: _item}">
          <div class="flex items-center gap-(--s-gap) w-full">
            <span class="truncate mr-auto">{{ (_item as any).label }}</span>
            <span
                v-if="(_item as any).count != null"
                class="text-(--ui-text-muted) tabular-nums ms-(--s-px)"
            >{{ (_item as any).count }}</span>
            <UIcon
                v-if="(_item as any).checked"
                name="i-ph-check"
                class="size-(--s-icon-size) shrink-0"
            />
            <div v-else class="w-(--s-icon-size) shrink-0"/>
          </div>
        </template>

        <template #group-header="{item: _item}">
          <div class="flex items-center gap-(--s-gap) w-full cursor-pointer">
            <span class="text-(--ui-text-highlighted) normal-case! flex-1 text-left">
              {{ (_item as any).label }}
            </span>
            <UIcon
                v-if="(_item as any).checked"
                name="i-ph-check"
                class="size-(--s-icon-size) shrink-0"
            />
          </div>
        </template>

        <template #filter-item="{item: _item}">
          <slot name="item" :option="(_item as any)" :checked="(_item as any).checked">
            <div
                class="flex items-center gap-(--s-gap) w-full"
                :class="(_item as any).iconClass"
            >
              <slot name="leading" :option="_item">
                <UIcon
                    v-if="(_item as any).icon"
                    :name="(_item as any).icon"
                    class="size-(--s-icon-size) shrink-0"
                />
              </slot>
              <span class="truncate mr-auto">{{ (_item as any).label }}</span>
              <span
                  v-if="(_item as any).count != null"
                  class="text-(--ui-text-muted) tabular-nums ms-(--s-px)"
              >{{ (_item as any).count }}</span>
              <UIcon
                  v-if="(_item as any).checked"
                  name="i-ph-check"
                  class="size-(--s-icon-size) shrink-0"
              />
              <div v-else class="w-(--s-icon-size) shrink-0"/>
            </div>
          </slot>
        </template>
      </SDropdownMenu>
      <!-- The reset button animates its width; the menu keeps up because the
           popper uses updatePositionStrategy 'always' (repositioned every
           animation frame), so an open end-aligned menu glides with the pill
           instead of jumping. -->
      <div
          class="shrink-0 overflow-hidden flex transition-all duration-150"
          :class="showReset ? 'w-[calc(var(--s-icon-size)+var(--s-px))]' : 'w-0'"
      >
        <button
            class="grow w-[calc(var(--s-icon-size)+var(--s-px))] flex items-center justify-start bg-iron-400/20 cursor-pointer hover:bg-iron-400/30 transition duration-150"
            :tabindex="showReset ? 0 : -1"
            :aria-label="resetLabel"
            @click.stop.prevent="selectAll()"
        >
          <UIcon
              name="i-ph-x"
              class="size-[calc(var(--s-icon-size)*0.75)] shrink-0"
          />
        </button>
      </div>
    </div>
  </UTooltip>
</template>
