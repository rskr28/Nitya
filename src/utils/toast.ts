export type ToastKind = 'success' | 'error';

export function notify(message: string, kind: ToastKind = 'success') {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('nitya:toast', { detail: { message, kind } }));
}
