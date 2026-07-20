"use client";

import { ArrowRight, BookOpen, Box, Search, X } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import type { SearchEntry } from "@/lib/content";
import { searchEntries } from "@/lib/search";

export function SearchExperience({
  entries,
  initialQuery,
}: {
  entries: SearchEntry[];
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [kind, setKind] = useState<"all" | "mod" | "item">("all");
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const ranked = searchEntries(entries, deferredQuery).filter(
    (entry) => kind === "all" || entry.kind === kind,
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <div className="border border-white/15 bg-white/10 p-2 backdrop-blur">
        <label className="flex min-h-14 items-center gap-3 bg-white px-4 text-[var(--ink)]">
          <Search className="size-5 shrink-0 text-[var(--ocean)]" />
          <span className="sr-only">Buscar en toda la guía</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ej.: tridente, minería, cómo conseguir cobre..."
            className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:font-normal placeholder:text-[var(--muted)]"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="Limpiar búsqueda">
              <X className="size-5 text-[var(--muted)]" />
            </button>
          ) : (
            <kbd className="hidden border border-[var(--line)] px-2 py-1 text-xs text-[var(--muted)] sm:block">/</kbd>
          )}
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {[
          ["all", "Todo"],
          ["mod", "Mods"],
          ["item", "Objetos"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setKind(value as typeof kind)}
            className={`px-4 py-2 text-xs font-black ${kind === value ? "bg-[#82d7ff] text-[#061723]" : "border border-white/15 text-white/65 hover:text-white"}`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs font-bold text-white/50">
          {ranked.length} {ranked.length === 1 ? "resultado" : "resultados"}
        </span>
      </div>

      <div className="mt-8 space-y-3">
        {ranked.length ? (
          ranked.map((entry) => (
            <Link
              key={entry.id}
              href={entry.href}
              className="group grid gap-4 border border-[var(--line)] bg-white p-5 text-[var(--ink)] shadow-[0_10px_30px_rgba(3,30,45,.13)] transition hover:-translate-y-0.5 hover:border-[#0f91b7]/60 sm:grid-cols-[auto_1fr_auto] sm:items-center"
            >
              <span className={`grid size-11 place-items-center ${entry.kind === "mod" ? "bg-[#0a293d] text-[#8fd8e3]" : "bg-[#dff2f0] text-[#08749a]"}`}>
                {entry.kind === "mod" ? <BookOpen className="size-5" /> : <Box className="size-5" />}
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <strong className="font-display text-xl leading-none sm:text-2xl">{entry.title}</strong>
                  <span className="text-[0.65rem] font-black uppercase tracking-[0.13em] text-[var(--ocean)]">{entry.subtitle}</span>
                </span>
                <span className="mt-2 line-clamp-2 block text-sm leading-6 text-[var(--muted)]">{entry.description}</span>
              </span>
              <ArrowRight className="hidden size-5 text-[var(--ocean)] transition group-hover:translate-x-1 sm:block" />
            </Link>
          ))
        ) : (
          <div className="border border-dashed border-white/20 py-14 text-center text-white">
            <span className="font-display text-3xl">No hemos encontrado esa pista</span>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55">
              Prueba con el nombre del mod, una parte del objeto o una palabra como “durabilidad”, “océano” o “minería”.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
