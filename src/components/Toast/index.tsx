import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import './index.css';

type ToastKind = 'success' | 'error';
interface ToastMessage { id: number; message: string; kind: ToastKind; }

export default function Toast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<{ message: string; kind?: ToastKind }>).detail;
      if (!detail?.message) return;
      if (timeout.current) window.clearTimeout(timeout.current);
      setToast({ id: Date.now(), message: detail.message, kind: detail.kind ?? 'success' });
      timeout.current = window.setTimeout(() => setToast(null), 3600);
    };
    window.addEventListener('nitya:toast', handleToast);
    return () => {
      window.removeEventListener('nitya:toast', handleToast);
      if (timeout.current) window.clearTimeout(timeout.current);
    };
  }, []);

  if (!toast) return null;
  return (
    <div className={`app-toast app-toast--${toast.kind}`} role={toast.kind === 'error' ? 'alert' : 'status'} aria-live="polite" key={toast.id}>
      <CheckCircle2 size={18} aria-hidden="true" />
      <span>{toast.message}</span>
      <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification"><X size={16} /></button>
    </div>
  );
}
