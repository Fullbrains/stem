import SConfirmDialog from '../components/SConfirmDialog.vue'

export function useConfirmDialog() {
  const overlay = useOverlay()

  async function confirm(options: {
    title?: string
    message?: string
    label?: string
    icon?: string
    destructive?: boolean
    onConfirm: () => Promise<void> | void
  }) {
    const modal = overlay.create(SConfirmDialog, {
      destroyOnClose: true,
    })

    const confirmed = await modal.open({
      title: options.title,
      message: options.message,
      label: options.label,
      icon: options.icon,
      destructive: options.destructive,
    })

    if (confirmed) {
      await options.onConfirm()
    }
  }

  return { confirm }
}
