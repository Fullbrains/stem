<script setup lang="ts">
import type {DropdownMenuItem} from '@nuxt/ui'

const allColors = ['primary', 'neutral', 'error', 'success'] as const
const allButtonColors = ['primary', 'neutral', 'error'] as const
const allButtonVariants = ['solid', 'soft', 'subtle'] as const
const allInputColors = ['primary', 'error', 'success'] as const
const allInputVariants = ['outline', 'soft', 'subtle', 'ghost', 'none'] as const
const badgeVariants = ['solid', 'outline', 'soft', 'subtle'] as const
const alertVariants = ['solid', 'outline', 'soft', 'subtle'] as const
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const dropdownItems: DropdownMenuItem[] = [
  {label: 'Profile', icon: 'i-lucide-user'},
  {label: 'Settings', icon: 'i-lucide-cog', disabled: true},
  {type: 'separator'},
  {label: 'Logout', icon: 'i-lucide-log-out'},
]

const selectItems = [
  {label: 'Backlog', value: 'backlog', icon: 'i-lucide-circle-dashed'},
  {label: 'Todo', value: 'todo', icon: 'i-lucide-circle'},
  {label: 'In Progress', value: 'in_progress', icon: 'i-lucide-loader', disabled: true},
  {label: 'Done', value: 'done', icon: 'i-lucide-circle-check'},
]
const selectValue = ref('todo')

const selectMenuItems = [
  {label: 'Backlog', value: 'backlog', icon: 'i-lucide-circle-dashed'},
  {label: 'Todo', value: 'todo', icon: 'i-lucide-circle'},
  {label: 'In Progress', value: 'in_progress', icon: 'i-lucide-loader', disabled: true},
  {label: 'Done', value: 'done', icon: 'i-lucide-circle-check'},
]
const selectMenuValue = ref('todo')

const inputMenuItems = [
  {label: 'Apple', icon: 'i-lucide-apple'},
  {label: 'Banana', icon: 'i-lucide-banana'},
  {label: 'Cherry', icon: 'i-lucide-cherry', disabled: true},
  {label: 'Grape', icon: 'i-lucide-grape'},
  {label: 'Lemon', icon: 'i-lucide-citrus'},
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
  {id: 'cards', label: 'Cards'},
  {id: 'modal', label: 'Modal'},
  {id: 'spinner', label: 'Spinner'},
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

// Input configurator (persisted)
const inputColors = useCookie<string[]>('stem-input-colors', {default: () => [...allInputColors]})
const inputVariants = useCookie<string[]>('stem-input-variants', {default: () => [...allInputVariants]})
const inputSize = useCookie('stem-input-size', {default: () => 'md'})
const inputIcon = useCookie('stem-input-icon', {default: () => true})
const inputDisabled = useCookie('stem-input-disabled', {default: () => false})

const tabItems = [
  {label: 'Account', icon: 'i-lucide-user'},
  {label: 'Password', icon: 'i-lucide-lock'},
  {label: 'Notifications', icon: 'i-lucide-bell'},
]
const tabVariants = ['pill', 'link'] as const

const inputTagsValue = ref(['Vue', 'Nuxt'])

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
                <USwitch v-model="checkerboard" size="sm" />
                Checkerboard
              </label>
              <UColorModeSwitch />
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
              <USelectMenu v-model="btnColors" :items="[...allButtonColors]" multiple class="w-44" size="xs" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium uppercase text-neutral-500">Variants</span>
              <USelectMenu v-model="btnVariants" :items="[...allButtonVariants]" multiple class="w-44" size="xs" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium uppercase text-neutral-500">Size</span>
              <USelectMenu v-model="btnSize" :items="[...sizes]" class="w-20" size="xs" />
            </div>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="btnIcon" size="xs" /> Icon
            </label>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="btnTrailingIcon" size="xs" /> Trailing
            </label>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="btnLoading" size="xs" /> Loading
            </label>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="btnCaret" size="xs" /> Caret
            </label>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="btnDisabled" size="xs" /> Disabled
            </label>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="btnRounded" size="xs" /> Rounded
            </label>
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
                  :icon="btnIcon ? 'i-lucide-star' : undefined"
                  :trailing-icon="btnTrailingIcon ? 'i-lucide-arrow-right' : undefined"
                  :loading="btnLoading"
                  :caret="btnCaret"
                  :disabled="btnDisabled"
                  :rounded="btnRounded"
              />
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
              <USelectMenu v-model="inputColors" :items="[...allInputColors]" multiple class="w-44" size="xs" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium uppercase text-neutral-500">Variants</span>
              <USelectMenu v-model="inputVariants" :items="[...allInputVariants]" multiple class="w-44" size="xs" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium uppercase text-neutral-500">Size</span>
              <USelectMenu v-model="inputSize" :items="[...sizes]" class="w-20" size="xs" />
            </div>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="inputIcon" size="xs" /> Icon
            </label>
            <label class="flex items-center gap-1.5 text-xs font-medium uppercase text-neutral-500">
              <USwitch v-model="inputDisabled" size="xs" /> Disabled
            </label>
          </div>

          <!-- Input -->
          <div>
            <h3 class="mb-2 text-lg font-semibold text-neutral-700 dark:text-neutral-300">Input</h3>
            <div v-for="variant in inputVariants" :key="`input-${variant}`" class="mb-4">
              <h4 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">{{ variant }}</h4>
              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <UInput v-for="color in inputColors" :key="color" :placeholder="color" :color="color" :variant="variant"
                        :size="inputSize" :icon="inputIcon ? 'i-lucide-search' : undefined" :disabled="inputDisabled"/>
              </div>
            </div>
          </div>

          <!-- Textarea -->
          <div>
            <h3 class="mb-2 text-lg font-semibold text-neutral-700 dark:text-neutral-300">Textarea</h3>
            <div v-for="variant in inputVariants" :key="`textarea-${variant}`" class="mb-4">
              <h4 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">{{ variant }}</h4>
              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <UTextarea v-for="color in inputColors" :key="color" :placeholder="color" :color="color" :variant="variant"
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
                         :icon="inputIcon ? 'i-lucide-list' : undefined" :disabled="inputDisabled"/>
              </div>
            </div>
          </div>

          <!-- SelectMenu -->
          <div>
            <h3 class="mb-2 text-lg font-semibold text-neutral-700 dark:text-neutral-300">SelectMenu</h3>
            <div v-for="variant in inputVariants" :key="`selectmenu-${variant}`" class="mb-4">
              <h4 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">{{ variant }}</h4>
              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <USelectMenu v-for="color in inputColors" :key="color" v-model="selectMenuValue" :items="selectMenuItems"
                             :placeholder="color" :color="color" :variant="variant" :size="inputSize"
                             :icon="inputIcon ? 'i-lucide-list' : undefined" :disabled="inputDisabled"/>
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
                            :icon="inputIcon ? 'i-lucide-apple' : undefined" :disabled="inputDisabled"/>
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
                <SButton :label="size.toUpperCase()" variant="subtle" :size="size" icon="i-lucide-chevron-down"/>
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
                          :icon="inputIcon ? 'i-lucide-tags' : undefined" :disabled="inputDisabled"/>
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
              <UTabs :items="tabItems" :variant="variant" />
            </div>
          </div>

          <!-- Sizes -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Sizes</h3>
            <div class="space-y-4">
              <UTabs v-for="size in sizes" :key="size" :items="tabItems" :size="size" variant="pill" />
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
                      icon="i-lucide-tag" trailing-icon="i-lucide-x"/>
            </div>
          </div>

          <!-- Sizes -->
          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Sizes</h3>
            <div class="flex flex-wrap items-center gap-3">
              <UBadge v-for="size in sizes" :key="size" :label="size.toUpperCase()" :size="size"/>
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
                      icon="i-lucide-info"/>
            </div>
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
              <div v-for="s in ['0.75rem', '1rem', '1.5rem', '2rem', '3rem', '4rem']" :key="s" class="flex flex-col items-center gap-2">
                <SSpinner :size="s" />
                <span class="text-xs text-neutral-500">{{ s }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Sizes (px)</h3>
            <div class="flex flex-wrap items-end gap-6">
              <div v-for="s in ['12px', '16px', '24px', '32px', '48px', '64px']" :key="s" class="flex flex-col items-center gap-2">
                <SSpinner :size="s" />
                <span class="text-xs text-neutral-500">{{ s }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Stroke</h3>
            <div class="flex flex-wrap items-end gap-6">
              <div v-for="sw in [1, 2, 3, 4]" :key="sw" class="flex flex-col items-center gap-2">
                <SSpinner size="2.5rem" :stroke="sw" />
                <span class="text-xs text-neutral-500">stroke={{ sw }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">Grow animation</h3>
            <div class="flex flex-wrap items-end gap-6">
              <div v-for="s in ['1rem', '2rem', '3rem']" :key="s" class="flex flex-col items-center gap-2">
                <SSpinner :size="s" grow />
                <span class="text-xs text-neutral-500">{{ s }} grow</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
