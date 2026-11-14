<script setup lang="ts">
/**
 * Tutte le combinazioni di due assi (es. variant × color) in una griglia,
 * una per tema attivo. Lo slot `cell` riceve `{row, col, mode}`.
 * Niente misure qui: la matrice serve a confrontare i colori.
 */
defineProps<{
  rows: string[]
  cols: string[]
}>()
</script>

<template>
  <ShowcaseStage body-class="overflow-x-auto p-6">
    <template #default="{mode}">
      <table class="mx-auto border-separate border-spacing-x-4 border-spacing-y-3">
        <thead>
          <tr>
            <th/>
            <th v-for="col in cols" :key="col" class="text-center font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row">
            <th class="pr-2 text-right font-mono text-[10px] font-normal text-(--ui-text-dimmed)">{{ row }}</th>
            <td v-for="col in cols" :key="col" class="text-center align-middle">
              <slot name="cell" :row="row" :col="col" :mode="mode"/>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </ShowcaseStage>
</template>
