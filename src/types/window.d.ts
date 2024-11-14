declare global {
  interface Window {
    handleSuccess?: () => void
    handleClose?: () => void
  }
}
export {}
