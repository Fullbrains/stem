import {addComponent, addPluginTemplate, createResolver, defineNuxtModule} from '@nuxt/kit'
import {join} from 'node:path'

export interface StemStandaloneOptions {
  /**
   * Directory (relative to the app source dir) containing the project's SVG
   * icons. Every `.svg` file inside it (recursive) becomes resolvable by
   * `<SIcon name="...">`, using the path relative to this directory as the
   * icon name (without the `.svg` extension).
   *
   * Default: `'assets/icons'` — resolves to `<srcDir>/assets/icons`, i.e.
   * `app/assets/icons` in a standard Nuxt 4 project.
   */
  iconsDir?: string
}

/**
 * Stem "standalone" module — the subset of Stem that does NOT require
 * `@nuxt/ui`. Today that's `SIcon` and `SSpinner`; more standalone
 * components will live here in the future.
 *
 * What it does:
 *   1. Auto-registers `SIcon` and `SSpinner` as global components.
 *   2. Generates a plugin that globs the project's SVG icons and provides
 *      the loader that `SIcon` injects via `STEM_ICON_LOADER`.
 *
 * Usage:
 *   modules: [
 *     '@fullbrains/stem/standalone',
 *     // or with custom dir:
 *     ['@fullbrains/stem/standalone', {iconsDir: 'app/assets/my-icons'}],
 *   ]
 *
 * Also installed transitively by the full `@fullbrains/stem/nuxt` module —
 * projects that register the full module get this behaviour for free.
 */
export default defineNuxtModule<StemStandaloneOptions>({
  meta: {
    name: '@fullbrains/stem/standalone',
    configKey: 'stemStandalone',
  },
  defaults: {
    iconsDir: 'assets/icons',
  },
  setup(options, nuxt) {
    const {resolve} = createResolver(import.meta.url)

    // Register the standalone components globally. Use a non-zero priority so
    // that when the full Stem module also runs `addComponentsDir` over the
    // same files, these registrations win without emitting an override warning.
    addComponent({
      name: 'SIcon',
      filePath: resolve('./components/SIcon.vue'),
      priority: 10,
    })
    addComponent({
      name: 'SSpinner',
      filePath: resolve('./components/SSpinner.vue'),
      priority: 10,
    })

    // Resolve the icons directory to an absolute path rooted in the consumer
    // project. We intentionally avoid relying on Nuxt aliases (`~`, `@`) —
    // `import.meta.glob` is parsed by Vite statically and does not expand
    // aliases, so the emitted plugin must contain a literal absolute path.
    // Vite always uses forward slashes for glob keys, so we normalize here
    // to keep the path comparison in the plugin working on Windows too.
    const srcDir = nuxt.options.srcDir || nuxt.options.rootDir
    const iconsAbsPath = join(srcDir, options.iconsDir!).replace(/\\/g, '/')

    addPluginTemplate({
      filename: 'stem-standalone.plugin.ts',
      write: true,
      getContents: () => `import {STEM_ICON_LOADER, type StemIconLoader} from '@fullbrains/stem/icon-loader'
import {defineNuxtPlugin} from '#imports'

// Glob resolved at build time by Vite, relative to the consumer project.
const icons = import.meta.glob(${JSON.stringify(`${iconsAbsPath}/**/*.svg`)}, {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

const ICONS_ROOT = ${JSON.stringify(`${iconsAbsPath}/`)}

const loader: StemIconLoader = async (name) => {
  const suffix = \`\${ICONS_ROOT}\${name}.svg\`
  const entry = Object.entries(icons).find(([path]) => path === suffix)
  return entry ? await entry[1]() : null
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide(STEM_ICON_LOADER, loader)
})
`,
    })
  },
})
