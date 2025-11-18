import { useMemo, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { aiToolCategories, type AITool, type AIToolLink } from "@/data/aiTools";
import { ArrowUpRight, Cpu, MonitorSmartphone, Waves } from "lucide-react";

const heroStats = [
  { label: "Decision engines", value: "15", detail: "Realtime allies" },
  { label: "Care domains", value: "8", detail: "Bedside coverage" },
  { label: "Avg. launch", value: "<4s", detail: "In-app WebView" },
];

const AITools = () => {
  const [activeCategory, setActiveCategory] = useState(aiToolCategories[0].name);
  const [selectedLink, setSelectedLink] = useState<AIToolLink | null>(null);
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);

  const currentCategory = useMemo(
    () => aiToolCategories.find((category) => category.name === activeCategory) ?? aiToolCategories[0],
    [activeCategory],
  );

  const handleLaunch = (tool: AITool, link: AIToolLink) => {
    setSelectedTool(tool);
    setSelectedLink(link);
  };

  return (
    <AppLayout
      title="AI Tools"
      subtitle="Medical tech arsenal"
      actions={
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-white/30 bg-white/5 text-white hover:bg-white/15"
            onClick={() => setActiveCategory(aiToolCategories[0].name)}
          >
            Reset filters
          </Button>
          <Button className="bg-gradient-to-r from-[#20C5FF] via-[#3C6CFF] to-[#6D3BFF] text-white shadow-[0_12px_35px_rgba(55,156,255,0.45)]">
            <Cpu className="mr-2 h-4 w-4" />
            Deploy bedside AI
          </Button>
        </div>
      }
    >
      <section className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,0.45)] md:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">Neo-brutalist launchpad</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Curated AI copilots that stay inside the Digital Nurse aesthetic.
          </h2>
          <p className="text-sm text-white/70">
            Each tile opens a WebView so clinicians never leave the medical-tech cockpit. Trend overlays, glassmorphic chips,
            and micro-interactions reinforce safety-critical focus.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Guidelines", "Automation", "Safety", "Upskilling"].map((pill) => (
              <Badge
                key={pill}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.25)]"
              >
                {pill}
              </Badge>
            ))}
          </div>
        </div>
        <div className="grid gap-4 rounded-3xl border border-white/10 bg-[#06152A]/70 p-4 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <MonitorSmartphone className="text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">WebView ready</p>
              <p className="text-lg font-semibold">Embeds stay sandboxed</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-white/80">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.3em]">{stat.label}</p>
                <p className="text-[11px] text-white/60">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Card className="border-white/10 bg-card/80 p-0 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <div className="flex flex-col gap-6 px-6 py-5">
            <TabsList className="flex w-full flex-wrap justify-start gap-2 rounded-2xl bg-white/5 p-2">
              {aiToolCategories.map((category) => (
                <TabsTrigger
                  key={category.name}
                  value={category.name}
                  className="rounded-2xl border border-transparent px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white data-[state=active]:border-white/40 data-[state=active]:bg-white/20"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="grid gap-3 rounded-3xl border border-white/5 bg-white/5 p-4 text-sm text-muted-foreground">
              <div className="flex flex-wrap items-center gap-2 text-white">
                <Waves className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase tracking-[0.4em]">Current signal</span>
                <p className="text-sm text-white/70">{currentCategory.tagline}</p>
              </div>
            </div>
          </div>
          {aiToolCategories.map((category) => (
            <TabsContent key={category.name} value={category.name} className="px-6 pb-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {category.tools.map((tool) => (
                  <Card
                    key={tool.name}
                    className="group flex flex-col gap-4 rounded-3xl border-white/10 bg-gradient-to-b from-white/10 to-transparent p-5 text-white transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-white/60">{category.name}</p>
                        <h3 className="text-xl font-semibold">{tool.name}</h3>
                      </div>
                      <span className="rounded-2xl border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70">
                        AI Tool
                      </span>
                    </div>
                    <p className="text-sm text-white/70">{tool.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {tool.links.map((link) => (
                        <Button
                          key={`${tool.name}-${link.label}`}
                          variant="ghost"
                          className="group/btn justify-between rounded-2xl border border-white/15 bg-white/5 px-4 text-white hover:bg-white/15"
                          onClick={() => handleLaunch(tool, link)}
                        >
                          {link.label}
                          <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                        </Button>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      <Card className="rounded-3xl border-white/10 bg-gradient-to-r from-[#233E70] via-[#1B2B45] to-[#101726] p-6 text-white shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Clinical continuity</p>
            <h3 className="text-2xl font-semibold">Pin your favorite AI copilots to the bedside rounds list.</h3>
            <p className="text-sm text-white/70">
              Drag-and-drop inside this workspace to create personalized decks, coming soon as part of the Digital Nurse Pro
              release.
            </p>
          </div>
          <Button
            variant="secondary"
            className="rounded-2xl bg-white/90 text-background hover:bg-white"
            onClick={() => handleLaunch(aiToolCategories[0].tools[0], aiToolCategories[0].tools[0].links[0])}
          >
            Preview workflow
          </Button>
        </div>
      </Card>

      <Dialog
        open={Boolean(selectedTool && selectedLink)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTool(null);
            setSelectedLink(null);
          }
        }}
      >
        <DialogContent className="max-w-5xl border-white/10 bg-[#030711] text-white">
          <DialogHeader>
            <DialogTitle className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.4em] text-white/60">WebView</span>
              {selectedTool?.name}
            </DialogTitle>
            {selectedLink && (
              <p className="text-sm text-white/60">{selectedLink.url}</p>
            )}
          </DialogHeader>
          <div className="h-[70vh] overflow-hidden rounded-2xl border border-white/10">
            {selectedLink && (
              <ScrollArea className="h-full w-full">
                <iframe
                  src={selectedLink.url}
                  title={selectedTool?.name}
                  className="h-[70vh] w-full rounded-2xl border-0"
                />
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default AITools;
