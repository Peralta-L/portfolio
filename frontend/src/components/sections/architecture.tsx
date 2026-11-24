import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { architectures } from "@/content/architecture";
import { cn } from "@/lib/utils";
import type { ArchitectureDiagram, ArchitectureNode } from "@/types/content";

export function Architecture() {
  const first = architectures[0];
  if (!first) return null;

  return (
    <Section
      id="architecture"
      eyebrow="Architecture"
      title="How the pieces fit together."
      description="Code is the last step. These are the request paths and the decisions behind them."
    >
      <Reveal>
        <Tabs defaultValue={first.slug}>
          <TabsList aria-label="Select a project architecture">
            {architectures.map((a) => (
              <TabsTrigger key={a.slug} value={a.slug}>
                {a.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {architectures.map((a) => (
            <TabsContent key={a.slug} value={a.slug}>
              <DiagramCard diagram={a} />
            </TabsContent>
          ))}
        </Tabs>
      </Reveal>
    </Section>
  );
}

function DiagramCard({ diagram }: { diagram: ArchitectureDiagram }) {
  return (
    <div className="grid overflow-hidden rounded-2xl border border-border bg-card/40 shadow-soft lg:grid-cols-[1.25fr_1fr]">
      <div className="relative border-b border-border p-6 sm:p-10 lg:border-r lg:border-b-0">
        <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-50 [mask-image:none]" />
        <ol className="relative mx-auto flex max-w-md flex-col items-stretch" aria-label={`${diagram.name} request flow`}>
          {diagram.tiers.map((tier, i) => (
            <li key={i} className="flex flex-col items-center">
              {i > 0 ? <Connector /> : null}
              <div className={cn("grid w-full gap-3", tier.length > 1 && "grid-cols-2")}>
                {tier.map((node) => (
                  <Node key={node.title} node={node} />
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="p-6 sm:p-10">
        <h3 className="text-lg font-semibold tracking-tight">{diagram.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{diagram.summary}</p>
        <h4 className="mt-8 font-mono text-xs tracking-[0.18em] text-zinc-400 uppercase">Key decisions</h4>
        <ul className="mt-4 space-y-3.5">
          {diagram.decisions.map((decision) => (
            <li key={decision} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
              {decision}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Node({ node }: { node: ArchitectureNode }) {
  const Icon = node.icon;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border-strong bg-background/90 px-4 py-3 shadow-soft">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-accent ring-1 ring-primary/30">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium leading-tight">{node.title}</span>
        <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">{node.detail}</span>
      </span>
    </div>
  );
}

function Connector() {
  return (
    <span aria-hidden="true" className="flex h-8 flex-col items-center">
      <span className="w-px flex-1 bg-gradient-to-b from-border-strong to-primary/60" />
      <span className="size-0 border-x-4 border-t-[5px] border-x-transparent border-t-primary/70" />
    </span>
  );
}
