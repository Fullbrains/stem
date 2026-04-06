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
      onConfirm: options.onConfirm,
    })
  }

  return { confirm }
}
