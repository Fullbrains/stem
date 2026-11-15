import {markRaw} from 'vue'
import SArrow from './components/SArrow.vue'
import {STEM_ARROW_PADDING, STEM_ARROW_SHAPE} from './arrow-shape'

export {arrowShape, STEM_ARROW_SHAPE, STEM_ARROW_PADDING} from './arrow-shape'

/**
 * What Nuxt UI's `arrow` prop takes (UPopover, UTooltip, UDropdownMenu…) to
 * draw Stem's arrow instead of Reka's plain V: Reka keeps placing and
 * rotating it, SArrow draws it. SPopover, STooltip and SDropdownMenu use it
 * for `arrow` (true); a bare Nuxt UI overlay takes it as `:arrow="stemArrow"`.
 *
 * Its own file: SArrow reads the shape from arrow-shape.ts, so the
 * component cannot be imported there without a cycle.
 */
export const stemArrow = {
  // Imported, not async: Reka measures the arrow's element to centre it on
  // the trigger, and an async wrapper has none to measure at first.
  as: markRaw(SArrow),
  width: STEM_ARROW_SHAPE.width,
  height: STEM_ARROW_SHAPE.height,
}

/**
 * A Stem overlay's `arrow` and `content`, from what it was given: `true`
 * becomes Stem's arrow (an object is Reka's arrow props, laid over it), and
 * the content keeps the arrow off the corners (`arrowPadding`) unless told.
 */
export function stemArrowProps(arrow: unknown, content: unknown) {
  if (!arrow) return {arrow, content}
  const own = typeof arrow === 'object' ? arrow as Record<string, unknown> : {}
  return {
    arrow: {...stemArrow, ...own},
    content: {arrowPadding: STEM_ARROW_PADDING, ...(content as Record<string, unknown> | undefined)},
  }
}
