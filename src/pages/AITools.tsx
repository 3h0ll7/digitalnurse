import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MonitorPlay, ShieldCheck } from "lucide-react";

interface Tool {
  name: string;
  description: string;
  url: string;
}

const tools: Tool[] = [
  {
    name: "ClinicalKey AI",
    description: "Fast clinical answers with evidence-based recommendations.",
    url: "https://www.elsevier.com/en-us/solutions/clinicalkey/clinicalkey-ai",
  },
  {
    name: "UpToDate AI",
    description: "Instant bedside clinical search and treatment summaries.",
    url: "https://www.uptodate.com/home/ai",
  },
  {
    name: "Glass AI",
    description: "Differential diagnosis and medical reasoning assistant.",
    url: "https://glass.health/ai",
  },
  {
    name: "Elsevier Skills AI",
    description: "Nursing procedures with step-by-step guidance.",
    url: "https://www.elsevier.com/solutions/elsevier-skills",
  },
  {
    name: "SimX VR",
    description: "Nursing simulation scenarios for practice.",
    url: "https://www.simxvr.com/",
  },
  {
    name: "SafeDose AI",
    description: "Medication dose checking and titration support.",
    url: "https://www.safedose.com/",
  },
  {
    name: "MedPaLM",
    description: "Medical LLM for clinical interpretation and advanced queries.",
    url: "https://sites.research.google/medpalm/",
  },
];

const AITools = () => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenTool = (tool: Tool) => {
    setActiveTool(tool);
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setActiveTool(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background pb-24">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Nursing Intelligence Suite</p>
          <h1 className="text-3xl font-bold text-foreground">AI Tools — Nursing Intelligence Suite</h1>
          <p className="text-base text-muted-foreground">
            Launch trusted bedside AI experiences in a focused WebView designed for clinical workflows.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {tools.map((tool) => (
            <article
              key={tool.name}
              className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-card/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.45)] backdrop-blur"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">{tool.name}</h2>
                <p className="text-base text-muted-foreground">{tool.description}</p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Secure in-app WebView launch</span>
                </div>
                <Button
                  className="w-full rounded-2xl py-5 text-base font-semibold sm:w-auto"
                  onClick={() => handleOpenTool(tool)}
                >
                  Open
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="h-[85vh] max-w-5xl w-[95vw] overflow-hidden p-0">
          {activeTool && (
            <>
              <DialogHeader className="px-6 pt-6">
                <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <MonitorPlay className="h-5 w-5 text-primary" />
                  {activeTool.name}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  The tool loads inside a secure sandboxed view so you can stay in the Digital Nurse Companion.
                </DialogDescription>
              </DialogHeader>
              <div className="h-full w-full px-6 pb-6">
                <iframe
                  key={activeTool.url}
                  src={activeTool.url}
                  title={activeTool.name}
                  className="h-full w-full rounded-2xl border border-white/10 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AITools;
