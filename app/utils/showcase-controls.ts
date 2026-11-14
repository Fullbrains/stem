export type ShowcaseOption = string | {label: string, value: string | number | boolean | undefined}

interface ControlBase {
  /** Nome della prop sul componente. */
  key: string
  label?: string
  /** Valore che il componente usa se la prop manca: non finisce nel codice generato. */
  default?: unknown
  /** Valore di partenza della demo (e del "Ripristina"), se diverso dal default. */
  initial?: unknown
  /** false = controlla la demo ma non è una prop (non entra nel codice). */
  prop?: boolean
  /** Raggruppa i controlli nel pannello. */
  group?: string
}

export type ShowcaseControl =
  | (ControlBase & {type: 'select', options: ShowcaseOption[]})
  | (ControlBase & {type: 'boolean'})
  | (ControlBase & {type: 'text', placeholder?: string})

export function optionValue(o: ShowcaseOption) {
  return typeof o === 'string' ? o : o.value
}

export function optionLabel(o: ShowcaseOption) {
  return typeof o === 'string' ? o : o.label
}

/**
 * Le chiavi di una variante, lette dal tema generato di Nuxt UI
 * (`import theme from '#build/ui/button'`): così i controlli seguono il tema
 * e un colore o una variante nuova compaiono senza toccare la pagina.
 */
export function themeKeys(theme: {variants?: Record<string, unknown>}, key: string): string[] {
  const v = theme.variants?.[key]
  return v && typeof v === 'object' ? Object.keys(v) : []
}

/** Stato iniziale: `initial`, altrimenti il default di ogni controllo. */
export function controlDefaults(controls: ShowcaseControl[]) {
  return Object.fromEntries(controls.map(c => [c.key, c.initial ?? c.default ?? (c.type === 'boolean' ? false : undefined)]))
}

function kebab(s: string) {
  return s.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
}

/** Il tag del componente con le sole prop che si scostano dal default. */
export function controlsToCode(tag: string, controls: ShowcaseControl[], state: Record<string, unknown>, extra = '') {
  const attrs: string[] = []
  for (const c of controls) {
    if (c.prop === false) continue
    const v = state[c.key]
    if (v === undefined || v === '' || v === (c.default ?? (c.type === 'boolean' ? false : undefined))) continue
    const name = kebab(c.key)
    if (v === true) attrs.push(name)
    else if (v === false) attrs.push(`:${name}="false"`)
    else if (typeof v === 'string') attrs.push(`${name}="${v}"`)
    else attrs.push(`:${name}="${JSON.stringify(v).replace(/"/g, '\'')}"`)
  }
  if (extra) attrs.push(extra)
  if (!attrs.length) return `<${tag}/>`
  const inline = `<${tag} ${attrs.join(' ')}/>`
  if (inline.length <= 80) return inline
  return `<${tag}\n${attrs.map(a => `  ${a}`).join('\n')}\n/>`
}

const scaleTokens = ['xs', 'sm', 'md', 'lg', 'xl']
const followsSize = {label: 'da size', value: undefined}

/**
 * I controlli della scala di Stem, uguali per ogni componente con `size`:
 * ognuno, se non impostato, segue `size`.
 */
export function scaleControls(group = 'Scala'): ShowcaseControl[] {
  const opts = [followsSize, ...scaleTokens]
  const spaceOpts = [followsSize, '2xs', ...scaleTokens]
  return [
    {group, key: 'textSize', label: 'text-size', type: 'select', options: opts},
    {group, key: 'iconSize', label: 'icon-size', type: 'select', options: opts},
    {group, key: 'space', type: 'select', options: spaceOpts},
    {group, key: 'spaceX', label: 'space-x', type: 'select', options: spaceOpts},
    {group, key: 'spaceY', label: 'space-y', type: 'select', options: spaceOpts},
    {group, key: 'roundness', type: 'select', options: opts},
    {group, key: 'rounded', label: 'rounded (pillola)', type: 'boolean'},
  ]
}

/** Le varianti di spazio e forma da affiancare in una Scale. */
export const scaleShapes: Record<string, Record<string, unknown>> = {
  'da size': {},
  'space-x md': {spaceX: 'md'},
  'space-y md': {spaceY: 'md'},
  'space md': {space: 'md'},
  'space 2xs': {space: '2xs'},
  'roundness xl': {roundness: 'xl'},
  'rounded': {rounded: true},
}
