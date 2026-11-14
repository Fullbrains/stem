<script setup lang="ts">
// Dove si usa ogni raggio, letto da src/ (grep di `--s-radius`).
const radii = [
  {px: 6, where: 'input, textarea, select, ColorPicker'},
  {px: 8, where: 'button, popover del ColorPicker'},
  {px: 10, where: 'menu a tendina, popover'},
  {px: 12, where: 'slideover'},
  {px: 16, where: 'SModal'},
]

const superellipse = ref(true)
</script>

<template>
  <ShowcasePage
      title="Raggi e angoli"
      description="Gli angoli di Stem: --s-radius sull'elemento e la classe s-corner. Dove il browser supporta corner-shape il raggio cresce di 1.33 e diventa una superellisse."
  >
    <ShowcaseSection title="Scala" description="Ogni raggio in uso, su un riquadro e su un elemento vero.">
      <div class="mb-2 flex justify-end">
        <ShowcaseToggle v-model="superellipse" label="Superellisse (s-corner)"/>
      </div>
      <ShowcaseStage body-class="flex flex-wrap items-end justify-center gap-8 p-8">
        <div v-for="r in radii" :key="r.px" class="flex w-32 flex-col items-center gap-2 text-center">
          <div
              class="size-24 bg-(--ui-bg-elevated) ring-1 ring-(--ui-border-accented)"
              :class="superellipse && 's-corner'"
              :style="superellipse ? {'--s-radius': `${r.px}px`} : {borderRadius: `${r.px}px`}"
          />
          <span class="font-mono text-[11px] text-(--ui-text-highlighted)">{{ r.px }}px</span>
          <span class="text-[10px] leading-snug text-(--ui-text-muted)">{{ r.where }}</span>
        </div>
        <div class="flex w-32 flex-col items-center gap-2 text-center">
          <div class="size-24 rounded-full bg-(--ui-bg-elevated) ring-1 ring-(--ui-border-accented)"/>
          <span class="font-mono text-[11px] text-(--ui-text-highlighted)">full</span>
          <span class="text-[10px] leading-snug text-(--ui-text-muted)">disc, rounded, badge pill: mai superellisse</span>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection title="Proporzione fra raggio e altezza" description="Lo stesso raggio su elementi di altezze diverse: un input xs e un button xl hanno ancora angoli coerenti?">
      <ShowcaseStage body-class="flex flex-wrap items-center justify-center gap-6 p-8">
        <SButton size="xs" label="xs"/>
        <SButton size="sm" label="sm"/>
        <SButton size="md" label="md"/>
        <SButton size="lg" label="lg"/>
        <SButton size="xl" label="xl"/>
        <UInput size="xs" placeholder="xs" class="w-20"/>
        <UInput size="xl" placeholder="xl" class="w-24"/>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection title="Gruppi" description="In un UFieldGroup gli angoli interni si azzerano (s-field-group).">
      <ShowcaseStage>
        <UFieldGroup>
          <UInput placeholder="Cerca…" class="w-40"/>
          <SButton label="Vai" color="neutral" variant="soft"/>
        </UFieldGroup>
        <UFieldGroup>
          <SButton label="Uno" variant="soft"/>
          <SButton label="Due" variant="soft"/>
          <SButton label="Tre" variant="soft"/>
        </UFieldGroup>
        <UFieldGroup>
          <SButton label="Rounded" variant="soft" rounded/>
          <SButton icon="i-ph-caret-down" variant="soft" rounded/>
        </UFieldGroup>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
