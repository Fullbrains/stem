import type {InjectionKey, Ref} from 'vue'

// SSearchBar provides its compact state so the chips rendered through its slots
// (SSearchChip, and SSearchFilter/SSearchOrder which build on it) can tighten
// themselves — slot content cannot receive props from the bar directly.
export const SEARCH_BAR_COMPACT: InjectionKey<Ref<boolean>> = Symbol('s-search-bar-compact')
