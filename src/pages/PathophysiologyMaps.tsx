import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/contexts/PreferencesContext";
import pathways from "@/data/pathways-i18n.json";

const nodeColors: Record<string, string> = {
  Trigger: "#ef4444",
  Mechanism: "#3b82f6",
  "Clinical Sign": "#eab308",
  Intervention: "#22c55e",
  Complication: "#f97316",
  Outcome: "#ffffff"
};

const PathophysiologyMaps = () => {
  const { language } = usePreferences();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState(pathways.maps[0].id);

  const header = pathways.header[language];
  const filtered = useMemo(() => pathways.maps.filter((m) => {
    const byFilter = filter === "ALL" || m.category === filter;
    const q = query.trim().toLowerCase();
    const bySearch = !q || m.name.toLowerCase().includes(q) || m.ar.includes(query);
    return byFilter && bySearch;
  }), [filter, query]);

  const selected = pathways.maps.find((m) => m.id === selectedId) ?? filtered[0] ?? pathways.maps[0];
  const nodes = selected.cascade.split("→").map((n) => n.trim());

  return (
    <AppLayout title={header.title} subtitle={header.subtitle} actions={<Badge>{filtered.length} maps</Badge>}>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-3" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={header.search} className="pl-10 rtl:pl-4 rtl:pr-10" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {pathways.filters.map((f) => (
          <Button key={f.key} size="sm" variant={filter === f.key ? "default" : "outline"} onClick={() => setFilter(f.key)}>
            {language === "ar" ? f.ar : f.en}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[360px,1fr]">
        <Card className="p-3 max-h-[70vh] overflow-auto space-y-2">
          {filtered.map((m) => (
            <button key={m.id} onClick={() => setSelectedId(m.id)} className={`w-full rounded-xl border p-3 text-left ${selected.id === m.id ? "border-cyan-400 bg-cyan-500/10" : "border-white/10"}`}>
              <p className="font-semibold text-sm">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.ar}</p>
              <Badge variant="outline" className="mt-2">{m.category}</Badge>
            </button>
          ))}
        </Card>

        <Card className="p-4 space-y-4">
          <div>
            <h3 className="text-2xl font-semibold">{selected.name}</h3>
            <p className="text-sm text-muted-foreground">{selected.ar}</p>
          </div>
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <p><strong>Definition:</strong> {selected.definition}</p>
            <p><strong>Etiology:</strong> {selected.etiology}</p>
            <p><strong>Clinical Presentation:</strong> {selected.presentation}</p>
            <p><strong>Diagnostic Criteria:</strong> {selected.diagnostics}</p>
            <p><strong>Nursing Interventions:</strong> {selected.nursing}</p>
            <p><strong>Medical Treatment:</strong> {selected.medical}</p>
            <p><strong>Complications:</strong> {selected.complications}</p>
            <p><strong>Key Labs:</strong> {selected.labs}</p>
            <p className="md:col-span-2"><strong>Nursing Tips:</strong> {selected.tips}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3 space-y-3">
            <p className="text-sm font-semibold">Cascade Flow</p>
            <svg viewBox={`0 0 ${Math.max(900, nodes.length * 150)} 120`} className="w-full">
              {nodes.map((node, idx) => {
                const x = 20 + idx * 145;
                const type = idx === 0 ? "Trigger" : idx === nodes.length - 1 ? "Outcome" : idx < nodes.length - 2 ? "Mechanism" : "Complication";
                return (
                  <g key={node + idx}>
                    <rect x={x} y={30} width="125" height="50" rx="10" fill="rgba(15,23,42,0.85)" stroke={nodeColors[type]} />
                    <text x={x + 62} y={58} textAnchor="middle" className="fill-white text-[10px]">{node.slice(0, 28)}</text>
                    {idx < nodes.length - 1 && <path d={`M ${x + 126} 55 L ${x + 140} 55`} stroke="#38bdf8" markerEnd="url(#arrow)" />}
                  </g>
                );
              })}
              <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#38bdf8" /></marker></defs>
            </svg>
          </div>

          <div className="text-sm text-cyan-300 flex gap-4 flex-wrap">
            <Link to="/atlas" className="underline">Related anatomy</Link>
            <Link to="/pharma" className="underline">Related pharmacokinetics</Link>
            <Link to="/drugs" className="underline">Intervention drugs</Link>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PathophysiologyMaps;
