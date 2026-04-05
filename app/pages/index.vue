<script setup lang="ts">
import type {DropdownMenuItem} from '@nuxt/ui'

const allColors = ['primary', 'secondary', 'neutral', 'error', 'success'] as const
const allButtonColors = ['primary', 'secondary', 'neutral', 'error'] as const
const allButtonVariants = ['solid', 'soft', 'subtle'] as const
const allInputColors = ['primary', 'error', 'success'] as const
const allInputVariants = ['outline', 'soft', 'subtle', 'ghost', 'none'] as const
const badgeVariants = ['solid', 'outline', 'soft', 'subtle'] as const
const alertVariants = ['solid', 'outline', 'soft', 'subtle'] as const
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const dropdownItems: DropdownMenuItem[] = [
  {label: 'Profile', icon: 'i-ph-user'},
  {label: 'Settings', icon: 'i-ph-gear', disabled: true},
  {type: 'separator'},
  {label: 'Logout', icon: 'i-ph-sign-out', color: 'error'},
]

const selectItems = [
  {label: 'Backlog', value: 'backlog', icon: 'i-ph-circle-dashed'},
  {label: 'Todo', value: 'todo', icon: 'i-ph-circle'},
  {label: 'In Progress', value: 'in_progress', icon: 'i-ph-spinner', disabled: true},
  {label: 'Done', value: 'done', icon: 'i-ph-check-circle'},
]
const selectValue = ref('todo')

const selectMenuItems = [
  {label: 'Backlog', value: 'backlog', icon: 'i-ph-circle-dashed'},
  {label: 'Todo', value: 'todo', icon: 'i-ph-circle'},
  {label: 'In Progress', value: 'in_progress', icon: 'i-ph-spinner', disabled: true},
  {label: 'Done', value: 'done', icon: 'i-ph-check-circle'},
]
const selectMenuValue = ref('todo')

const inputMenuItems = [
  {label: 'Apple', icon: 'i-ph-apple-logo'},
  {label: 'Banana', icon: 'i-ph-orange-slice'},
  {label: 'Cherry', icon: 'i-ph-flower-tulip', disabled: true},
  {label: 'Grape', icon: 'i-ph-wine'},
  {label: 'Lemon', icon: 'i-ph-lemon'},
]
const inputMenuValue = ref('')

const sections = [
  {id: 'buttons', label: 'Buttons'},
  {id: 'inputs', label: 'Inputs'},
  {id: 'dropdown-menu', label: 'DropdownMenu'},
  {id: 'input-tags', label: 'InputTags'},
  {id: 'tabs', label: 'Tabs'},
  {id: 'badges', label: 'Badges'},
  {id: 'alerts', label: 'Alerts'},
  {id: 'popover', label: 'Popover'},
  {id: 'search', label: 'Search'},
  {id: 'cards', label: 'Cards'},
  {id: 'modal', label: 'Modal'},
  {id: 'spinner', label: 'Spinner'},
  {id: 'empty', label: 'Empty'},
  {id: 'color-picker', label: 'ColorPicker'},
  {id: 'scroll-area', label: 'ScrollArea'},
]

const overlay = useOverlay()

function openModal(props?: Record<string, any>) {
  const modal = overlay.create(resolveComponent('DemoModal'), {
    destroyOnClose: true,
  })
  modal.open(props)
}

// Button configurator (persisted)
const btnColors = useCookie<string[]>('stem-btn-colors', {default: () => [...allButtonColors]})
const btnVariants = useCookie<string[]>('stem-btn-variants', {default: () => [...allButtonVariants]})
const btnSize = useCookie('stem-btn-size', {default: () => 'md'})
const btnIcon = useCookie('stem-btn-icon', {default: () => true})
const btnTrailingIcon = useCookie('stem-btn-trailing-icon', {default: () => false})
const btnLoading = ref(false)
const btnCaret = useCookie('stem-btn-caret', {default: () => false})
const btnDisabled = useCookie('stem-btn-disabled', {default: () => false})
const btnRounded = useCookie('stem-btn-rounded', {default: () => false})
const btnCompact = useCookie<string>('stem-btn-compact', {default: () => 'false'})
const compactOptions = ['false', 'true', 'x', 'y'] as const
const resolvedBtnCompact = computed(() => {
  if (btnCompact.value === 'true') return true
  if (btnCompact.value === 'x' || btnCompact.value === 'y') return btnCompact.value
  return false
})

// Input configurator (persisted)
const inputColors = useCookie<string[]>('stem-input-colors', {default: () => [...allInputColors]})
const inputVariants = useCookie<string[]>('stem-input-variants', {default: () => [...allInputVariants]})
const inputSize = useCookie('stem-input-size', {default: () => 'md'})
const inputIcon = useCookie('stem-input-icon', {default: () => true})
const inputDisabled = useCookie('stem-input-disabled', {default: () => false})

const tabItems = [
  {label: 'Account', icon: 'i-ph-user'},
  {label: 'Password', icon: 'i-ph-lock'},
  {label: 'Notifications', icon: 'i-ph-bell'},
]
const tabVariants = ['pill', 'link'] as const

const inputTagsValue = ref(['Vue', 'Nuxt'])

// Search demo data
const searchQuery = ref('')
const searchStatusFilter = ref(new Set<string>())
const searchCategoryFilter = ref(new Set<string>())
const searchSingleFilter = ref(new Set<string>())
const searchOrder = ref('newest')

const statusOptions = [
  {value: 'active', label: 'Active', icon: 'i-ph-check-circle'},
  {value: 'pending', label: 'Pending', icon: 'i-ph-clock'},
  {value: 'archived', label: 'Archived', icon: 'i-ph-archive'},
]
const categoryOptions = [
  {value: 'design', label: 'Design', icon: 'i-ph-palette'},
  {value: 'development', label: 'Development', icon: 'i-ph-code'},
  {value: 'marketing', label: 'Marketing', icon: 'i-ph-megaphone'},
  {value: 'support', label: 'Support', icon: 'i-ph-headset'},
]
const orderOptions = [
  {value: 'newest', label: 'Newest first'},
  {value: 'oldest', label: 'Oldest first'},
  {value: 'name', label: 'Name A–Z'},
]

const searchActiveFilterCount = computed(() => {
  let count = 0
  if (searchStatusFilter.value.size > 0) count++
  if (searchCategoryFilter.value.size > 0) count++
  return count
})

// ColorPicker demo
const colorValue = ref('#3b82f6')
const colorWithDefault = ref('#ef4444')
const colorEmpty = ref('')

const activeSection = ref('buttons')
const checkerboard = ref(false)

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({behavior: 'smooth', block: 'start'})
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSection.value = entry.target.id
          }
        }
      },
      {rootMargin: '-20% 0px -60% 0px'},
  )

  for (const section of sections) {
    const el = document.getElementById(section.id)
    if (el) observer.observe(el)
  }

  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-neutral-950" :class="checkerboard && 'checkerboard'">
    <!-- Sidebar -->
    <aside
        class="fixed top-0 left-0 z-30 hidden h-screen w-52 border-r border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80 lg:block">
      <div class="flex h-full flex-col px-4 py-8">
        <h2 class="mb-6 text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Components
        </h2>
        <nav class="flex flex-col gap-1">
          <button
              v-for="s in sections"
              :key="s.id"
              class="rounded-md px-3 py-2 text-left text-sm font-medium transition-colors"
              :class="
              activeSection === s.id
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200'
            "
              @click="scrollTo(s.id)"
          >
            {{ s.label }}
          </button>
        </nav>
        <div class="mt-auto space-y-3 pt-4">
          <label class="flex cursor-pointer items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <USwitch v-model="checkerboard" size="sm"/>
            Checkerboard
          </label>
          <UColorModeSwitch/>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="lg:pl-52">
      <div class="mx-auto max-w-5xl space-y-16 p-8">
        <header>
          <div class="flex items-center justify-between">
            <h1 class="text-4xl font-bold text-neutral-900 dark:text-white">
              Stem Design System
            </h1>
            <div class="flex items-center gap-3">
              <label class="flex cursor-pointer items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <USwitch v-model="checkerboard" size="sm"/>
                Checkerboard
              </label>
              <UColorModeSwitch/>
            </div>
          </div>
          <p class="mt-2 text-lg text-neutral-500 dark:text-neutral-400">
            Component showcase — Nuxt UI v4 themed with @fullbrains/stem
          </p>
        </header>

        <!-- ======================================== -->
        <!-- Buttons                                  -->
        <!-- ======================================== -->
        <section id="buttons" class="scroll-mt-8 space-y-6">
          <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            Buttons
          </h2>

          <!-- Controls -->
          <div class="flex flex-wrap items-center gap-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 p-4">
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium uppercase text-neutral-500">Colors</span>
              <USelectMenu v-model="btnColors" :items="[...allButtonColors]" multiple class="w-44" size="xs"/>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium uppercase text-neutral-500">Variants</span>
              <USelectMenu v-model="btnVariants" :items="[...allButtonVariants]" multiple class="w-44" size="xs"/>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium uppercase text-neutral-500">Size</span>
              <USelectMenu v-model="btnSize" :items="[...sizes]" class="w-20" size="xs"/>
            </div>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="btnIcon" size="xs"/>
              Icon
            </label>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="btnTrailingIcon" size="xs"/>
              Trailing
            </label>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="btnLoading" size="xs"/>
              Loading
            </label>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="btnCaret" size="xs"/>
              Caret
            </label>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="btnDisabled" size="xs"/>
              Disabled
            </label>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="btnRounded" size="xs"/>
              Rounded
            </label>
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium uppercase text-neutral-500">Compact</span>
              <USelectMenu v-model="btnCompact" :items="[...compactOptions]" class="w-20" size="xs"/>
            </div>
          </div>

          <!-- Combinazioni -->
          <div v-for="variant in btnVariants" :key="variant">
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">{{ variant }}</h3>
            <div class="flex flex-wrap gap-3">
              <SButton
                  v-for="color in btnColors"
                  :key="color"
                  :label="color"
                  :color="color"
                  :variant="variant"
                  :size="btnSize"
                  :icon="btnIcon ? 'i-ph-folder-open' : undefined"
                  :trailing-icon="btnTrailingIcon ? 'i-ph-arrow-right' : undefined"
                  :loading="btnLoading"
                  :caret="btnCaret"
                  :disabled="btnDisabled"
                  :rounded="btnRounded"
                  :compact="resolvedBtnCompact"
              />
            </div>
          </div>

          <!-- Disc -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Disc</h3>
            <div class="flex flex-wrap items-center gap-3">
              <SButton v-for="size in sizes" :key="`disc-${size}`" disc icon="i-ph-plus" :size="size"
                       :compact="resolvedBtnCompact"/>
              <SButton disc icon="i-ph-x" variant="soft" :compact="resolvedBtnCompact"/>
              <SButton disc icon="i-ph-heart" variant="subtle" :compact="resolvedBtnCompact"/>
              <SButton disc icon="i-ph-trash" variant="soft" color="error" :compact="resolvedBtnCompact"/>
              <SButton disc icon="i-ph-check" variant="solid" :compact="resolvedBtnCompact"/>
              <SButton disc icon="i-ph-star" loading :compact="resolvedBtnCompact"/>
            </div>
          </div>


        </section>

        <!-- ======================================== -->
        <!-- Inputs                                   -->
        <!-- ======================================== -->
        <section id="inputs" class="scroll-mt-8 space-y-6">
          <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            Inputs
          </h2>

          <!-- Controls -->
          <div class="flex flex-wrap items-center gap-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 p-4">
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium uppercase text-neutral-500">Colors</span>
              <USelectMenu v-model="inputColors" :items="[...allInputColors]" multiple class="w-44" size="xs"/>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium uppercase text-neutral-500">Variants</span>
              <USelectMenu v-model="inputVariants" :items="[...allInputVariants]" multiple class="w-44" size="xs"/>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium uppercase text-neutral-500">Size</span>
              <USelectMenu v-model="inputSize" :items="[...sizes]" class="w-20" size="xs"/>
            </div>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="inputIcon" size="xs"/>
              Icon
            </label>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="inputDisabled" size="xs"/>
              Disabled
            </label>
          </div>

          <!-- Input -->
          <div>
            <h3 class="mb-2 text-lg font-semibold text-neutral-700 dark:text-neutral-300">Input</h3>
            <div v-for="variant in inputVariants" :key="`input-${variant}`" class="mb-4">
              <h4 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">{{ variant }}</h4>
              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <UInput v-for="color in inputColors" :key="color" :placeholder="color" :color="color" :variant="variant"
                        :size="inputSize" :icon="inputIcon ? 'i-ph-magnifying-glass' : undefined"
                        :disabled="inputDisabled"/>
              </div>
            </div>
          </div>

          <!-- Textarea -->
          <div>
            <h3 class="mb-2 text-lg font-semibold text-neutral-700 dark:text-neutral-300">Textarea</h3>
            <div v-for="variant in inputVariants" :key="`textarea-${variant}`" class="mb-4">
              <h4 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">{{ variant }}</h4>
              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <UTextarea v-for="color in inputColors" :key="color" :placeholder="color" :color="color"
                           :variant="variant"
                           :size="inputSize" :rows="2" :disabled="inputDisabled"/>
              </div>
            </div>
          </div>

          <!-- Select -->
          <div>
            <h3 class="mb-2 text-lg font-semibold text-neutral-700 dark:text-neutral-300">Select</h3>
            <div v-for="variant in inputVariants" :key="`select-${variant}`" class="mb-4">
              <h4 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">{{ variant }}</h4>
              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <USelect v-for="color in inputColors" :key="color" v-model="selectValue" :items="selectItems"
                         :placeholder="color" :color="color" :variant="variant" :size="inputSize"
                         :icon="inputIcon ? 'i-ph-list' : undefined" :disabled="inputDisabled"/>
              </div>
            </div>
          </div>

          <!-- SelectMenu -->
          <div>
            <h3 class="mb-2 text-lg font-semibold text-neutral-700 dark:text-neutral-300">SelectMenu</h3>
            <div v-for="variant in inputVariants" :key="`selectmenu-${variant}`" class="mb-4">
              <h4 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">{{ variant }}</h4>
              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <USelectMenu v-for="color in inputColors" :key="color" v-model="selectMenuValue"
                             :items="selectMenuItems"
                             :placeholder="color" :color="color" :variant="variant" :size="inputSize"
                             :icon="inputIcon ? 'i-ph-list' : undefined" :disabled="inputDisabled"/>
              </div>
            </div>
          </div>

          <!-- InputMenu -->
          <div>
            <h3 class="mb-2 text-lg font-semibold text-neutral-700 dark:text-neutral-300">InputMenu</h3>
            <div v-for="variant in inputVariants" :key="`inputmenu-${variant}`" class="mb-4">
              <h4 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">{{ variant }}</h4>
              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <UInputMenu v-for="color in inputColors" :key="color" v-model="inputMenuValue" :items="inputMenuItems"
                            :placeholder="color" :color="color" :variant="variant" :size="inputSize"
                            :icon="inputIcon ? 'i-ph-apple-logo' : undefined" :disabled="inputDisabled"/>
              </div>
            </div>
          </div>

        </section>

        <!-- ======================================== -->
        <!-- DropdownMenu                             -->
        <!-- ======================================== -->
        <section id="dropdown-menu" class="scroll-mt-8 space-y-6">
          <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            DropdownMenu
          </h2>

          <!-- Sizes (DropdownMenu has no variant/color props) -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Sizes</h3>
            <div class="flex flex-wrap items-center gap-3">
              <UDropdownMenu v-for="size in sizes" :key="size" :items="dropdownItems" :size="size">
                <SButton :label="size.toUpperCase()" variant="subtle" :size="size" icon="i-ph-caret-down"/>
              </UDropdownMenu>
            </div>
          </div>
        </section>

        <!-- ======================================== -->
        <!-- InputTags                                 -->
        <!-- ======================================== -->
        <section id="input-tags" class="scroll-mt-8 space-y-6">
          <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            InputTags
          </h2>

          <div v-for="variant in inputVariants" :key="`inputtags-${variant}`" class="mb-4">
            <h4 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">{{ variant }}</h4>
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <UInputTags v-for="color in inputColors" :key="color" v-model="inputTagsValue"
                          :placeholder="color" :color="color" :variant="variant" :size="inputSize"
                          :icon="inputIcon ? 'i-ph-tag' : undefined" :disabled="inputDisabled"/>
            </div>
          </div>
        </section>

        <!-- ======================================== -->
        <!-- Tabs                                      -->
        <!-- ======================================== -->
        <section id="tabs" class="scroll-mt-8 space-y-6">
          <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            Tabs
          </h2>

          <div v-for="variant in tabVariants" :key="variant">
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">{{ variant }}</h3>
            <div class="space-y-4">
              <UTabs :items="tabItems" :variant="variant"/>
            </div>
          </div>

          <!-- Sizes -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Sizes</h3>
            <div class="space-y-4">
              <UTabs v-for="size in sizes" :key="size" :items="tabItems" :size="size" variant="pill"/>
            </div>
          </div>
        </section>

        <!-- ======================================== -->
        <!-- Badges                                   -->
        <!-- ======================================== -->
        <section id="badges" class="scroll-mt-8 space-y-6">
          <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            Badges
          </h2>

          <!-- Color × Variant matrix -->
          <div v-for="variant in badgeVariants" :key="variant">
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">{{ variant }}</h3>
            <div class="flex flex-wrap gap-3">
              <UBadge v-for="color in allColors" :key="color" :label="color" :color="color" :variant="variant"
                      icon="i-ph-tag" trailing-icon="i-ph-x"/>
            </div>
          </div>

          <!-- Sizes -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Sizes</h3>
            <div class="flex flex-wrap items-center gap-3">
              <UBadge v-for="size in sizes" :key="size" :label="size.toUpperCase()" :size="size"/>
            </div>
          </div>

          <!-- Compact -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Compact (SBadge)</h3>
            <div class="flex flex-wrap items-center gap-3">
              <SBadge label="Normal" icon="i-ph-tag"/>
              <SBadge label="Compact" icon="i-ph-tag" compact/>
              <SBadge label="Compact X" icon="i-ph-tag" compact="x"/>
              <SBadge label="Compact Y" icon="i-ph-tag" compact="y"/>
            </div>
          </div>
        </section>

        <!-- ======================================== -->
        <!-- Alerts                                   -->
        <!-- ======================================== -->
        <section id="alerts" class="scroll-mt-8 space-y-6">
          <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            Alerts
          </h2>

          <!-- Color × Variant matrix -->
          <div v-for="variant in alertVariants" :key="variant">
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">{{ variant }}</h3>
            <div class="space-y-3">
              <UAlert v-for="color in allColors" :key="color" :title="color"
                      :description="`${variant} alert with ${color} color.`" :color="color" :variant="variant"
                      icon="i-ph-info"/>
            </div>
          </div>
        </section>

        <!-- ======================================== -->
        <!-- Popover                                  -->
        <!-- ======================================== -->
        <section id="popover" class="scroll-mt-8 space-y-6">
          <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            Popover
          </h2>

          <!-- Basic -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Basic (click)</h3>
            <div class="flex flex-wrap gap-3">
              <UPopover>
                <SButton label="Click me" variant="subtle"/>
                <template #content>
                  <div class="p-4 space-y-2 w-64">
                    <h4 class="font-semibold text-sm">Popover title</h4>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">This is a basic popover with some content
                      inside.</p>
                  </div>
                </template>
              </UPopover>

              <UPopover>
                <SButton label="With form" icon="i-ph-gear" variant="soft"/>
                <template #content>
                  <div class="p-4 space-y-3 w-72">
                    <h4 class="font-semibold text-sm">Settings</h4>
                    <UInput placeholder="Name" size="sm"/>
                    <UInput placeholder="Email" size="sm"/>
                    <SButton label="Save" size="sm" block/>
                  </div>
                </template>
              </UPopover>
            </div>
          </div>

          <!-- Hover -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Hover</h3>
            <div class="flex flex-wrap gap-3">
              <UPopover mode="hover">
                <SButton label="Hover me" variant="subtle" icon="i-ph-info"/>
                <template #content>
                  <div class="p-4 w-64">
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">This popover opens on hover.</p>
                  </div>
                </template>
              </UPopover>
            </div>
          </div>

          <!-- Arrow -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">With arrow</h3>
            <div class="flex flex-wrap gap-3">
              <UPopover arrow>
                <SButton label="With arrow" variant="soft"/>
                <template #content>
                  <div class="p-4 w-64">
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">Popover with an arrow indicator.</p>
                  </div>
                </template>
              </UPopover>
            </div>
          </div>

          <!-- Placement -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Placement</h3>
            <div class="flex flex-wrap gap-3">
              <UPopover v-for="side in (['top', 'right', 'bottom', 'left'] as const)" :key="side" :content="{ side }">
                <SButton :label="side" variant="subtle" size="sm"/>
                <template #content>
                  <div class="p-3">
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ side }} popover</p>
                  </div>
                </template>
              </UPopover>
            </div>
          </div>
        </section>

        <!-- ======================================== -->
        <!-- Search                                    -->
        <!-- ======================================== -->
        <section id="search" class="scroll-mt-8 space-y-6">
          <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            Search
          </h2>

          <!-- SearchBar variants -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">SearchBar Variants</h3>
            <div class="space-y-3">
              <SSearchBar v-model="searchQuery" placeholder="outline (default)"/>
              <SSearchBar v-model="searchQuery" variant="soft" placeholder="soft"/>
              <SSearchBar v-model="searchQuery" variant="subtle" placeholder="subtle"/>
              <SSearchBar v-model="searchQuery" variant="ghost" placeholder="ghost"/>
            </div>
          </div>

          <!-- SearchBar with filters -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">SearchBar + Filters</h3>
            <SSearchBar v-model="searchQuery" placeholder="Search projects..."
                        :active-filter-count="searchActiveFilterCount">
              <template #filters>
                <SSearchFilter
                    v-model="searchStatusFilter"
                    :options="statusOptions"
                    label="Status"
                />
                <SSearchFilter
                    v-model="searchCategoryFilter"
                    :options="categoryOptions"
                    label="Category"
                />
              </template>
              <template #trailing>
                <SSearchOrder v-model="searchOrder" :options="orderOptions"/>
              </template>
            </SSearchBar>
          </div>

          <!-- SearchBar with more -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">SearchBar + Filters +
              More</h3>
            <SSearchBar v-model="searchQuery" placeholder="Search projects..."
                        :active-filter-count="searchActiveFilterCount">
              <template #filters>
                <SSearchFilter
                    v-model="searchStatusFilter"
                    :options="statusOptions"
                    label="Status"
                />
              </template>
              <template #more>
                <SSearchFilter
                    v-model="searchCategoryFilter"
                    :options="categoryOptions"
                    label="Category"
                />
                <SSearchOrder v-model="searchOrder" :options="orderOptions"/>
              </template>
            </SSearchBar>
          </div>

          <!-- Standalone chips -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">SearchChip</h3>
            <div class="flex flex-wrap gap-2">
              <SSearchChip>Plain chip</SSearchChip>
              <SSearchChip leading-icon="i-ph-tag">With icon</SSearchChip>
              <SSearchChip label="Status" :selected-values="['Active', 'Pending']" :count="3"/>
              <SSearchChip label="All" :selected-values="['a','b','c']" :count="3"/>
            </div>
          </div>

          <!-- Standalone filter -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">SearchFilter</h3>
            <div class="flex flex-wrap gap-2">
              <SSearchFilter
                  v-model="searchStatusFilter"
                  :options="statusOptions"
                  label="Status"
              />
              <SSearchFilter
                  v-model="searchCategoryFilter"
                  :options="categoryOptions"
                  label="Category"
              />
            </div>
          </div>

          <!-- Single mode filter -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">SearchFilter (single mode)</h3>
            <div class="flex flex-wrap gap-2">
              <SSearchFilter
                  v-model="searchSingleFilter"
                  :options="statusOptions"
                  :multiple="false"
                  label="Status"
              />
            </div>
          </div>

          <!-- Standalone order -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">SearchOrder</h3>
            <SSearchOrder v-model="searchOrder" :options="orderOptions"/>
          </div>
        </section>

        <!-- ======================================== -->
        <!-- Cards                                    -->
        <!-- ======================================== -->
        <section id="cards" class="scroll-mt-8 space-y-6">
          <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            Cards
          </h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <UCard>
              <template #header>
                <h3 class="font-semibold">Card Title</h3>
              </template>
              <p class="text-neutral-500 dark:text-neutral-400">
                Card body content goes here.
              </p>
            </UCard>
            <UCard>
              <template #header>
                <h3 class="font-semibold">Another Card</h3>
              </template>
              <p class="text-neutral-500 dark:text-neutral-400">
                Another card with some description text.
              </p>
            </UCard>
          </div>
        </section>

        <!-- ======================================== -->
        <!-- Modal (SModal)                           -->
        <!-- ======================================== -->
        <section id="modal" class="scroll-mt-8 space-y-6">
          <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            Modal
          </h2>

          <!-- Basic -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Basic</h3>
            <SButton label="Open Modal" @click="openModal()"/>
          </div>

          <!-- Sizes -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Sizes</h3>
            <div class="flex flex-wrap gap-3">
              <SButton
                  v-for="s in (['sm', 'md', 'lg', 'xl'] as const)"
                  :key="s"
                  :label="s.toUpperCase()"
                  variant="soft"
                  @click="openModal({ size: s, title: `Size: ${s}` })"
              />
            </div>
          </div>

          <!-- Sides -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Sides</h3>
            <div class="flex flex-wrap gap-3">
              <SButton
                  v-for="s in (['top', 'right', 'bottom', 'left'] as const)"
                  :key="s"
                  :label="s"
                  variant="soft"
                  @click="openModal({ side: s, title: `Side: ${s}` })"
              />
            </div>
          </div>

          <!-- Compact Header -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Compact Header</h3>
            <div class="flex flex-wrap gap-3">
              <SButton
                  label="Compact"
                  icon="i-ph-arrows-in"
                  variant="soft"
                  @click="openModal({ headerCompact: true, title: 'Compact Header', icon: 'i-ph-gear' })"
              />
              <SButton
                  label="Normal"
                  icon="i-ph-arrows-out"
                  variant="soft"
                  @click="openModal({ title: 'Normal Header', icon: 'i-ph-gear' })"
              />
            </div>
          </div>

          <!-- Confirm dialogs -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Confirm dialogs</h3>
            <div class="flex flex-wrap gap-3">
              <SButton
                  label="Delete item"
                  icon="i-ph-trash"
                  destructive
                  confirm-title="Delete item?"
                  confirm-message="This action cannot be undone."
                  confirm-icon="i-ph-warning-circle"
                  :on-confirm="() => new Promise(r => setTimeout(r, 1500))"
              />
              <SButton
                  label="Confirm action"
                  icon="i-ph-check-circle"
                  confirm-title="Are you sure?"
                  confirm-message="Please confirm this action."
                  :on-confirm="() => new Promise(r => setTimeout(r, 1000))"
              />
              <SButton
                  label="Reset settings"
                  variant="soft"
                  confirm-title="Reset all settings?"
                  confirm-message="Your preferences will be restored to defaults."
                  confirm-icon="i-ph-arrow-counter-clockwise"
                  :on-confirm="() => new Promise(r => setTimeout(r, 1000))"
              />
              <SButton
                  label="Delete bot"
                  icon="i-ph-robot"
                  destructive
                  confirm-title="Delete Bot?"
                  confirm-message="This action is irreversible. Type <b>My Bot</b> to confirm."
                  confirm-icon="i-ph-warning-circle"
                  confirm-match="My Bot"
                  confirm-placeholder="Type the bot name"
                  :on-confirm="() => new Promise(r => setTimeout(r, 1500))"
              />
            </div>
          </div>
        </section>

        <!-- ======================================== -->
        <!-- Spinner                                   -->
        <!-- ======================================== -->
        <section id="spinner" class="scroll-mt-8 space-y-6">
          <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            Spinner
          </h2>

          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Sizes (rem)</h3>
            <div class="flex flex-wrap items-end gap-6">
              <div v-for="s in ['0.75rem', '1rem', '1.5rem', '2rem', '3rem', '4rem']" :key="s"
                   class="flex flex-col items-center gap-2">
                <SSpinner :size="s"/>
                <span class="text-xs text-neutral-500">{{ s }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Sizes (px)</h3>
            <div class="flex flex-wrap items-end gap-6">
              <div v-for="s in ['12px', '16px', '24px', '32px', '48px', '64px']" :key="s"
                   class="flex flex-col items-center gap-2">
                <SSpinner :size="s"/>
                <span class="text-xs text-neutral-500">{{ s }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Stroke</h3>
            <div class="flex flex-wrap items-end gap-6">
              <div v-for="sw in [1, 2, 3, 4]" :key="sw" class="flex flex-col items-center gap-2">
                <SSpinner size="2.5rem" :stroke="sw"/>
                <span class="text-xs text-neutral-500">stroke={{ sw }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Grow animation</h3>
            <div class="flex flex-wrap items-end gap-6">
              <div v-for="s in ['1rem', '2rem', '3rem']" :key="s" class="flex flex-col items-center gap-2">
                <SSpinner :size="s" grow/>
                <span class="text-xs text-neutral-500">{{ s }} grow</span>
              </div>
            </div>
          </div>
        </section>

        <!-- ======================================== -->
        <!-- Empty                                     -->
        <!-- ======================================== -->
        <section id="empty" class="scroll-mt-8 space-y-6">
          <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            Empty
          </h2>

          <!-- Vertical (default) -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Vertical (default)</h3>
            <div class="flex flex-wrap items-start gap-8">
              <SEmpty label="No results found"/>
              <SEmpty label="Nothing here yet" icon="i-ph-folder-open">
                <template #after>
                  <SButton label="Create new" size="sm" variant="soft" icon="i-ph-plus"/>
                </template>
              </SEmpty>
              <SEmpty icon="i-ph-magnifying-glass">
                <span>Custom <strong>slot</strong> text</span>
              </SEmpty>
            </div>
          </div>

          <!-- Horizontal -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Horizontal</h3>
            <div class="space-y-3">
              <SEmpty label="No items available" orientation="horizontal"/>
              <SEmpty label="Empty list" orientation="horizontal" icon="i-ph-list-dashes">
                <template #after>
                  <SButton label="Add item" size="sm" variant="soft" icon="i-ph-plus"/>
                </template>
              </SEmpty>
            </div>
          </div>

          <!-- Sizes -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Sizes</h3>
            <div class="flex flex-wrap items-start gap-8">
              <SEmpty v-for="size in sizes" :key="size" :label="size.toUpperCase()" :size="size"/>
            </div>
          </div>
        </section>
        <!-- ======================================== -->
        <!-- ColorPicker                               -->
        <!-- ======================================== -->
        <section id="color-picker" class="scroll-mt-8 space-y-6">
          <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            ColorPicker
          </h2>

          <!-- Sizes -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Sizes</h3>
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <SColorPicker v-for="size in sizes" :key="size" v-model="colorValue" :size="size"
                            :placeholder="size.toUpperCase()"/>
            </div>
          </div>

          <!-- Variants -->
          <div v-for="variant in inputVariants" :key="`colorpicker-${variant}`" class="mb-4">
            <h4 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">{{ variant }}</h4>
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SColorPicker
                  v-for="color in inputColors"
                  :key="color"
                  v-model="colorValue"
                  :variant="variant"
                  :color="color"
                  :size="inputSize"
                  :placeholder="color"
                  :disabled="inputDisabled"
              />
            </div>
          </div>

          <!-- With default (reset) -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">With default (reset)</h3>
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SColorPicker v-model="colorWithDefault" default-value="#3b82f6" placeholder="#hex" :size="inputSize"/>
            </div>
          </div>

          <!-- Allow empty -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Allow empty</h3>
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SColorPicker v-model="colorEmpty" allow-empty placeholder="Optional color" :size="inputSize"/>
            </div>
          </div>
        </section>
        <!-- ======================================== -->
        <!-- ScrollArea                                -->
        <!-- ======================================== -->
        <section id="scroll-area" class="scroll-mt-8 space-y-6">
          <h2 class="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
            ScrollArea
          </h2>

          <!-- Basic -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Basic (fixed height)</h3>
            <SScrollArea class="h-48 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div class="space-y-3 p-4">
                <div v-for="i in 20" :key="i" class="rounded-md bg-neutral-100 dark:bg-neutral-900 p-3 text-sm text-neutral-600 dark:text-neutral-400">
                  Item {{ i }}
                </div>
              </div>
            </SScrollArea>
          </div>

          <!-- Custom fade size -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Fade size: 3rem</h3>
            <SScrollArea class="h-48 rounded-lg border border-neutral-200 dark:border-neutral-800" fade-size="3rem">
              <div class="space-y-3 p-4">
                <div v-for="i in 20" :key="i" class="rounded-md bg-neutral-100 dark:bg-neutral-900 p-3 text-sm text-neutral-600 dark:text-neutral-400">
                  Item {{ i }}
                </div>
              </div>
            </SScrollArea>
          </div>

          <!-- On colored background (auto-detected) -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">On colored bg (auto-detected)</h3>
            <div class="rounded-lg bg-neutral-100 dark:bg-neutral-900 p-4">
              <SScrollArea class="h-40">
                <div class="space-y-3">
                  <div v-for="i in 15" :key="i" class="rounded-md bg-white dark:bg-neutral-800 p-3 text-sm text-neutral-600 dark:text-neutral-400">
                    Nested item {{ i }}
                  </div>
                </div>
              </SScrollArea>
            </div>
          </div>

          <!-- Fade disabled -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Fade disabled</h3>
            <SScrollArea class="h-48 rounded-lg border border-neutral-200 dark:border-neutral-800" :fade="false">
              <div class="space-y-3 p-4">
                <div v-for="i in 20" :key="i" class="rounded-md bg-neutral-100 dark:bg-neutral-900 p-3 text-sm text-neutral-600 dark:text-neutral-400">
                  Item {{ i }}
                </div>
              </div>
            </SScrollArea>
          </div>

          <!-- With padding on SScrollArea -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">With padding (p-4 on SScrollArea)</h3>
            <SScrollArea class="h-48 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col gap-3">
              <div v-for="i in 20" :key="i" class="rounded-md bg-neutral-100 dark:bg-neutral-900 p-3 text-sm text-neutral-600 dark:text-neutral-400">
                Item {{ i }}
              </div>
            </SScrollArea>
          </div>

          <!-- No overflow (no fade shown) -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">No overflow (no fade)</h3>
            <SScrollArea class="h-48 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div class="space-y-3 p-4">
                <div v-for="i in 3" :key="i" class="rounded-md bg-neutral-100 dark:bg-neutral-900 p-3 text-sm text-neutral-600 dark:text-neutral-400">
                  Item {{ i }}
                </div>
              </div>
            </SScrollArea>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
