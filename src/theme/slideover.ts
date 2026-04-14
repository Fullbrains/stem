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
      transition: true,
      side: 'top',
      class: {
        content:
          'data-[state=open]:animate-[slide-soft-from-bottom_500ms_cubic-bezier(0.4,0,0.2,1)] data-[state=closed]:animate-[slide-soft-to-bottom_500ms_cubic-bezier(0.4,0,0.2,1)] sm:data-[state=open]:animate-[slide-soft-from-top_500ms_cubic-bezier(0.4,0,0.2,1)] sm:data-[state=closed]:animate-[slide-soft-to-top_500ms_cubic-bezier(0.4,0,0.2,1)]',
        overlay:
          'data-[state=open]:animate-[fade-in_500ms_cubic-bezier(0.4,0,0.2,1)] data-[state=closed]:animate-[fade-out_500ms_cubic-bezier(0.4,0,0.2,1)]',
      },
    },
  ],
}
