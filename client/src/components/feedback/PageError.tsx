import { WifiOff, FileQuestion } from "lucide-react";
import { Button } from "../ui/button";

interface PageErrorProps {
  variant?: "network" | "not-found";
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function PageError({
  variant = "network",
  title,
  description,
  action,
}: PageErrorProps) {
  const defaults = variant === "not-found"
    ? {
        icon: <FileQuestion className="h-8 w-8" />,
        title: "Page not found",
        description: "The page you're looking for doesn't exist or has been moved.",
        actionLabel: "Go to Dashboard",
      }
    : {
        icon: <WifiOff className="h-8 w-8" />,
        title: "Something went wrong",
        description: "We couldn't load this content. Please check your connection and try again.",
        actionLabel: "Try Again",
      };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-5">
        {defaults.icon}
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-2">
        {title ?? defaults.title}
      </h2>
      <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-7">
        {description ?? defaults.description}
      </p>
      {action ? (
        <Button
          onClick={action.onClick}
          className="h-11 px-6 rounded-xl bg-[#1e2433] hover:bg-[#2a3347] text-white font-semibold"
        >
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
