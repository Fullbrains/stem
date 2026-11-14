<script setup lang="ts">
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const


const selectItems = ['Backlog', 'Todo', 'Done']
const tabsItems = [{label: 'Uno', icon: 'i-ph-house'}, {label: 'Due'}]
</script>

<template>
  <ShowcasePage
      title="Dimensioni"
      description="Una scala sola: a parità di size ogni componente ha lo stesso testo, icona, padding, gap e raggio. Il leading è uguale all'icona, quindi l'altezza è icona + 2 × padding."
  >
    <ShowcaseSection title="Scala" description="Testo, icona (= leading), space e roundness di ogni size. L'altezza di un controllo è icona + 2 × space.">
      <ShowcaseStage body-class="space-y-3 p-6">
        <div v-for="s in sizes" :key="s" class="flex items-baseline gap-6">
          <span class="w-8 font-mono text-[11px] text-(--ui-text-muted)">{{ s }}</span>
          <ShowcaseMeasure labels>
            <span :class="`s-size-${s}`" class="inline-flex items-center gap-(--s-gap) text-(length:--s-text) leading-(--s-icon-size)">
              <UIcon name="i-ph-floppy-disk" class="size-(--s-icon-size)"/>
              Il pulsante salva il documento
            </span>
          </ShowcaseMeasure>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Componenti alla stessa size"
        description="Ogni componente con size, affiancato: a parità di size, stessa altezza."
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
            <SInput :size="s" placeholder="Cerca…" icon="i-ph-magnifying-glass" class="w-40"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <SSelect :size="s" :items="selectItems" model-value="Todo" class="w-32"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <SBadge :size="s" label="Bozza" icon="i-ph-file" variant="soft"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <SButton :size="s" icon="i-ph-gear" rounded variant="soft"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <STabs :size="s" :items="tabsItems" :content="false"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <SCheckbox :size="s" label="Ricorda" :default-value="true"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <SSwitch :size="s" label="Attivo" :default-value="true"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <SColorPicker :size="s" model-value="#3b82f6" class="w-36"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <SSearchBar :size="s" placeholder="Cerca…" class="w-56"/>
          </ShowcaseMeasure>
          <ShowcaseMeasure labels>
            <SInputTags :size="s" :model-value="['Vue', 'Nuxt']" class="w-96"/>
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
              <SInput placeholder="nome@azienda.it" class="w-48"/>
              <SButton label="Invita" color="neutral" variant="soft"/>
            </UFieldGroup>
          </ShowcaseMeasure>
        </div>
      </ShowcaseStage>
    </ShowcaseSection>

    <ShowcaseSection
        title="Ereditata dal parent"
        description="SScale passa le prop di scala a tutto quello che contiene: chi non ne dà una prende quella del parent più vicino, chi la dà vince. Sotto: un SScale sm, con dentro un SScale lg space xs, e un button che forza xl."
    >
      <ShowcaseStage body-class="space-y-6 p-8">
        <SScale size="sm">
          <div class="flex flex-wrap items-center gap-3">
            <SButton icon="i-ph-floppy-disk" label="Salva"/>
            <SBadge label="Bozza" icon="i-ph-file"/>
            <SInput placeholder="Cerca" icon="i-ph-magnifying-glass" class="w-40"/>
            <SSelect :items="['Uno', 'Due']" placeholder="Scegli" class="w-32"/>
            <SModalButton icon="i-ph-arrow-square-out" aria-label="Apri"/>
          </div>
          <SScale size="lg" space="xs" class="mt-4">
            <div class="flex flex-wrap items-center gap-3">
              <SButton icon="i-ph-floppy-disk" label="Salva"/>
              <SBadge label="Bozza" icon="i-ph-file"/>
              <SInput placeholder="Cerca" icon="i-ph-magnifying-glass" class="w-40"/>
              <SButton icon="i-ph-floppy-disk" label="Forzato xl" size="xl"/>
            </div>
          </SScale>
        </SScale>
      </ShowcaseStage>
    </ShowcaseSection>
  </ShowcasePage>
</template>
