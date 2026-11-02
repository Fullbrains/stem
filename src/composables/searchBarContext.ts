import type {InjectionKey, Ref} from 'vue'

// SSearchBar provides its compact state so the chips rendered through its slots
// (SSearchChip, and SSearchFilter/SSearchOrder which build on it) can tighten
// themselves — slot content cannot receive props from the bar directly.
export const SEARCH_BAR_COMPACT: InjectionKey<Ref<boolean>> = Symbol('s-search-bar-compact')

// True for the filters the bar has tucked into its funnel panel. There the chips
// wrap from the left, so their menus open from the chip's left edge whatever
// alignEnd says; alignEnd only applies to filters sitting inline in the bar.
export const SEARCH_BAR_PANEL: InjectionKey<boolean> = Symbol('s-search-bar-panel')
