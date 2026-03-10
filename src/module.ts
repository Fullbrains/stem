import {defineNuxtModule, addComponentsDir, addImportsDir, addTemplate, createResolver} from '@nuxt/kit'
import {stemIcons, stemColors} from './config'
import {stem} from './theme'

export default defineNuxtModule({
  meta: {
    name: '@fullbrains/stem',
    configKey: 'stem',
  },
  setup(_options, nuxt) {
    const {resolve} = createResolver(import.meta.url)

    addComponentsDir({
      path: resolve('./components'),
    })

    addImportsDir(resolve('./composables'))

    // Inject Stem theme, colors & icons (overrides Nuxt UI defaults, app.config.ts merges on top)
    nuxt.options.appConfig.ui = nuxt.options.appConfig.ui || {}
    nuxt.options.appConfig.ui.colors = nuxt.options.appConfig.ui.colors || {}
    nuxt.options.appConfig.ui.icons = nuxt.options.appConfig.ui.icons || {}
    Object.assign(nuxt.options.appConfig.ui.colors, stemColors)
    Object.assign(nuxt.options.appConfig.ui.icons, stemIcons)
    Object.assign(nuxt.options.appConfig.ui, stem)

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
