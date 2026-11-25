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
      title="How the pieces fit together."
      description="Code is the last step. These are the request paths and the decisions behind them."
    >
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
    </Section>
  );
}

function DiagramCard({ diagram }: { diagram: ArchitectureDiagram }) {
  return (
    <div className="grid overflow-hidden rounded-[3px] border border-border-strong bg-card lg:grid-cols-[1.25fr_1fr]">
      <div className="bg-dots relative border-b border-border-strong bg-background p-6 sm:p-10 lg:border-r lg:border-b-0">
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
        <h3 className="font-display text-xl">{diagram.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{diagram.summary}</p>
        <h4 className="mt-8 text-sm font-semibold">Key decisions</h4>
        <ul className="mt-3 divide-y divide-border border-t border-border">
          {diagram.decisions.map((decision) => (
            <li key={decision} className="py-3 text-sm leading-relaxed">
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
    <div className="flex items-center gap-3 rounded-[3px] border border-foreground bg-card px-3.5 py-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-[2px] bg-(--span) text-primary-foreground">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-tight">{node.title}</span>
        <span className="mt-1 block font-mono text-[10px] text-muted-foreground">{node.detail}</span>
      </span>
    </div>
  );
}

function Connector() {
  return (
    <span aria-hidden="true" className="flex h-8 flex-col items-center">
      <span className="w-px flex-1 bg-foreground" />
      <span className="size-0 border-x-4 border-t-[5px] border-x-transparent border-t-foreground" />
    </span>
  );
}
