import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Result } from "@/lib/clinical/calculators";

export const Field = ({ id, label, value, onChange, type = "decimal" }: { id: string; label: string; value: string; onChange: (v: string) => void; type?: "decimal" | "date" }) => (
  <div className="min-w-0 space-y-1">
    <label htmlFor={id} className="block text-xs font-medium">{label}</label>
    <Input id={id} dir="ltr" type={type === "date" ? "date" : "text"} inputMode={type === "date" ? undefined : "decimal"} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

export const Choice = <T extends string>({ value, options, onChange, label }: { value: T; options: { value: NoInfer<T>; label: string }[]; onChange: (v: NoInfer<T>) => void; label: string }) => (
  <div role="group" aria-label={label} className="flex flex-wrap gap-1 rounded-2xl border bg-muted/40 p-1">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        aria-pressed={value === o.value}
        onClick={() => onChange(o.value)}
        className={cn("flex-1 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors", value === o.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export const Panel = ({ title, children, className }: { title?: string; children: ReactNode; className?: string }) => (
  <section className={cn("space-y-3 rounded-3xl border bg-card p-4 shadow-card sm:p-5", className)}>
    {title && <h2 className="text-sm font-semibold">{title}</h2>}
    {children}
  </section>
);

type Failure = Extract<Result<unknown>, { ok: false }>;

/** Shows the result only when it is valid; otherwise a short instruction instead of misleading numbers. */
export const Outcome = <T,>({ result, enter, outOfRange, children }: { result: Result<T>; enter: string; outOfRange: (field: string) => string; children: (value: T) => ReactNode }) => {
  // The project compiles without strictNullChecks, so narrow on `ok` by hand.
  if (result.ok) return <>{children((result as { value: T }).value)}</>;
  const failure = result as Failure;
  return (
    <p role="status" className={cn("rounded-2xl border border-dashed p-3 text-center text-sm", failure.reason === "range" ? "border-medical-yellow/50 text-medical-yellow" : "text-muted-foreground")}>
      {failure.reason === "range" ? outOfRange(failure.field) : enter}
    </p>
  );
};

export const Num = ({ children }: { children: ReactNode }) => <span dir="ltr" className="tabular-nums">{children}</span>;
