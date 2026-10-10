import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/contexts/PreferencesContext";
import { assessText } from "@/data/assessments-text";
import { choose, scoreItems, type ScaleDef, type Selections } from "@/lib/clinical/scores";
import { cn } from "@/lib/utils";
import ScoreResult from "./ScoreResult";

const ItemsScale = ({ scale }: { scale: ScaleDef }) => {
  const tx = assessText[usePreferences().language];
  const [selections, setSelections] = useState<Selections>({});
  const [noneApply, setNoneApply] = useState(false);
  const score = scoreItems(scale.items, selections);
  // A pure checklist is "complete" from the start; wait for a tick or an explicit "none apply".
  const checklistOnly = score.required === 0;
  const touched = Object.values(selections).some((o) => o.length > 0);
  const ready = score.complete && (!checklistOnly || touched || noneApply);
  const flags = [...new Set(score.flags)];
  const excludedMax = scale.items.filter((i) => i.excludeFromBand).reduce((sum, i) => sum + Math.max(...i.options.map((o) => o.points)), 0);
  const max = scale.range[0] < 0 ? undefined : scale.range[1] - excludedMax;

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{checklistOnly ? tx.chooseAny : tx.answered(score.answered, score.required)}</span>
          {(touched || noneApply) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSelections({});
                setNoneApply(false);
              }}
            >
              {tx.reset}
            </Button>
          )}
        </div>
        {scale.items.map((item, i) => {
          const chosen = selections[i] ?? [];
          return (
            <fieldset key={item.factor} className="space-y-2 rounded-3xl border bg-card p-4">
              <legend className="sr-only">{item.factor}</legend>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p dir="ltr" className="text-start font-semibold">{item.factor}</p>
                <span className="text-[11px] text-muted-foreground">{item.multi ? tx.chooseAny : tx.choose}</span>
              </div>
              {item.hint && <p dir="ltr" className="text-start text-xs text-muted-foreground">{item.hint}</p>}
              <div className={cn("grid gap-2", item.options.length > 6 && !item.multi ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
                {item.options.map((option, o) => {
                  const on = chosen.includes(o);
                  return (
                    <button
                      key={option.label}
                      type="button"
                      role={item.multi ? "checkbox" : "radio"}
                      aria-checked={on}
                      onClick={() => {
                        setNoneApply(false);
                        setSelections((s) => choose(scale.items, s, i, o));
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-start text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        on ? "border-primary bg-primary/10" : "hover:bg-secondary/60",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center border",
                          item.multi ? "rounded-md" : "rounded-full",
                          on ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
                        )}
                      >
                        {on && <Check size={12} strokeWidth={3} />}
                      </span>
                      <span dir="ltr" className="min-w-0 flex-1 text-start">{option.label}</span>
                      <span dir="ltr" className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground">
                        {option.points > 0 && scale.range[0] < 0 ? `+${option.points}` : option.points}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
        {checklistOnly && !touched && (
          <Button variant={noneApply ? "default" : "outline"} className="w-full rounded-2xl" aria-pressed={noneApply} onClick={() => setNoneApply((v) => !v)}>
            {tx.noneApply}
          </Button>
        )}
      </div>
      <div className="lg:sticky lg:top-4">
        <ScoreResult
          scale={scale}
          title={tx.result}
          value={ready ? score.bandScore : null}
          total={ready ? score.total : undefined}
          max={max}
          waiting={checklistOnly ? tx.finishChecklist : tx.finish}
          labels={tx}
          flags={flags}
        />
      </div>
    </div>
  );
};

export default ItemsScale;
