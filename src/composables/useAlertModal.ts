import {useOverlay} from '#imports'
import {defineAsyncComponent} from 'vue'

const SAlertModal = defineAsyncComponent(() => import('../components/SAlertModal.vue'))

export function useAlertModal() {
  const overlay = useOverlay()

  async function alert(options: string | {
    title?: string
    message?: string
    icon?: string
    confirmLabel?: string
    confirmColor?: string
  }) {
    const resolved = typeof options === 'string'
      ? {message: options}
      : options

    const modal = overlay.create(SAlertModal, {
      destroyOnClose: true,
    })

    await modal.open({
      title: resolved.title,
      message: resolved.message,
      icon: resolved.icon,
      confirmLabel: resolved.confirmLabel,
      confirmColor: resolved.confirmColor,
    })
  }

  return {alert}
}
