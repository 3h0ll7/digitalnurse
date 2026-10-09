import type { ReactNode } from "react";
import EmptyScene, { type EmptyVariant } from "@/components/iso/EmptyScene";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  variant: EmptyVariant;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({ variant, title, description, action, className }: EmptyStateProps) => (
  <div role="status" className={cn("flex flex-col items-center gap-3 rounded-3xl border border-dashed bg-card/60 px-6 py-8 text-center", className)}>
    <EmptyScene variant={variant} className="w-36 sm:w-44" />
    <p className="text-base font-semibold text-foreground">{title}</p>
    {description && (
      <p dir="auto" className="max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    )}
    {action}
  </div>
);

export default EmptyState;
