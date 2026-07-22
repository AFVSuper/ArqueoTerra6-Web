import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { ModExplorer } from "@/components/site/mod-explorer";
import { getPublishedMods } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guía",
  description: "Catálogo de ArqueoTerraSMP 6.",
};

export default async function ModsPage() {
  const mods = await getPublishedMods();

  return (
    <>
      <section className="relative overflow-hidden bg-[#061723] py-16 text-white sm:py-24">
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_30%_50%,rgba(15,145,183,.32),transparent_28rem)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(143,216,227,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(143,216,227,.15)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="page-wrap relative">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#8fd8e3]">
            <Compass className="size-4" /> Guía del servidor
          </span>
          <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[0.9] tracking-[-0.04em] sm:text-7xl">
            Un mod. Cuatro colecciones.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/60">
            ArqueoTerraSMP 6 concentra todo el contenido propio del servidor. Explora sus objetos por sección.
          </p>
        </div>
      </section>
      <section className="py-14 sm:py-20">
        <div className="page-wrap">
          <ModExplorer mods={mods} />
        </div>
      </section>
    </>
  );
}
