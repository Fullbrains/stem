import {defineNuxtModule, addComponentsDir, addImportsDir, addTemplate, createResolver} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@fullbrains/stem',
    configKey: 'stem',
  },
  setup(_options, nuxt) {
    const {resolve} = createResolver(import.meta.url)

    // Register stem as a layer (injects app.config.ts with theme, colors, icons)
    nuxt.options._layers.push({
      cwd: resolve('./'),
      config: {
        rootDir: resolve('./'),
        srcDir: resolve('./'),
      },
    })

    addComponentsDir({
      path: resolve('./components'),
    })

    addImportsDir(resolve('./composables'))

    // Inject Stem's CSS (before app CSS so app can override)
    nuxt.options.css.unshift(resolve('./css/base.css'))

    // Tell Tailwind to scan Stem's source files
    const stemSource = resolve('./')
    const tpl = addTemplate({
      filename: 'stem-source.css',
      write: true,
      getContents: () => `@source "${stemSource}";`,
    })
    nuxt.options.css.push(tpl.dst)
  },
})
