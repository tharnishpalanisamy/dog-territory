import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import "./Toast.css";

export type ToastType = "success" | "error" | "warning" | "info";
type ToastMessage = { id: number; type: ToastType; message: string };
type ToastContextValue = { showToast: (type: ToastType, message: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);
const icons: Record<ToastType, string> = { success: "✓", error: "!", warning: "⚠", info: "i" };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, type, message }]);
    window.setTimeout(() => dismissToast(id), 4500);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-region" aria-live="polite" aria-relevant="additions">
        {toasts.map((toast) => (
          <div className={`toast toast--${toast.type}`} key={toast.id} role={toast.type === "error" ? "alert" : "status"}>
            <span className="toast-icon" aria-hidden="true">{icons[toast.type]}</span>
            <p>{toast.message}</p>
            <button className="toast-close" type="button" onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
