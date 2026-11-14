const stemPalettes = ['stem', 'iron', 'muto']
const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

/**
 * Le variabili che puntano a una palette (`--ui-color-primary-500:
 * var(--color-stem-500)`, `--ui-border` di Stem…) sono dichiarate su :root e
 * si risolvono lì, col valore chiaro. Dentro un wrapper `.dark` la palette
 * cambia, ma quelle variabili arriverebbero già risolte: vanno ridichiarate sul
 * wrapper, così si risolvono di nuovo con la palette giusta.
 * Solo le palette di Stem cambiano sotto .dark; le Tailwind restano come le ha
 * dichiarate Nuxt UI (con il loro fallback, se il gradino non è emesso).
 */
export function showcaseRebasedVars(colors: Record<string, string>) {
  const out: Record<string, string> = {
    '--ui-border': 'color-mix(in oklch, var(--color-iron-500) 20%, transparent)',
  }
  for (const [role, palette] of Object.entries(colors)) {
    if (!stemPalettes.includes(palette)) continue
    for (const s of steps) out[`--ui-color-${role}-${s}`] = `var(--color-${palette}-${s})`
  }
  return out
}
