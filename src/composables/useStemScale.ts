import {computed, inject, provide, type ComputedRef, type InjectionKey} from 'vue'
import type {StemScaleProps} from '../theme/scale'

/** The scale props a component resolves, and passes down. */
export const stemScaleKeys = [
  'size', 'textSize', 'iconSize', 'space', 'spaceX', 'spaceY', 'roundness', 'rounded', 'opticalLabel',
] as const satisfies readonly (keyof StemScaleProps)[]

export const STEM_SCALE: InjectionKey<ComputedRef<StemScaleProps>> = Symbol('stem-scale')

/**
 * The scale props of a Stem component, inherited: each one is the
 * component's own if given, else its nearest parent's (an SScale, or a Stem
 * container), else the component's default. A component without any of them
 * leaves it undefined, and Nuxt UI's own default (or a UFieldGroup's size)
 * applies.
 *
 * With `provide`, the component passes what it resolved to its children.
 */
export function useStemScale(
  props: StemScaleProps,
  defaults: StemScaleProps = {},
  options: {provide?: boolean} = {},
): ComputedRef<StemScaleProps> {
  const parent = inject(STEM_SCALE, null)
  const resolved = computed(() => {
    const out: Record<string, unknown> = {}
    for (const k of stemScaleKeys) {
      out[k] = props[k] ?? parent?.value[k] ?? defaults[k]
    }
    return out as StemScaleProps
  })
  if (options.provide) provide(STEM_SCALE, resolved)
  return resolved
}
