<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const textClass: Record<string, string> = {
  xs: 'text-xs', sm: 'text-sm', md: 'text-base', lg: 'text-lg', xl: 'text-xl',
}

const selectItems = ['Backlog', 'Todo', 'Done']
const tabsItems = [{label: 'Uno'}, {label: 'Due'}]
</script>

<template>
  <ShowcasePage
      title="Dimensioni"
      description="La regola d'oro: xs→text-xs, sm→text-sm, md→text-base, lg→text-lg, xl→text-xl, padding in em. Qui ogni riga è una size, con tutti i componenti affiancati per confrontare le altezze."
  >
    <ShowcaseSection title="Testo" description="La scala del testo che guida ogni size.">
      <ShowcaseStage body-class="space-y-3 p-6">
        <div v-for="s in sizes" :key="s" class="flex items-baseline gap-6">
          <span class="w-8 font-mono text-[11px] text-(--ui-text-muted)">{{ s }}</span>
          <ShowcaseMeasure labels>
            <span :class="textClass[s]">Il pulsante salva il documento</span>
          </ShowcaseMeasure>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Componenti alla stessa size"
        description="Button, input, select, badge e tabs sulla stessa riga: devono avere altezze coerenti."
    >
      <ShowcaseStage body-class="space-y-6 p-6">
        <div v-for="s in sizes" :key="s" class="flex flex-wrap items-start gap-5">
          <span class="w-8 pt-2 font-mono text-[11px] text-(--ui-text-muted)">{{ s }}</span>
          <ShowcaseMeasure labels>
            <SButton :size="s" label="Salva" icon="i-ph-floppy-disk"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <SButton :size="s" label="Annulla" variant="soft"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <UInput :size="s" placeholder="Cerca…" icon="i-ph-magnifying-glass" class="w-40"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <USelect :size="s" :items="selectItems" model-value="Todo" class="w-32"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <SBadge :size="s" label="Bozza" variant="soft"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <UTabs :size="s" :items="tabsItems" :content="false"/>
          </ShowcaseMeasure>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection title="In gruppo" description="UFieldGroup: input e button devono combaciare a ogni size.">
      <ShowcaseStage body-class="space-y-4 p-6">
        <div v-for="s in sizes" :key="s" class="flex items-center gap-5">
          <span class="w-8 font-mono text-[11px] text-(--ui-text-muted)">{{ s }}</span>
          <ShowcaseMeasure labels>
            <UFieldGroup :size="s">
              <UInput placeholder="nome@azienda.it" class="w-48"/>
              <SButton label="Invita" color="neutral" variant="soft"/>
            </UFieldGroup>
          </ShowcaseMeasure>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
