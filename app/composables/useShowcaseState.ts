/**
 * Stato di una pagina dello showcase (le opzioni del playground, una
 * larghezza…), ricordato nel localStorage del browser.
 *
 * Non nei cookie: viaggiano in ogni richiesta, e uno per pagina ha superato
 * il limite delle intestazioni del server (431), bloccando il JavaScript di
 * tutto lo showcase. Il server rende il valore iniziale; quello salvato
 * arriva dopo il mount, così non c'è disallineamento in hydration.
 */
export function useShowcaseState<T>(key: string, init: () => T) {
  const storageKey = `showcase-${key}`
  const state = useState<T>(storageKey, init)

  onMounted(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const saved = JSON.parse(raw)
        const base = init()
        // Le opzioni nuove di una pagina prendono il loro valore iniziale.
        state.value = base && typeof base === 'object' && !Array.isArray(base)
          ? {...base, ...saved}
          : saved
      }
    } catch {
      // storage non disponibile o valore illeggibile: resta l'iniziale
    }
    watch(state, (v) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(v))
      } catch {
        // storage pieno o bloccato: lo stato vive solo in pagina
      }
    }, {deep: true})
  })

  return state
}
