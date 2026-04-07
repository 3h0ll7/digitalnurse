import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import drugsCatalog from "@/data/drugs-catalog.json";

const DrugDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const drug = useMemo(() => drugsCatalog.drugs.find((item) => item.id === id), [id]);

  if (!drug) {
    return (
      <AppLayout title="Drug Not Found" subtitle="REFERENCE ERROR" onBack={() => navigate("/drugs")}>
        <Card className="rounded-3xl border border-white/10 bg-card/70 p-6">Unable to locate selected drug entry.</Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={drug.genericName} subtitle={`Pronunciation: ${drug.pronunciation}`} onBack={() => navigate("/drugs")}>
      <Card className="rounded-3xl border border-white/10 bg-card/80 p-5">
        <div className="flex flex-wrap gap-2">
          <Badge className="border border-white/20 bg-white/5 text-white">{drug.category}</Badge>
          {drug.highAlert && <Badge className="border-red-400/50 bg-red-500/20 text-red-100">HIGH ALERT</Badge>}
          {drug.emergency && <Badge className="border-orange-400/50 bg-orange-500/20 text-orange-100">EMERGENCY</Badge>}
          {drug.weightBased && <Badge className="border-cyan-400/50 bg-cyan-500/20 text-cyan-100">Weight-based calculator placeholder</Badge>}
          {drug.sedationReference && <Badge className="border-purple-400/50 bg-purple-500/20 text-purple-100">RASS Reference</Badge>}
        </div>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-card/60 p-2 md:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dosing">Dosing</TabsTrigger>
          <TabsTrigger value="administration">Administration</TabsTrigger>
          <TabsTrigger value="nursing">Nursing</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="effects">Side Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="rounded-3xl border border-white/10 bg-card/70 p-5 space-y-3">
            <p><span className="font-semibold">Class:</span> {drug.overview.class}</p>
            <p><span className="font-semibold">Mechanism:</span> {drug.overview.mechanism}</p>
            <p className="font-semibold">Indications</p>
            <ul className="list-disc pl-6 text-sm text-slate-200">{drug.overview.indications.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="font-semibold">Contraindications</p>
            <ul className="list-disc pl-6 text-sm text-slate-200">{drug.overview.contraindications.map((item) => <li key={item}>{item}</li>)}</ul>
          </Card>
        </TabsContent>

        <TabsContent value="dosing">
          <Card className="rounded-3xl border border-white/10 bg-card/70 p-5 space-y-2 text-sm">
            <p><span className="font-semibold">Adult Dose:</span> {drug.dosing.adultDose}</p>
            <p><span className="font-semibold">Weight-based:</span> {drug.dosing.weightBased}</p>
            <p><span className="font-semibold">Bolus vs Infusion:</span> {drug.dosing.bolusVsInfusion}</p>
            <p><span className="font-semibold">Titration:</span> {drug.dosing.titration}</p>
            {drug.dosing.titrationRange && <p><span className="font-semibold">Titration Range:</span> {drug.dosing.titrationRange}</p>}
            {drug.dosing.mapTarget && <p><span className="font-semibold">MAP Target:</span> {drug.dosing.mapTarget}</p>}
            {drug.dosing.hrTarget && <p><span className="font-semibold">HR Target:</span> {drug.dosing.hrTarget}</p>}
            <p><span className="font-semibold">Target Parameters:</span> {drug.dosing.target}</p>
            <p><span className="font-semibold">Max Dose:</span> {drug.dosing.maxDose}</p>
          </Card>
        </TabsContent>

        <TabsContent value="administration">
          <Card className="rounded-3xl border border-white/10 bg-card/70 p-5 space-y-2 text-sm">
            <p><span className="font-semibold">IV Rate:</span> {drug.administration.ivRate}</p>
            <p><span className="font-semibold">Concentration:</span> {drug.administration.concentration}</p>
            <p><span className="font-semibold">Dilution:</span> {drug.administration.dilution}</p>
            <p><span className="font-semibold">Y-site Compatibility:</span> {drug.administration.compatibility}</p>
            <p><span className="font-semibold">Stability:</span> {drug.administration.stability}</p>
            <p><span className="font-semibold">Line Selection:</span> {drug.administration.line}</p>
          </Card>
        </TabsContent>

        <TabsContent value="nursing">
          <Card className="rounded-3xl border border-white/10 bg-card/70 p-5 space-y-3 text-sm">
            <p className="font-semibold">Assessment Before</p>
            <ul className="list-disc pl-6">{drug.nursing.before.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="font-semibold">Assessment During</p>
            <ul className="list-disc pl-6">{drug.nursing.during.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="font-semibold">Assessment After</p>
            <ul className="list-disc pl-6">{drug.nursing.after.map((item) => <li key={item}>{item}</li>)}</ul>
            <p><span className="font-semibold">Monitoring Parameters:</span> {drug.nursing.monitoring.join(", ")}</p>
            <p><span className="font-semibold">When to Hold/Notify MD:</span> {drug.nursing.holdNotify}</p>
            <p><span className="font-semibold">Titration Triggers:</span> {drug.nursing.titrationTriggers}</p>
            {drug.sedationReference && <p><span className="font-semibold">Sedation Scale:</span> {drug.sedationReference}</p>}
          </Card>
        </TabsContent>

        <TabsContent value="interactions">
          <Card className="rounded-3xl border border-white/10 bg-card/70 p-5 space-y-3 text-sm">
            <p className="font-semibold">Major Drug-Drug</p>
            <ul className="list-disc pl-6">{drug.interactions.drugDrug.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="font-semibold">Incompatible IV Lines</p>
            <ul className="list-disc pl-6">{drug.interactions.ivIncompatibilities.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="font-semibold">Food Interactions</p>
            <ul className="list-disc pl-6">{drug.interactions.food.map((item) => <li key={item}>{item}</li>)}</ul>
          </Card>
        </TabsContent>

        <TabsContent value="effects">
          <Card className="rounded-3xl border border-white/10 bg-card/70 p-5 space-y-3 text-sm">
            <p className="font-semibold">Common</p>
            <ul className="list-disc pl-6">{drug.sideEffects.common.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="font-semibold">Serious</p>
            <ul className="list-disc pl-6">{drug.sideEffects.serious.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="font-semibold">Life-threatening</p>
            <ul className="list-disc pl-6">{drug.sideEffects.lifeThreatening.map((item) => <li key={item}>{item}</li>)}</ul>
            <p><span className="font-semibold">Black Box:</span> {drug.sideEffects.blackBox}</p>
            <p><span className="font-semibold">Antidote/Reversal:</span> {drug.sideEffects.antidote}</p>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default DrugDetail;
