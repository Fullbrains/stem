import {defineNuxtModule, addComponentsDir, addImportsDir, addTemplate, createResolver, installModule} from '@nuxt/kit'
import {defu} from 'defu'
import {stemAppConfig} from './stem-config'
import type {StemStandaloneOptions} from './standalone'

export interface StemModuleOptions {
  /**
   * Directory containing the project's SVG icons, resolvable by `<SIcon>`.
   * Forwarded to the Stem standalone sub-module.
   *
   * Default: `'assets/icons'`.
   */
  iconsDir?: string
}

export default defineNuxtModule<StemModuleOptions>({
  meta: {
    name: '@fullbrains/stem',
    configKey: 'stem',
  },
  defaults: {
    iconsDir: 'assets/icons',
  },
  async setup(options, nuxt) {
    const {resolve} = createResolver(import.meta.url)

    // Install the standalone sub-module so SIcon/SSpinner get registered and
    // the icon loader gets provided to the app. Kept here so projects that use
    // the full Stem module don't need to register two modules separately.
    const standaloneOptions: StemStandaloneOptions = {
      iconsDir: options.iconsDir,
    }
    await installModule(resolve('./standalone'), standaloneOptions)

    // Inject Stem theme on top of Nuxt UI defaults.
    // At runtime, Nuxt re-applies the user's app.config.ts via defuFn(userConfig, inlineConfig),
    // so user overrides always win.
    nuxt.options.appConfig.ui = nuxt.options.appConfig.ui || {}
    for (const [key, value] of Object.entries(stemAppConfig.ui)) {
      if (key === 'colors') {
        // Colors must override Nuxt UI defaults (e.g. secondary: 'blue' → 'iron').
        // Using Object.assign ensures Stem values win over getDefaultConfig() values.
        nuxt.options.appConfig.ui[key] = Object.assign(nuxt.options.appConfig.ui[key] || {}, value)
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        nuxt.options.appConfig.ui[key] = defu(value, nuxt.options.appConfig.ui[key] || {})
      } else {
        nuxt.options.appConfig.ui[key] = value
      }
    }

    addComponentsDir({
      path: resolve('./components'),
    })

    addImportsDir(resolve('./composables'))

    // Allow Vite to serve Stem's source files (needed for linked/local installs)
    const stemRoot = resolve('./')
    nuxt.hook('vite:extendConfig', (config) => {
      // @ts-expect-error -- vite config typing marks server as readonly but it's mutable here
      config.server = config.server || {}
      config.server.fs = config.server.fs || {}
      config.server.fs.allow = config.server.fs.allow || []
      config.server.fs.allow.push(stemRoot)
    })

    // Inject Stem's CSS (before app CSS so app can override)
    nuxt.options.css.unshift(resolve('./css/base.css'))

    // Collect all CSS classes from stem theme so Tailwind can generate them.
    // Stem classes are injected via appConfig (not in any scanned source file),
    // so we write them into a file inside .nuxt/ and add it to Nuxt UI's @source list.
    function collectStrings(obj: any): string[] {
      if (typeof obj === 'string') return [obj]
      if (Array.isArray(obj)) return obj.flatMap(collectStrings)
      if (obj && typeof obj === 'object') return Object.values(obj).flatMap(collectStrings)
      return []
    }

    const blob = collectStrings(stemAppConfig.ui).join(' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()

    const classesFile = addTemplate({
      filename: 'stem-classes.html',
      write: true,
      getContents: () => `<div class="${blob}"></div>`,
    })

    // Append @source and @theme (color palettes) to the Nuxt UI generated ui.css
    const stemComponents = resolve('./components')
    const colorsThemeCss = resolve('./css/colors-theme.css')
    nuxt.hook('build:before', async () => {
      const {join} = await import('pathe')
      const {promises: fs} = await import('fs')
      const uiCss = join(nuxt.options.buildDir, 'ui.css')
      try {
        const content = await fs.readFile(uiCss, 'utf-8')
        if (!content.includes('/* Stem */')) {
          const colorsTheme = await fs.readFile(colorsThemeCss, 'utf-8')
          const injection = `\n/* Stem */\n@source "${stemComponents}";\n@source "./${classesFile.filename}";\n${colorsTheme}\n`
          await fs.writeFile(uiCss, injection + content, 'utf-8')
        }
      } catch {
      }
    })
  },
})
