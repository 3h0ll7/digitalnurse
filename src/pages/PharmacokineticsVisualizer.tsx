import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/contexts/PreferencesContext";
import pharma from "@/data/pharma-i18n.json";

const PharmacokineticsVisualizer = () => {
  const { language } = usePreferences();
  const [drugName, setDrugName] = useState(pharma.drugs[0].name);
  const [phase, setPhase] = useState("A");
  const [compareA, setCompareA] = useState(pharma.drugs[0].name);
  const [compareB, setCompareB] = useState(pharma.drugs[1].name);
  const [animated, setAnimated] = useState(true);

  const h = pharma.header[language];
  const drug = pharma.drugs.find((d) => d.name === drugName) ?? pharma.drugs[0];
  const phaseObj = pharma.phases.find((p) => p.key === phase) ?? pharma.phases[0];
  const c1 = pharma.drugs.find((d) => d.name === compareA) ?? pharma.drugs[0];
  const c2 = pharma.drugs.find((d) => d.name === compareB) ?? pharma.drugs[1];

  const fasterOnset = useMemo(() => (c1.onset.length <= c2.onset.length ? c1.name : c2.name), [c1, c2]);

  return (
    <AppLayout title={h.title} subtitle={h.subtitle} actions={<Badge>ADME</Badge>}>
      <div className="grid gap-4 lg:grid-cols-[1.2fr,1fr]">
        <Card className="p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Select value={drugName} onValueChange={setDrugName}>
              <SelectTrigger className="w-[280px]"><SelectValue /></SelectTrigger>
              <SelectContent>{pharma.drugs.map((d) => <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button size="sm" variant={animated ? "default" : "outline"} onClick={() => setAnimated(true)}>{pharma.labels.animated[language]}</Button>
              <Button size="sm" variant={!animated ? "default" : "outline"} onClick={() => setAnimated(false)}>{pharma.labels.static[language]}</Button>
            </div>
          </div>
          <svg viewBox="0 0 500 260" className="w-full rounded-xl bg-slate-950/40 p-3">
            <path d="M40 130 C 140 40, 260 40, 460 130" stroke="#334155" fill="none" strokeWidth="5" />
            <rect x="58" y="95" width="70" height="70" rx="12" fill="#052e16" stroke="#22c55e" onClick={() => setPhase("A")} />
            <rect x="160" y="65" width="90" height="70" rx="12" fill="#172554" stroke="#3b82f6" onClick={() => setPhase("D")} />
            <rect x="285" y="65" width="90" height="70" rx="12" fill="#431407" stroke="#f97316" onClick={() => setPhase("M")} />
            <rect x="395" y="95" width="70" height="70" rx="12" fill="#450a0a" stroke="#ef4444" onClick={() => setPhase("E")} />
            {pharma.phases.map((p, i) => <text key={p.key} x={[72, 192, 317, 418][i]} y={[135, 105, 105, 135][i]} className="fill-white text-[14px] font-semibold">{p.key}</text>)}
            {animated && <circle r="8" fill={phaseObj.color} className="pk-dot"><animateMotion dur="4s" repeatCount="indefinite" path="M40 130 C 140 40, 260 40, 460 130" /></circle>}
          </svg>
          <div className="grid gap-2 md:grid-cols-4">
            {pharma.phases.map((p) => (
              <button key={p.key} onClick={() => setPhase(p.key)} className={`rounded-lg border p-2 text-left ${phase === p.key ? "border-cyan-400" : "border-white/10"}`}>
                <p className="font-semibold">{p.en}</p><p className="text-xs text-muted-foreground">{p.ar}</p>
              </button>
            ))}
          </div>
          <Card className="p-3 bg-slate-900/40">
            <p className="font-semibold">{phaseObj.en} / {phaseObj.ar}</p>
            <p className="text-sm text-muted-foreground">{phaseObj.location}</p>
          </Card>
        </Card>

        <Card className="p-4 space-y-2 text-sm">
          <h3 className="text-lg font-semibold">{drug.name}</h3>
          <p><strong>Route:</strong> {drug.route}</p><p><strong>Onset:</strong> {drug.onset}</p><p><strong>Peak:</strong> {drug.peak}</p><p><strong>Duration:</strong> {drug.duration}</p>
          <p><strong>Half-life:</strong> {drug.halfLife}</p><p><strong>Metabolism:</strong> {drug.metabolism}</p><p><strong>Excretion:</strong> {drug.excretion}</p>
          <p><strong>Key PK point:</strong> {drug.pk}</p>
          <div>
            <p className="font-semibold mb-1">Related</p>
            <div className="flex gap-2 flex-wrap">{drug.relatedOrgans.map((o) => <Badge key={o}>{o}</Badge>)}</div>
            <div className="text-cyan-300 mt-2 flex gap-3"><Link to="/atlas" className="underline">Body Atlas</Link><Link to="/pathways" className="underline">Pathways</Link><Link to="/drugs" className="underline">Drug Reference</Link></div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold">{pharma.labels.compareDrugs[language]}</h3>
          <div className="grid gap-2 md:grid-cols-2">
            <Select value={compareA} onValueChange={setCompareA}><SelectTrigger><SelectValue placeholder={pharma.labels.selectDrug1[language]} /></SelectTrigger><SelectContent>{pharma.drugs.map((d) => <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>)}</SelectContent></Select>
            <Select value={compareB} onValueChange={setCompareB}><SelectTrigger><SelectValue placeholder={pharma.labels.selectDrug2[language]} /></SelectTrigger><SelectContent>{pharma.drugs.map((d) => <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="grid gap-2 text-sm">
            <p><strong>{pharma.labels.fasterOnset[language]}:</strong> {fasterOnset}</p>
            <p><strong>{pharma.labels.longerDuration[language]}:</strong> {c1.duration.length >= c2.duration.length ? c1.name : c2.name}</p>
            <p><strong>{pharma.labels.shorterHalfLife[language]}:</strong> {c1.halfLife.length <= c2.halfLife.length ? c1.name : c2.name}</p>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="font-semibold">Dose Adjustment Quick Reference</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Badge variant="outline">{pharma.labels.renal.en} / {pharma.labels.renal.ar}</Badge>
            <Badge variant="outline">{pharma.labels.hepatic.en} / {pharma.labels.hepatic.ar}</Badge>
            <Badge variant="outline">{pharma.labels.obesity.en} / {pharma.labels.obesity.ar}</Badge>
            <Badge variant="outline">{pharma.labels.elderly.en} / {pharma.labels.elderly.ar}</Badge>
            <Badge variant="outline">{pharma.labels.pediatric.en} / {pharma.labels.pediatric.ar}</Badge>
          </div>
          <h4 className="font-medium mt-2">CYP450 Interaction Checker</h4>
          <div className="space-y-2 text-xs">
            {pharma.cyp.map((c) => (
              <div key={c.enzyme} className="rounded-lg border border-white/10 p-2">
                <p className="font-semibold">{c.enzyme} — {c.risk} risk</p>
                <p>Substrate: {c.substrates}</p><p>Inhibitor: {c.inhibitors}</p><p>Inducer: {c.inducers}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-2">PK Concepts</h3>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 text-sm">
          {pharma.concepts.map((c) => (
            <div key={c.nameEn} className="rounded-lg border border-white/10 p-3">
              <p className="font-semibold">{c.nameEn}</p>
              <p className="text-xs text-muted-foreground mb-1">{c.nameAr}</p>
              <p>{c.visual}</p>
            </div>
          ))}
        </div>
      </Card>
    </AppLayout>
  );
};

export default PharmacokineticsVisualizer;
