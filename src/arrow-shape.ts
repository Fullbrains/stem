/**
 * Stem's arrow, iOS style: a rounded tip and sides that meet the edge with
 * a concave curve, no corner at the base. Drawn pointing UP, base on y =
 * height; SArrow flips it for Reka, whose arrow points down.
 *
 * Geometry, in the arrow's own units before `scale`: a triangle with a
 * ±`foot` base and `height` height (by default ±10 and 12.5); concave
 * fillets of `baseRadius` where the sides meet the edge (they widen the
 * arrow), a tip of `tipRadius` (0: sharp). `scale` scales all of it, radii
 * included; the fill goes exactly 1px past the base, into the surface it
 * hangs from, so no seam is left between the two, and the outline stays 1px.
 */
export function arrowShape({scale = 1, baseRadius = 6, tipRadius = 2.5, foot = 10, height: rise = 12.5} = {}) {
  const side = Math.hypot(foot, rise)
  const cos = foot / side
  const sin = rise / side

  // Tangent lengths: from the foot along the edge and the side for the base
  // fillet (the angle between them is 180° minus the side's slope), from the
  // apex along each side for the tip.
  const baseTangent = baseRadius / Math.tan((Math.PI - Math.atan2(rise, foot)) / 2)
  const tipTangent = tipRadius / Math.tan(Math.atan2(foot, rise))
  const cx = foot + baseTangent

  const n = (value: number) => +(value * scale).toFixed(3)
  const width = n(2 * cx)
  const height = n(rise)
  const [baseX, baseY] = [n(baseTangent * (1 + cos)), n(rise - baseTangent * sin)]
  const [tipX, tipY] = [n(cx - tipTangent * cos), n(tipTangent * sin)]
  const r = n(baseRadius)
  const rt = n(tipRadius)

  // A tip of radius 0 is a plain corner: no arc, the sides meet at the apex.
  const tip = rt > 0
    ? `L${tipX} ${tipY}A${rt} ${rt} 0 0 1 ${n(2 * cx) - tipX} ${tipY}`
    : `L${n(cx)} 0`
  const edge = `M0 ${height}A${r} ${r} 0 0 0 ${baseX} ${baseY}${tip}L${n(2 * cx) - baseX} ${baseY}A${r} ${r} 0 0 0 ${width} ${height}`

  return {width, height, edge, fill: `${edge}V${height + 1}H0Z`}
}

/** Popovers, tooltips and menus: small, with round sides — at this size
    tighter fillets would read as corners. */
export const STEM_ARROW_SHAPE = arrowShape({scale: 0.6, baseRadius: 10})

/** How far an arrow keeps from a floating panel's corners (Reka's
    `arrowPadding`): pushed along its trigger by the screen's edge, it would
    otherwise sit against a rounded corner, half drawn. */
export const STEM_ARROW_PADDING = 16
