import { ReactNode } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

interface ConfirmModalProps {
  open: boolean;
  variant?: "danger" | "confirm";
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export function ConfirmModal({
  open,
  variant = "confirm",
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) {
  if (!open) return null;

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="p-8">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-5
            ${isDanger ? "bg-red-50" : "bg-green-50"}`}
          >
            {isDanger
              ? <AlertTriangle className="h-7 w-7 text-red-500" />
              : <CheckCircle className="h-7 w-7 text-green-500" />
            }
          </div>

          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            {description && (
              <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            )}
          </div>

          {children}

          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 h-11 rounded-xl border-slate-200 text-slate-700 font-semibold"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              className={`flex-1 h-11 rounded-xl font-semibold text-white
                ${isDanger
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-[#1e2433] hover:bg-[#2a3347]"
                }`}
            >
              {confirmLabel ?? (isDanger ? "Delete" : "Confirm")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
