import { ReactNode } from "react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  icon: ReactNode;
  heading: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, heading, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{heading}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-5">{description}</p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          className="h-10 px-5 rounded-xl bg-[#1e2433] hover:bg-[#2a3347] text-white text-sm font-semibold"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
