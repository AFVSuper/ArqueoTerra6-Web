"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { ModCard } from "@/components/site/mod-card";
import type { PublicModCard } from "@/lib/content";
import { normalizeSearch } from "@/lib/utils";

export function ModExplorer({ mods }: { mods: PublicModCard[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const deferredQuery = useDeferredValue(query);
  const categories = ["Todos", ...new Set(mods.map((mod) => mod.category))];
  const filteredMods = mods.filter((mod) => {
    const matchesCategory = category === "Todos" || mod.category === category;
    const haystack = normalizeSearch(
      [mod.title, mod.shortDescription, mod.category, ...mod.tags].join(" "),
    );
    return matchesCategory && haystack.includes(normalizeSearch(deferredQuery));
  });

  return (
    <div>
      <div className="grid gap-4 border border-[var(--line)] bg-white p-4 shadow-[0_14px_40px_var(--shadow)] md:grid-cols-[1fr_auto] md:items-center">
        <label className="flex min-h-12 items-center gap-3 border border-[var(--line)] bg-[#f3f8f6] px-4 focus-within:border-[var(--ocean)]">
          <Search className="size-5 text-[var(--ocean)]" />
          <span className="sr-only">Buscar mods</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nombre, categoría o mecánica..."
            className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:font-normal placeholder:text-[var(--muted)]"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="Limpiar búsqueda">
              <X className="size-4 text-[var(--muted)]" />
            </button>
          ) : null}
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <SlidersHorizontal className="mr-1 size-4 shrink-0 text-[var(--muted)]" />
          {categories.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCategory(option)}
              className={`shrink-0 px-3 py-2 text-xs font-black transition ${category === option ? "bg-[#0a293d] text-white" : "border border-[var(--line)] text-[var(--muted)] hover:border-[#08749a]/50"}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <p className="text-sm font-bold text-[var(--muted)]">
          <strong className="text-[var(--ink)]">{filteredMods.length}</strong>{" "}
          {filteredMods.length === 1 ? "mod encontrado" : "mods encontrados"}
        </p>
        {(query || category !== "Todos") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("Todos");
            }}
            className="text-xs font-black text-[var(--ocean)] hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {filteredMods.length ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {filteredMods.map((mod) => (
            <ModCard key={mod.id} mod={mod} />
          ))}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-[var(--line)] bg-white px-6 py-16 text-center">
          <span className="font-display text-3xl">No aparece en el mapa</span>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
            Prueba con menos palabras o quita el filtro de categoría.
          </p>
        </div>
      )}
    </div>
  );
}
