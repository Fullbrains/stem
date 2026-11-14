import {computed, inject, provide, type ComputedRef, type InjectionKey} from 'vue'
import {stemSpaceShift, stemSpaceStep, type StemScaleProps, type StemSize, type StemSpace, type StemSpaceValue} from '../theme/scale'

/** The scale props a component resolves, and passes down. */
export const stemScaleKeys = [
  'size', 'textSize', 'iconSize', 'space', 'spaceX', 'spaceY', 'roundness', 'rounded', 'opticalLabel',
] as const satisfies readonly (keyof StemScaleProps)[]

export const STEM_SCALE: InjectionKey<ComputedRef<StemScaleProps>> = Symbol('stem-scale')

type Space = StemSpaceValue | undefined

/**
 * Lays a space value over the one below it: an absolute step replaces it, a
 * shift moves it (or adds to a shift still waiting for its base).
 */
function layer(below: Space, v: Space): Space {
  if (v == null) return below
  const by = stemSpaceShift(v)
  if (by == null) return v
  if (below == null) return v
  const base = stemSpaceShift(below)
  // Shifts that cancel out leave nothing to move: as if none were given.
  if (base != null) return base + by === 0 ? undefined : base + by
  return stemSpaceStep(below as StemSpace, by)
}

/** A default lays under the parent when absolute, over it when a shift. */
function layerDefault(parent: Space, v: Space): Space {
  if (v == null) return parent
  return stemSpaceShift(v) != null ? layer(parent, v) : (parent ?? v)
}

/** A shift with no base left: from the size's own space (md without a size). */
function settle(v: Space, size: StemSize | undefined): StemSpace | undefined {
  if (v == null) return undefined
  const by = stemSpaceShift(v)
  return by == null ? v as StemSpace : stemSpaceStep(size ?? 'md', by)
}

/**
 * The scale props of a Stem component, inherited: each one is the
 * component's own if given, else its nearest parent's (an SScale, or a Stem
 * container), else the component's default. A component without any of them
 * leaves it undefined, and Nuxt UI's own default (or a UFieldGroup's size)
 * applies.
 *
 * `space`, `space-x` and `space-y` also take a shift ('-1', '+2'): steps from
 * the space the component would have otherwise — its parent's, else its own
 * size's. A shift on a container reaches its children still a shift, so each
 * moves from its own size. A component's default shift (SModalButton's +1 x)
 * applies over what it inherits.
 *
 * With `provide`, the component passes what it resolved to its children
 * (shifts with no base left kept as shifts).
 */
export function useStemScale(
  props: StemScaleProps,
  defaults: StemScaleProps = {},
  options: {provide?: boolean} = {},
): ComputedRef<StemScaleProps> {
  const parent = inject(STEM_SCALE, null)

  // Before shifts are settled: what a container passes down.
  const layered = computed(() => {
    const out: Record<string, unknown> = {}
    for (const k of stemScaleKeys) {
      if (k === 'space' || k === 'spaceX' || k === 'spaceY') continue
      out[k] = props[k] ?? parent?.value[k] ?? defaults[k]
    }
    const p = parent?.value ?? {}
    // The parent's, then the default's, then the component's own; on each
    // axis `space` first, the axis' own prop over it.
    const space = layer(layerDefault(p.space, defaults.space), props.space)
    let x: Space = p.spaceX ?? p.space
    x = layerDefault(layerDefault(x, defaults.space), defaults.spaceX)
    x = layer(layer(x, props.space), props.spaceX)
    let y: Space = p.spaceY ?? p.space
    y = layerDefault(layerDefault(y, defaults.space), defaults.spaceY)
    y = layer(layer(y, props.space), props.spaceY)
    out.space = space
    out.spaceX = x === space ? undefined : x
    out.spaceY = y === space ? undefined : y
    return out as StemScaleProps
  })

  const resolved = computed(() => {
    const l = layered.value
    return {
      ...l,
      space: settle(l.space, l.size),
      spaceX: settle(l.spaceX, l.size),
      spaceY: settle(l.spaceY, l.size),
    } as StemScaleProps
  })

  if (options.provide) provide(STEM_SCALE, layered)
  return resolved
}
