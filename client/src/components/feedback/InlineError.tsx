import { AlertCircle } from "lucide-react";

interface InlineErrorProps {
  message?: string | null;
  className?: string;
}

export function InlineError({ message, className = "" }: InlineErrorProps) {
  if (!message) return null;

  return (
    <div
      className={`flex items-start gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200 ${className}`}
    >
      <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
      <p className="text-xs text-red-500">{message}</p>
    </div>
  );
}
