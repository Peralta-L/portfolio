import Image from "next/image";
import { projectVisual } from "@/content/projects";
import type { Project } from "@/types/api";

/**
 * Project image. Uses `imageUrl` (a file in /public) when set; otherwise renders
 * a lightweight generated cover so cards never show a broken or stock image.
 */
export function ProjectCover({ project }: { project: Project }) {
  if (project.imageUrl) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden border-b border-border">
        <Image
          src={project.imageUrl}
          alt={`Screenshot of ${project.title}`}
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
    );
  }

  const { icon: Icon, gradient } = projectVisual(project.slug);
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[16/9] overflow-hidden border-b border-border"
      style={{ background: `radial-gradient(120% 120% at 0% 0%, ${gradient[0]} 0%, ${gradient[1]} 60%, #09090b 100%)` }}
    >
      <div className="bg-grid absolute inset-0 opacity-60 [mask-image:none]" />
      <div className="absolute inset-x-6 top-6 bottom-0 rounded-t-xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-1 sm:inset-x-10 sm:top-8">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/20" />
        </div>
        <div className="flex items-start gap-4 p-4 sm:p-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5">
            <Icon className="size-5 text-white/90" />
          </span>
          <div className="min-w-0 flex-1 space-y-2 pt-1">
            <div className="h-2.5 w-2/3 rounded bg-white/25" />
            <div className="h-2 w-full rounded bg-white/10" />
            <div className="h-2 w-5/6 rounded bg-white/10" />
            <div className="flex gap-1.5 overflow-hidden pt-2">
              {project.technologies.slice(0, 3).map((tech) => (
                <span key={tech} className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-white/70">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
