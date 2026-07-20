import { ArrowUpRight, Box, Layers3 } from "lucide-react";
import Link from "next/link";
import { MediaFrame } from "@/components/ui/media-frame";
import type { PublicModCard } from "@/lib/content";

export function ModCard({ mod }: { mod: PublicModCard }) {
  return (
    <article className="card-reveal group flex h-full flex-col border border-[var(--line)] bg-white shadow-[0_16px_45px_var(--shadow)] transition duration-300 hover:-translate-y-1 hover:shadow-[7px_7px_0_#8fd8e3]">
      <Link href={`/mods/${mod.slug}`} tabIndex={-1} aria-hidden="true">
        <MediaFrame
          src={mod.coverImage}
          alt={`Imagen de ${mod.title}`}
          className="aspect-[16/9] min-h-0 border-b border-[var(--line)]"
          label="Portada del mod"
          gradient = "linear-gradient(180deg, #61b5d1, #081124)"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.13em] text-[var(--ocean)]">
            <Layers3 className="size-3.5" /> {mod.category}
          </span>
          {mod.featured ? (
            <span className="bg-[#82d7ff] px-2 py-1 text-[0.62rem] font-black uppercase tracking-wider text-[#061723]">
              Destacado
            </span>
          ) : null}
        </div>
        <h2 className="font-display mt-4 text-2xl leading-none tracking-tight sm:text-3xl">
          <Link href={`/mods/${mod.slug}`} className="transition group-hover:text-[var(--ocean)]">
            {mod.title}
          </Link>
        </h2>
        <p className="mt-4 flex-1 text-sm leading-7 text-[var(--muted)]">
          {mod.shortDescription}
        </p>
        <div className="mt-6 flex items-end justify-between gap-4 border-t border-[var(--line)] pt-4">
          <div>
            <span className="flex items-center gap-2 text-sm font-black text-[var(--ink)]">
              <Box className="size-4 text-[var(--ocean)]" /> {mod.itemCount} objetos
            </span>
            <span className="mt-1 block text-xs text-[var(--muted)]">
              {mod.tags.slice(0, 3).join(" · ") || "Guía completa"}
            </span>
          </div>
          <Link
            href={`/mods/${mod.slug}`}
            className="grid size-10 shrink-0 place-items-center bg-[#0a293d] text-white transition group-hover:bg-[#08749a]"
            aria-label={`Abrir ${mod.title}`}
          >
            <ArrowUpRight className="size-5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
