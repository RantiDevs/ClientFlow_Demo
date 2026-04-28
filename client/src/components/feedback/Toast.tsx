import { useEffect, useRef, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import type { ToastItem, ToastVariant } from "../../lib/toast";
import { dismiss } from "../../lib/toast";

const CONFIGS: Record<ToastVariant, {
  icon: React.ReactNode;
  bar: string;
  iconColor: string;
  bg: string;
}> = {
  success: {
    icon: <CheckCircle className="h-5 w-5" />,
    bar: "bg-green-500",
    iconColor: "text-green-500",
    bg: "bg-white",
  },
  error: {
    icon: <XCircle className="h-5 w-5" />,
    bar: "bg-red-500",
    iconColor: "text-red-500",
    bg: "bg-white",
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    bar: "bg-amber-500",
    iconColor: "text-amber-500",
    bg: "bg-white",
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    bar: "bg-[#1e2433]",
    iconColor: "text-[#1e2433]",
    bg: "bg-white",
  },
};

const DURATION = 4500;

interface Props {
  toast: ToastItem;
}

export function Toast({ toast }: Props) {
  const cfg = CONFIGS[toast.variant];
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (toast.exiting) setVisible(false);
  }, [toast.exiting]);

  useEffect(() => {
    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - (startRef.current ?? now);
      const pct = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(pct);
      if (pct > 0) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div
      className={`relative flex items-start gap-3 w-full max-w-sm rounded-2xl shadow-lg overflow-hidden border border-slate-100 ${cfg.bg}
        transition-all duration-300 ease-out
        ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.bar} rounded-l-2xl`} />

      <div className={`mt-4 ml-5 shrink-0 ${cfg.iconColor}`}>{cfg.icon}</div>

      <div className="flex-1 py-4 pr-10 min-w-0">
        <p className="text-sm font-semibold text-slate-900 leading-snug">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{toast.description}</p>
        )}
      </div>

      <button
        onClick={() => dismiss(toast.id)}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100">
        <div
          className={`h-full ${cfg.bar} transition-none`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
