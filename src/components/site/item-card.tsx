import { ArrowRight, Hammer, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { MediaFrame } from "@/components/ui/media-frame";
import type { PublicItemCard } from "@/lib/content";

type ItemCardProps = {
  item: PublicItemCard;
  compact?: boolean;
};

export function ItemCard({ item, compact = false }: ItemCardProps) {
  return (
    <article className="card-reveal group grid gap-5 overflow-hidden border border-[var(--line)] bg-white shadow-[0_12px_35px_var(--shadow)] transition duration-300 hover:border-[#0f91b7]/50 hover:shadow-[5px_5px_0_#d5dfdc] sm:grid-cols-[140px_1fr]">
      <MediaFrame
        src={item.image}
        alt={`Imagen de ${item.name}`}
        className={compact ? "aspect-square min-h-28 sm:min-h-full" : "aspect-square min-h-40 sm:min-h-full"}
        label="Imagen del objeto"
        padded
        gradient = "linear-gradient(135deg, #63d2f7, #0c304e)"
      />
      <div className="flex min-w-0 flex-col p-5">
        <Link
          href={`/mods/${item.modSlug}`}
          className="text-[0.66rem] font-black uppercase tracking-[0.15em] text-[var(--ocean)] hover:underline"
        >
          {item.modTitle}
        </Link>
        <h3 className="font-display mt-2 text-2xl leading-none">
          <Link href={`/items/${item.slug}`} className="transition group-hover:text-[var(--ocean)]">
            {item.name}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{item.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-bold text-[var(--muted)]">
          {item.durability ? (
            <span className="inline-flex items-center gap-1.5">
              <Hammer className="size-3.5 text-[var(--ocean)]" /> Durabilidad: {item.durability}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Hammer className="size-3.5 text-[var(--ocean)]" /> Sin durabilidad
            </span>
          )}
          <Link
            href={`/items/${item.slug}`}
            className="ml-auto inline-flex items-center gap-1.5 font-black text-[var(--ink)] transition hover:text-[var(--ocean)]"
          >
            Ver ficha <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
