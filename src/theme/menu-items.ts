import {stemIconOptical, stemScaleIcon, stemSizeClass, stemSizes, type StemSize} from './scale'

/**
 * Menu items on the Stem scale: an item is a control like any other — same
 * text, icon, padding, gap and radius as a button of the same size. The menu
 * floats in a portal, out of the trigger's reach, so the size class goes on
 * the `content` itself; the menu's corners are the item's plus the group
 * padding (s-corner-outer), so items and menu stay concentric.
 *
 * The highlight is the item's own background (squircle), not Nuxt UI's
 * ::before (which can only be plainly rounded).
 */
export const menuItemSlots = {
  content: 's-floating-menu s-corner-outer',
  group: 'p-1',
  item: 'cursor-pointer items-center font-normal s-corner before:hidden data-disabled:opacity-50',
  itemLeadingIcon: '',
}

/** The highlighted, not-yet-chosen item: what a pointer or the keyboard is on. */
export const menuItemHighlight = 'data-highlighted:not-data-disabled:bg-elevated data-[state=open]:bg-elevated'

function menuItemSize(token: StemSize) {
  const row = 'text-(length:--s-text) leading-(--s-icon-size) px-(--s-px) py-(--s-py) gap-(--s-gap)'
  return {
    content: stemSizeClass(token),
    item: row,
    label: row,
    empty: row,
    // Beside a label, like a button's: the drawing, not the box, on the
    // padding and the gap (see stemIconOptical).
    itemLeadingIcon: `${stemScaleIcon} ${stemIconOptical}`,
    itemTrailingIcon: `${stemScaleIcon} ${stemIconOptical}`,
  }
}

export const menuItemSizes = Object.fromEntries(stemSizes.map(s => [s, menuItemSize(s)])) as Record<StemSize, ReturnType<typeof menuItemSize>>
