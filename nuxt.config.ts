export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint', './src/module'],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2026-03-06',
  watch: ['src/theme/**', 'src/config.ts'],
  devServer: {
    port: 3272,
  },
})
