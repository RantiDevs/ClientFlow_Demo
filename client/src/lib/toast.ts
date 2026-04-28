import { useState, useEffect } from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  exiting?: boolean;
}

type Listener = (toasts: ToastItem[]) => void;

let _toasts: ToastItem[] = [];
const _listeners = new Set<Listener>();

function _notify() {
  _listeners.forEach((l) => l([..._toasts]));
}

function _dismiss(id: string) {
  _toasts = _toasts.map((t) => (t.id === id ? { ...t, exiting: true } : t));
  _notify();
  setTimeout(() => {
    _toasts = _toasts.filter((t) => t.id !== id);
    _notify();
  }, 350);
}

function _add(variant: ToastVariant, title: string, opts?: { description?: string }) {
  const id = Math.random().toString(36).slice(2, 9);
  const item: ToastItem = { id, variant, title, description: opts?.description };
  _toasts = [..._toasts.slice(-2), item];
  _notify();
  const timer = setTimeout(() => _dismiss(id), 4500);
  return () => clearTimeout(timer);
}

export const toast = {
  success: (title: string, opts?: { description?: string }) => _add("success", title, opts),
  error:   (title: string, opts?: { description?: string }) => _add("error",   title, opts),
  warning: (title: string, opts?: { description?: string }) => _add("warning", title, opts),
  info:    (title: string, opts?: { description?: string }) => _add("info",    title, opts),
  dismiss: _dismiss,
};

export function useToastStore() {
  const [items, setItems] = useState<ToastItem[]>([]);
  useEffect(() => {
    _listeners.add(setItems);
    return () => { _listeners.delete(setItems); };
  }, []);
  return { toasts: items, dismiss: _dismiss };
}

export function useToast() {
  return { toast };
}

export { _dismiss as dismiss };
