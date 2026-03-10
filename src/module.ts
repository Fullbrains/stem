import {defineNuxtModule, addComponentsDir, addImportsDir, addTemplate, createResolver} from '@nuxt/kit'
import {defu} from 'defu'
import {stemAppConfig} from './stem-config'

export default defineNuxtModule({
  meta: {
    name: '@fullbrains/stem',
    configKey: 'stem',
  },
  setup(_options, nuxt) {
    const {resolve} = createResolver(import.meta.url)

    // Inject Stem theme as defaults (app.config.ts merges on top via defu)
    nuxt.options.appConfig = defu(nuxt.options.appConfig, stemAppConfig)

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
