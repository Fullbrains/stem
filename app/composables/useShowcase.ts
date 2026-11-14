export type ShowcaseMode = 'light' | 'dark'
export type ShowcaseModes = 'both' | ShowcaseMode

/**
 * Stato globale dello showcase, condiviso da tutte le pagine e ricordato nei
 * cookie: quali temi mostrare nelle anteprime, se disegnare le misure, lo
 * sfondo a scacchiera.
 *
 * L'html resta sempre in chiaro: il tema scuro vive dentro le anteprime, con
 * un wrapper `.dark`. È l'unico modo di avere chiaro e scuro affiancati, perché
 * la variante `dark:` di Tailwind scatta su qualunque discendente di `.dark`.
 */
export function useShowcase() {
  const modes = useCookie<ShowcaseModes>('showcase-modes', {default: () => 'both'})
  const measure = useCookie<boolean>('showcase-measure', {default: () => false})
  const checker = useCookie<boolean>('showcase-checker', {default: () => false})

  const activeModes = computed<ShowcaseMode[]>(() =>
    modes.value === 'both' ? ['light', 'dark'] : [modes.value],
  )

  return {modes, measure, checker, activeModes}
}
