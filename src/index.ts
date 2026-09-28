// Theme (plain JS objects)
export { stem } from './theme'
export { stemIcons, stemColors } from './config'

// Icon sizing scale
export {
  iconSizeScale,
  iconSizeTokens,
  iconSizes,
  iconSizeVar,
  iconSizeClass,
  iconSizeFor,
  resolveIconSize,
  iconSizeStyle,
  type IconSizeToken,
} from './theme/icon-sizes'

// Input container classes — for components that must LOOK like a Stem input
// without being one (a popover trigger, a token field). SColorPicker already
// builds on them; exporting keeps every such container in step with the real
// inputs instead of drifting on copied classes.
export {
  inputContainerClasses,
  inputIconColors,
  type InputColor,
  type InputVariant,
  type ContainerClasses,
} from './theme/input-container'

// Components
export { default as SModal } from './components/SModal.vue'
export { default as SModalHeader } from './components/SModalHeader.vue'
export { default as SModalFooter } from './components/SModalFooter.vue'
export { default as SBadge } from './components/SBadge.vue'
export { default as SButton } from './components/SButton.vue'
export { default as SCloseButton } from './components/SCloseButton.vue'
export { default as SConfirmModal } from './components/SConfirmModal.vue'
export { default as SAlertModal } from './components/SAlertModal.vue'
export { default as SSpinner } from './components/SSpinner.vue'
export { default as SIcon } from './components/SIcon.vue'
export { default as SSearchBar } from './components/SSearchBar.vue'
export { default as SSearchChip } from './components/SSearchChip.vue'
export { default as SSearchFilter } from './components/SSearchFilter.vue'
export { default as SSearchOrder } from './components/SSearchOrder.vue'
export { default as SEmpty } from './components/SEmpty.vue'
export { default as SColorPicker } from './components/SColorPicker.vue'
export { default as SScrollArea } from './components/SScrollArea.vue'

// Types
export type { SSearchFilterOption, SSearchFilterGroup } from './components/SSearchFilter.vue'

// Composables
export { useConfirmModal } from './composables/useConfirmModal'
export { useAlertModal } from './composables/useAlertModal'

// Icon loader (used by SIcon via provide/inject)
export { STEM_ICON_LOADER, type StemIconLoader } from './icon-loader'
