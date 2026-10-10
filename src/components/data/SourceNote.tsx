import { BookOpen } from "lucide-react";
import { SOURCES, type SourceId } from "@/data/sources";
import { cn } from "@/lib/utils";

/** Small "Sources" line under a card. Text stays English like the clinical content. */
const SourceNote = ({ ids, className }: { ids: SourceId[]; className?: string }) => (
  <p dir="ltr" className={cn("flex items-start gap-1.5 text-start text-[11px] leading-snug text-muted-foreground", className)}>
    <BookOpen size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
    <span>
      Sources:{" "}
      {ids.map((id, i) => {
        const s = SOURCES[id];
        const text = `${s.label}${"year" in s && s.year ? ` (${s.year})` : ""}`;
        return (
          <span key={id}>
            {i > 0 && "; "}
            {"url" in s && s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                {text}
              </a>
            ) : (
              text
            )}
          </span>
        );
      })}
    </span>
  </p>
);

export default SourceNote;
