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
      {label: 'Colori', to: '/foundations/colors'},
      {label: 'Dimensioni', to: '/foundations/sizes'},
      {label: 'Raggi e angoli', to: '/foundations/radius'},
      {label: 'Icone', to: '/foundations/icons'},
    ],
  },
  {
    label: 'Azioni',
    items: [
      {label: 'Button', to: '/components/button'},
      {label: 'CopyButton', to: '/components/copy-button'},
      {label: 'CloseButton', to: '/components/close-button'},
      {label: 'DropdownMenu', to: '/components/dropdown-menu'},
    ],
  },
  {
    label: 'Campi',
    items: [
      {label: 'Input', to: '/components/input'},
      {label: 'Textarea', to: '/components/textarea'},
      {label: 'Select', to: '/components/select'},
      {label: 'InputTags', to: '/components/input-tags'},
      {label: 'Checkbox e Switch', to: '/components/checkbox'},
      {label: 'ColorPicker', to: '/components/color-picker'},
    ],
  },
  {
    label: 'Feedback',
    items: [
      {label: 'Alert', to: '/components/alert'},
      {label: 'Badge', to: '/components/badge'},
      {label: 'Hint', to: '/components/hint'},
      {label: 'Empty', to: '/components/empty'},
      {label: 'Spinner', to: '/components/spinner'},
    ],
  },
  {
    label: 'Navigazione',
    items: [
      {label: 'Tabs', to: '/components/tabs'},
    ],
  },
  {
    label: 'Overlay',
    items: [
      {label: 'Modal', to: '/components/modal'},
      {label: 'Popover', to: '/components/popover'},
    ],
  },
  {
    label: 'Ricerca',
    items: [
      {label: 'SearchBar', to: '/components/search-bar'},
      {label: 'SearchFilter', to: '/components/search-filter'},
    ],
  },
  {
    label: 'Contenitori',
    items: [
      {label: 'ScrollArea', to: '/components/scroll-area'},
    ],
  },
]
