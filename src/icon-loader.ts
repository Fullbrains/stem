import type { InjectionKey } from 'vue'

/**
 * A function that, given an icon name (e.g. "logotype" or "brand/wordmark"),
 * returns the raw SVG source as a string (or null if not found).
 *
 * Consumers typically build this from `import.meta.glob` with `query: '?raw'`
 * so that Vite resolves the icon folder relative to their own project.
 */
export type StemIconLoader = (name: string) => Promise<string | null> | string | null

/**
 * Vue injection key used by `<SIcon>` to look up its icon loader.
 * Provide a loader at the app level to make SVGs available to SIcon:
 *
 * ```ts
 * import { STEM_ICON_LOADER, type StemIconLoader } from '@fullbrains/stem'
 *
 * const icons = import.meta.glob('~/assets/icons/**\/*.svg', {
 *   query: '?raw',
 *   import: 'default',
 * }) as Record<string, () => Promise<string>>
 *
 * const loader: StemIconLoader = async (name) => {
 *   const match = Object.entries(icons).find(([path]) => path.endsWith(`/${name}.svg`))
 *   return match ? await match[1]() : null
 * }
 *
 * app.provide(STEM_ICON_LOADER, loader)
 * ```
 */
export const STEM_ICON_LOADER: InjectionKey<StemIconLoader> = Symbol('stem:icon-loader')
</content>
</invoke>