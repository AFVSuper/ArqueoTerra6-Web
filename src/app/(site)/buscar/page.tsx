import type { Metadata } from "next";
import { SearchExperience } from "@/components/site/search-experience";
import { getSearchEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busca mods, objetos, mecánicas y formas de obtención.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q = "" }, entries] = await Promise.all([searchParams, getSearchEntries()]);

  return (
    <section className="min-h-[calc(100vh-74px)] bg-[#0a293d] py-14 text-white sm:py-20">
      <div className="page-wrap max-w-4xl">
        <span className="text-xs font-black uppercase tracking-[0.16em] text-[#8fd8e3]">Índice de la guía</span>
        <h1 className="font-display mt-4 text-5xl leading-none sm:text-7xl">¿Qué necesitas encontrar?</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/55">
          Busca por nombre, mod, categoría, uso, material o cualquier término incluido en las fichas publicadas.
        </p>
        <div className="mt-9">
          <SearchExperience entries={entries} initialQuery={q} />
        </div>
      </div>
    </section>
  );
}
