import {useOverlay} from '#imports'
import {defineAsyncComponent} from 'vue'

const SConfirmModal = defineAsyncComponent(() => import('../components/SConfirmModal.vue'))

export function useConfirmModal() {
  const overlay = useOverlay()

  async function confirm(options: {
    title?: string
    message?: string
    label?: string
    cancelLabel?: string
    icon?: string
    destructive?: boolean
    confirmMatch?: string
    confirmPlaceholder?: string
    /** A line under the title (SConfirmModal's `headerSeparator`). */
    headerSeparator?: boolean
    /** SModal's compact header: true, false, or `'mobileOnly'` (below sm). */
    headerCompact?: boolean | 'mobileOnly'
    onConfirm: () => Promise<void> | void
  }) {
    const modal = overlay.create(SConfirmModal, {
      destroyOnClose: true,
    })

    await modal.open({
      title: options.title,
      message: options.message,
      label: options.label,
      cancelLabel: options.cancelLabel,
      icon: options.icon,
      destructive: options.destructive,
      confirmMatch: options.confirmMatch,
      confirmPlaceholder: options.confirmPlaceholder,
      headerSeparator: options.headerSeparator,
      headerCompact: options.headerCompact,
      onConfirm: options.onConfirm,
    })
  }

  return { confirm }
}
