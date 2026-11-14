import {computed, inject, provide, type ComputedRef, type InjectionKey} from 'vue'
import {stemSizeStep, stemSpaceShift, stemSpaceStep, type StemScaleProps, type StemScaleResolved, type StemSize, type StemSizeValue, type StemSpace, type StemSpaceValue} from '../theme/scale'

/** The scale props a component resolves, and passes down. */
export const stemScaleKeys = [
  'size', 'textSize', 'iconSize', 'space', 'spaceX', 'spaceY', 'roundness', 'rounded', 'opticalLabel',
] as const satisfies readonly (keyof StemScaleProps)[]

export const STEM_SCALE: InjectionKey<ComputedRef<StemScaleProps>> = Symbol('stem-scale')

type Space = StemSpaceValue | undefined
type Step = (from: never, by: number) => unknown

/**
 * Lays a value over the one below it: an absolute one replaces it, a shift
 * moves it (or adds to a shift still waiting for its base).
 */
function layer<T>(below: T | undefined, v: T | undefined, step: Step): T | undefined {
  if (v == null) return below
  const by = stemSpaceShift(v)
  if (by == null) return v
  if (below == null) return v
  const base = stemSpaceShift(below)
  // Shifts that cancel out leave nothing to move: as if none were given.
  if (base != null) return (base + by === 0 ? undefined : base + by) as T
  return step(below as never, by) as T
}

/**
 * A component's default under what it inherits. Absolute, it stands only
 * where nothing came down, and a shift that came down moves it; a shift
 * moves what came down.
 */
function layerDefault<T>(parent: T | undefined, v: T | undefined, step: Step): T | undefined {
  if (v == null) return parent
  if (stemSpaceShift(v) != null) return layer(parent, v, step)
  if (parent != null && stemSpaceShift(parent) != null) return layer(v, parent, step)
  return parent ?? v
}

const spaceStep = stemSpaceStep as Step
const sizeStep = stemSizeStep as Step

/** A shift with no base left: from the size's own space (md without a size). */
function settle(v: Space, size: StemSize | undefined): StemSpace | undefined {
  if (v == null) return undefined
  const by = stemSpaceShift(v)
  return by == null ? v as StemSpace : stemSpaceStep(size ?? 'md', by)
}

/** A size shift with no base left: from md, Nuxt UI's default. */
function settleSize(v: StemSizeValue | undefined): StemSize | undefined {
  if (v == null) return undefined
  const by = stemSpaceShift(v)
  return by == null ? v as StemSize : stemSizeStep('md', by)
}

/**
 * The scale props of a Stem component, inherited: each one is the
 * component's own if given, else its nearest parent's (an SScale, or a Stem
 * container), else the component's default. A component without any of them
 * leaves it undefined, and Nuxt UI's own default (or a UFieldGroup's size)
 * applies.
 *
 * `size`, `space`, `space-x` and `space-y` also take a shift ('-1', '+2'):
 * steps from the value the component would have otherwise — its parent's,
 * else its own default (a space: its size's; a size: md). A shift on a container reaches its children still a shift, so each
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
): ComputedRef<StemScaleResolved> {
  const parent = inject(STEM_SCALE, null)

  // Before shifts are settled: what a container passes down.
  const layered = computed(() => {
    const out: Record<string, unknown> = {}
    for (const k of stemScaleKeys) {
      if (k === 'size' || k === 'space' || k === 'spaceX' || k === 'spaceY') continue
      out[k] = props[k] ?? parent?.value[k] ?? defaults[k]
    }
    const p = parent?.value ?? {}
    out.size = layer(layerDefault(p.size, defaults.size, sizeStep), props.size, sizeStep)
    // The parent's, then the default's, then the component's own; on each
    // axis `space` first, the axis' own prop over it.
    const space = layer(layerDefault(p.space, defaults.space, spaceStep), props.space, spaceStep)
    let x: Space = p.spaceX ?? p.space
    x = layerDefault(layerDefault(x, defaults.space, spaceStep), defaults.spaceX, spaceStep)
    x = layer(layer(x, props.space, spaceStep), props.spaceX, spaceStep)
    let y: Space = p.spaceY ?? p.space
    y = layerDefault(layerDefault(y, defaults.space, spaceStep), defaults.spaceY, spaceStep)
    y = layer(layer(y, props.space, spaceStep), props.spaceY, spaceStep)
    out.space = space
    out.spaceX = x === space ? undefined : x
    out.spaceY = y === space ? undefined : y
    return out as StemScaleProps
  })

  const resolved = computed(() => {
    const l = layered.value
    const size = settleSize(l.size)
    return {
      ...l,
      size,
      space: settle(l.space, size),
      spaceX: settle(l.spaceX, size),
      spaceY: settle(l.spaceY, size),
    } as StemScaleResolved
  })

  if (options.provide) provide(STEM_SCALE, layered)
  return resolved
}
