<template>
  <span
      :class="{ 's-icon--prop': proportional, 's-icon--constrained': constrained }"
      class="s-icon"
      v-html="source"
  />
</template>

<script>
export default {
  props: {
    name: {type: String, required: true},
    proportional: {type: Boolean, default: false},
    constrained: {type: Boolean, default: false}
  },
  emits: ['ready'],
  data() {
    return {
      source: ''
    }
  },
  watch: {
    name() {
      this.load()
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    async load() {
      try {
        const iconsImport = import.meta.glob('assets/icons/**/**.svg', {
          query: '?raw',
          import: 'default',
          eager: false
        })
        const loader = iconsImport[`/assets/icons/${this.name}.svg`]
        if (loader) {
          this.source = await loader()
        }
        this.$nextTick(() => {
          this.$emit('ready')
        })
      } catch {
        this.$emit('ready') // Emetti comunque per non bloccare
      }
    }
  }
}
</script>

<style>
.s-icon svg *[fill='black'],
.s-icon svg *[fill='#000'],
.s-icon svg *[fill='#000000'] {
  fill: currentColor !important;
}

.s-icon svg *[stroke='black'],
.s-icon svg *[stroke='#000'],
.s-icon svg *[stroke='#000000'] {
  stroke: currentColor !important;
}

.s-icon--prop svg {
  width: 100%;
  height: 100%;
}

/* Safari fix: prevent SVG expansion in flex containers */
.s-icon--prop.s-icon--constrained svg {
  width: auto;
}
</style>
