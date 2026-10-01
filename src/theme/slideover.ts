/** A sheet's motion, from the variables in base.css (--s-sheet-duration,
 --s-sheet-ease): one timing on every side, which a scrim or a handover
 timed on the sheet can read too. */
const motion = (keyframes: string) => `${keyframes}_var(--s-sheet-duration)_var(--s-sheet-ease)`

/** The overlay fades on the same clock as the content it holds. */
const overlay = `data-[state=open]:animate-[${motion('fade-in')}] data-[state=closed]:animate-[${motion('fade-out')}]`

export default {
  slots: {
    overlay: 'fixed inset-0 bg-neutral-800/90 backdrop-blur-sm',
    content: 'p-0 divide-y-0 s-corner [--s-radius:12px]',
    body: '!p-0',
    header: 'flex-shrink-0',
    footer: 'flex-shrink-0',
  },
  compoundVariants: [
    {
      // From the bottom on a phone, from the top from sm.
      transition: true,
      side: 'top',
      class: {
        content:
          `data-[state=open]:animate-[${motion('slide-soft-from-bottom')}] data-[state=closed]:animate-[${motion('slide-soft-to-bottom')}] sm:data-[state=open]:animate-[${motion('slide-soft-from-top')}] sm:data-[state=closed]:animate-[${motion('slide-soft-to-top')}]`,
        overlay,
      },
    },
    {
      // From the bottom at every width, the same soft slide: without it the
      // side kept Nuxt UI's own (a full slide in 200ms), out of step with
      // every other sheet and with what is timed on them.
      transition: true,
      side: 'bottom',
      class: {
        content:
          `data-[state=open]:animate-[${motion('slide-soft-from-bottom')}] data-[state=closed]:animate-[${motion('slide-soft-to-bottom')}]`,
        overlay,
      },
    },
  ],
}
