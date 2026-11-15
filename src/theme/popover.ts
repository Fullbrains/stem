export default {
  slots: {
    content: 's-floating-menu s-corner [--s-radius:10px] ring-0',
    // Stem's arrow (SArrow): the surface's fill, outlined as the floating
    // menu's 1px ring (black, white in dark mode, at 10%).
    arrow: 'fill-(--ui-bg) stroke-black/10 dark:stroke-white/10',
  },
}
