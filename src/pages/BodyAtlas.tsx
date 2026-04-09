import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, FlaskConical, Microscope, Search, Share2, Bookmark } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import atlas from "@/data/atlas-i18n.json";
import { usePreferences } from "@/contexts/PreferencesContext";

const bodyNodes = [
  { id: 15, cx: 100, cy: 60 }, { id: 1, cx: 100, cy: 110 }, { id: 9, cx: 80, cy: 110 }, { id: 9, cx: 120, cy: 110 },
  { id: 21, cx: 115, cy: 150 }, { id: 22, cx: 95, cy: 155 }, { id: 26, cx: 80, cy: 195 }, { id: 26, cx: 120, cy: 195 },
  { id: 38, cx: 100, cy: 245 }, { id: 40, cx: 100, cy: 285 }
];

const BodyAtlas = () => {
  const { language, direction } = usePreferences();
  const [query, setQuery] = useState("");
  const [selectedOrgan, setSelectedOrgan] = useState<number>(1);
  const [selectedReceptor, setSelectedReceptor] = useState(0);
  const [selectedHormone, setSelectedHormone] = useState(0);
  const [viewMode, setViewMode] = useState<"anterior" | "posterior" | "lateral">("anterior");
  const [system, setSystem] = useState("all");

  const h = atlas.header[language];
  const organs = atlas.organs.filter((o) => {
    const q = query.trim().toLowerCase();
    const match = !q || o.en.toLowerCase().includes(q) || o.ar.includes(query);
    const systemMatch = system === "all" || o.system === system;
    return match && systemMatch;
  });

  const selectedOrganCard = atlas.organs.find((o) => o.id === selectedOrgan) ?? atlas.organs[0];

  const systemKeys = useMemo(() => Object.keys(atlas.systems), []);

  return (
    <AppLayout title={h.title} subtitle={h.subtitle} actions={<Badge>{atlas.organs.length + atlas.receptors.length + atlas.hormones.length}</Badge>}>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-3" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={h.search} className="pl-10 rtl:pl-4 rtl:pr-10" />
      </div>

      <Tabs defaultValue="body" className="space-y-4" dir={direction}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="body">{atlas.tabs.bodyMap[language]}</TabsTrigger>
          <TabsTrigger value="receptors">{atlas.tabs.receptors[language]}</TabsTrigger>
          <TabsTrigger value="hormones">{atlas.tabs.hormones[language]}</TabsTrigger>
          <TabsTrigger value="biomarkers">{atlas.tabs.biomarkers[language]}</TabsTrigger>
          <TabsTrigger value="landmarks">{atlas.tabs.landmarks[language]}</TabsTrigger>
        </TabsList>

        <TabsContent value="body" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(["anterior", "posterior", "lateral"] as const).map((v) => (
              <Button key={v} size="sm" variant={viewMode === v ? "default" : "outline"} onClick={() => setViewMode(v)}>
                {atlas.views[v][language]}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button size="sm" variant={system === "all" ? "default" : "outline"} onClick={() => setSystem("all")}>{atlas.common.allSystems[language]}</Button>
            {systemKeys.map((key) => (
              <Button key={key} size="sm" variant={system === key ? "default" : "outline"} onClick={() => setSystem(key)}>
                {key}
              </Button>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
            <Card className="p-4">
              <svg viewBox="0 0 200 320" className="w-full rounded-xl bg-slate-950/50 p-2">
                <rect x="70" y="20" width="60" height="70" rx="30" fill="#0f172a" stroke="#06b6d4" />
                <rect x="65" y="90" width="70" height="120" rx="30" fill="#0f172a" stroke="#06b6d4" />
                <rect x="50" y="90" width="15" height="90" rx="8" fill="#0f172a" stroke="#06b6d4" />
                <rect x="135" y="90" width="15" height="90" rx="8" fill="#0f172a" stroke="#06b6d4" />
                <rect x="75" y="210" width="20" height="90" rx="8" fill="#0f172a" stroke="#06b6d4" />
                <rect x="105" y="210" width="20" height="90" rx="8" fill="#0f172a" stroke="#06b6d4" />
                {bodyNodes.map((node, idx) => {
                  const item = atlas.organs.find((o) => o.id === node.id);
                  if (!item) return null;
                  const color = atlas.systems[item.system as keyof typeof atlas.systems].color;
                  return (
                    <circle
                      key={`${node.id}-${idx}`}
                      cx={node.cx}
                      cy={node.cy}
                      r={selectedOrgan === node.id ? 9 : 6}
                      fill={color}
                      className="cursor-pointer transition-all"
                      onClick={() => setSelectedOrgan(node.id)}
                    />
                  );
                })}
                <text x="100" y="312" textAnchor="middle" className="fill-slate-300 text-[10px]">{atlas.views[viewMode][language]} · {atlas.common.tapExplore[language]}</text>
              </svg>
            </Card>
            <Card className="p-4 space-y-3">
              <h3 className="text-xl font-semibold">{selectedOrganCard.en}</h3>
              <p className="text-sm text-slate-300">{selectedOrganCard.ar}</p>
              <div className="grid gap-2 md:grid-cols-2 text-sm">
                <p><strong>Body System:</strong> {selectedOrganCard.system} — {atlas.systems[selectedOrganCard.system as keyof typeof atlas.systems].ar}</p>
                <p><strong>Location:</strong> {selectedOrganCard.location}</p>
                <p><strong>Function:</strong> {selectedOrganCard.function}</p>
                <p><strong>Clinical Relevance:</strong> {selectedOrganCard.clinical}</p>
                <p><strong>Assessment:</strong> {selectedOrganCard.assessment}</p>
                <p><strong>Normal Values:</strong> {selectedOrganCard.normal}</p>
                <p><strong>Red Flags:</strong> {selectedOrganCard.redFlags}</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Related Drugs</p>
                <div className="flex flex-wrap gap-2">{selectedOrganCard.drugs.map((d) => <Badge key={d}>{d}</Badge>)}</div>
              </div>
              <div className="space-y-1">
                <p className="font-semibold">{atlas.common.related[language]}</p>
                <div className="flex flex-wrap gap-3 text-sm text-cyan-300">
                  {selectedOrganCard.conditions.map((c) => <Link key={c} to="/pathways" className="underline">{c}</Link>)}
                  <Link to="/pharma" className="underline">PK Visualizer</Link>
                  <Link to="/drugs" className="underline">Drug Reference</Link>
                </div>
              </div>
            </Card>
          </div>
          <Card className="p-4">
            <p className="mb-2 text-sm text-muted-foreground">{organs.length} / {atlas.organs.length}</p>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {organs.map((o) => (
                <button key={o.id} className="rounded-lg border border-white/10 p-3 text-left hover:bg-white/5" onClick={() => setSelectedOrgan(o.id)}>
                  <p className="font-medium">{o.en}</p><p className="text-xs text-muted-foreground">{o.ar}</p>
                </button>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="receptors">
          <div className="grid gap-4 lg:grid-cols-[1fr,1fr]">
            <Card className="p-4">
              <svg viewBox="0 0 320 220" className="w-full rounded-xl bg-slate-950/40 p-2">
                <ellipse cx="160" cy="110" rx="130" ry="80" fill="#0f172a" stroke="#06b6d4" />
                {atlas.receptors.slice(0, 10).map((r, i) => (
                  <g key={r.name} onClick={() => setSelectedReceptor(i)} className="cursor-pointer">
                    <rect x={20 + i * 28} y={25 + (i % 2) * 150} width="24" height="20" rx="4" fill={selectedReceptor === i ? "#06b6d4" : "#1e293b"} stroke="#38bdf8" />
                  </g>
                ))}
              </svg>
            </Card>
            <Card className="p-4 space-y-2">
              {(() => { const r = atlas.receptors[selectedReceptor]; return <>
                <h3 className="text-lg font-semibold">{r.name}</h3><p className="text-sm text-muted-foreground">{r.ar}</p>
                <p><strong>Type:</strong> {r.type}</p><p><strong>Location:</strong> {r.location}</p>
                <p><strong>Stimulation:</strong> {r.stimulation}</p><p><strong>Blockade:</strong> {r.blockade}</p>
                <p><strong>Agonists:</strong> {r.agonists}</p><p><strong>Antagonists:</strong> {r.antagonists}</p>
                <p><strong>Clinical:</strong> {r.clinical}</p>
                <div className="text-cyan-300 text-sm"><Link to="/pharma" className="underline">Related PK drugs</Link></div>
              </>; })()}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hormones">
          <div className="grid gap-4 lg:grid-cols-[1fr,1fr]">
            <Card className="p-4"><svg viewBox="0 0 380 220" className="w-full rounded-xl bg-slate-950/40 p-3"><path d="M40 40 L180 40 L180 100 L320 100" stroke="#ef4444" fill="none"/><path d="M180 40 L180 170 L320 170" stroke="#3b82f6" fill="none"/><circle cx="40" cy="40" r="16" fill="#334155"/><circle cx="180" cy="40" r="16" fill="#334155"/><circle cx="180" cy="100" r="16" fill="#334155"/><circle cx="320" cy="100" r="16" fill="#334155"/><circle cx="320" cy="170" r="16" fill="#334155"/><text x="20" y="70" className="fill-white text-[11px]">Hypothalamus</text></svg></Card>
            <Card className="p-4 space-y-2 max-h-[420px] overflow-auto">
              {atlas.hormones.map((hormone, idx) => (
                <button key={hormone.name} onClick={() => setSelectedHormone(idx)} className={`w-full rounded-lg border p-3 text-left ${selectedHormone === idx ? "border-cyan-400 bg-cyan-500/10" : "border-white/10"}`}>
                  <p className="font-medium">{hormone.name}</p><p className="text-xs text-muted-foreground">{hormone.ar}</p>
                </button>
              ))}
            </Card>
          </div>
          <Card className="p-4 mt-4">{(() => { const hCard = atlas.hormones[selectedHormone]; return <div className="grid gap-2 md:grid-cols-2 text-sm"><p><strong>Produced By:</strong> {hCard.gland}</p><p><strong>Target:</strong> {hCard.target}</p><p><strong>Function:</strong> {hCard.function}</p><p><strong>Excess:</strong> {hCard.excess}</p><p><strong>Deficiency:</strong> {hCard.deficiency}</p><p><strong>Lab:</strong> {hCard.lab}</p><p><strong>Normal:</strong> {hCard.normal}</p><p><strong>ICU:</strong> {hCard.icu}</p><p><strong>Related Drugs:</strong> {hCard.drugs}</p></div>; })()}</Card>
        </TabsContent>

        <TabsContent value="biomarkers">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {atlas.biomarkers.map((b) => (
              <Card key={b.name} className="p-4 space-y-1 text-sm">
                <p className="font-semibold">{b.name}</p>
                <p><strong>Normal:</strong> {b.normal}</p><p><strong>Critical High:</strong> {b.high}</p><p><strong>Critical Low:</strong> {b.low}</p>
                <p><strong>Significance:</strong> {b.use}</p><p><strong>When to order:</strong> {b.order}</p><p><strong>↑:</strong> {b.up}</p><p><strong>↓:</strong> {b.down}</p><p><strong>Nursing:</strong> {b.nursing}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="landmarks">
          <div className="grid gap-4 md:grid-cols-2">
            {atlas.landmarks.map((l) => (
              <Card key={l.name} className="p-4 space-y-2">
                <h3 className="font-semibold">{l.name}</h3><p className="text-sm text-muted-foreground">{l.ar}</p>
                <p className="text-sm"><strong>Landmarks:</strong> {l.landmarks}</p>
                <p className="text-sm"><strong>Steps:</strong> {l.steps}</p>
                <p className="text-sm"><strong>Nurse role:</strong> {l.nurse}</p>
                <p className="text-sm"><strong>Complications:</strong> {l.complications}</p>
                <p className="text-sm"><strong>Checklist:</strong> {l.checklist}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 text-xs text-muted-foreground">
        <Badge variant="outline"><BookOpen size={12} className="mr-1" />{atlas.common.source[language]}</Badge>
        <Badge variant="outline"><FlaskConical size={12} className="mr-1" />ICU Reference</Badge>
        <Badge variant="outline"><Microscope size={12} className="mr-1" />{atlas.common.lastUpdated[language]}: 2026-04-09</Badge>
        <Button size="icon" variant="ghost"><Bookmark size={14} /></Button>
        <Button size="icon" variant="ghost"><Share2 size={14} /></Button>
      </div>
    </AppLayout>
  );
};

export default BodyAtlas;
