export interface ShowcaseNavItem {
  label: string
  to: string
  /** Pagina non ancora costruita: compare nel menu, ma spenta. */
  soon?: boolean
}

export interface ShowcaseNavGroup {
  label: string
  items: ShowcaseNavItem[]
}

export const showcaseNav: ShowcaseNavGroup[] = [
  {
    label: 'Fondamenta',
    items: [
      {label: 'Colori', to: '/foundations/colors', soon: true},
      {label: 'Dimensioni', to: '/foundations/sizes', soon: true},
      {label: 'Raggi e angoli', to: '/foundations/radius', soon: true},
      {label: 'Icone', to: '/foundations/icons', soon: true},
    ],
  },
  {
    label: 'Azioni',
    items: [
      {label: 'Button', to: '/components/button'},
      {label: 'CopyButton', to: '/components/copy-button', soon: true},
      {label: 'CloseButton', to: '/components/close-button', soon: true},
      {label: 'DropdownMenu', to: '/components/dropdown-menu', soon: true},
    ],
  },
  {
    label: 'Campi',
    items: [
      {label: 'Input', to: '/components/input', soon: true},
      {label: 'Textarea', to: '/components/textarea', soon: true},
      {label: 'Select', to: '/components/select', soon: true},
      {label: 'InputTags', to: '/components/input-tags', soon: true},
      {label: 'Checkbox e Switch', to: '/components/checkbox', soon: true},
      {label: 'ColorPicker', to: '/components/color-picker', soon: true},
    ],
  },
  {
    label: 'Feedback',
    items: [
      {label: 'Alert', to: '/components/alert', soon: true},
      {label: 'Badge', to: '/components/badge', soon: true},
      {label: 'Hint', to: '/components/hint', soon: true},
      {label: 'Empty', to: '/components/empty', soon: true},
      {label: 'Spinner', to: '/components/spinner', soon: true},
    ],
  },
  {
    label: 'Navigazione',
    items: [
      {label: 'Tabs', to: '/components/tabs', soon: true},
    ],
  },
  {
    label: 'Overlay',
    items: [
      {label: 'Modal', to: '/components/modal', soon: true},
      {label: 'Popover', to: '/components/popover', soon: true},
    ],
  },
  {
    label: 'Ricerca',
    items: [
      {label: 'SearchBar', to: '/components/search-bar', soon: true},
      {label: 'SearchFilter', to: '/components/search-filter', soon: true},
    ],
  },
  {
    label: 'Contenitori',
    items: [
      {label: 'ScrollArea', to: '/components/scroll-area', soon: true},
    ],
  },
]
