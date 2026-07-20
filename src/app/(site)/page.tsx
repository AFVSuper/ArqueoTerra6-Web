import { ArrowRight, Compass, Sparkles } from "lucide-react";
import Link from "next/link";
import { ServerAddress } from "@/components/site/server-address";
import { MediaFrame } from "@/components/ui/media-frame";
import { getPublicContentCounts } from "@/lib/content";

const sections = [
  { title: "Ítems principales", count: 27, image: "/images/arqueoterra/main/items_header.png", copy: "Ingredientes, Amuletos, Herramientas y más." },
  { title: "Pergaminos de Mejora", count: 33, image: "/images/arqueoterra/main/scrolls_header.png", copy: "Mejoras adicionales de equipamiento, encontradas en estructuras." },
  { title: "Ore Hunters", count: 10, image: "/images/arqueoterra/main/ore_hunters_header.png", copy: "Polvos de minerales para coleccionar o utilizar como moneda de cambio." },
  { title: "Otros Cambios", count: 16, image: "/images/arqueoterra/main/extra_header.png", copy: "Otros cambios añadidos en ArqueoTerraSMP 6." },
];

export default async function HomePage() {
  const counts = await getPublicContentCounts();
  const serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS ?? "play.tuservidor.net";

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#061723] pb-20 pt-14 text-white sm:pb-24 sm:pt-20">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_35%,rgba(15,145,183,.32),transparent_28rem),linear-gradient(140deg,#061723_35%,#0a293d_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(143,216,227,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(143,216,227,.08)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="page-wrap grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 border border-[#8fd8e3]/25 bg-[#8fd8e3]/10 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#8fd8e3]"><Compass className="size-4" /> Guía oficial del servidor</span>
            <h1 className="font-display mt-7 max-w-3xl whitespace-nowrap text-[clamp(2.3rem,6.5vw,5rem)] leading-[0.82] tracking-[-0.01em]">ArqueoTerraSMP<span className="text-[#8fd8e3]"> VI</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">El catálogo del mod propio del servidor. Cuatro secciones, 86 objetos y una guía que iremos completando con sus funciones, obtención y crafteos confirmados.</p>
            <Link href="/mods/arqueoterra-smp-6" className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#82d7ff] px-5 text-sm font-black text-[#061723] transition-colors duration-300 ease-out hover:bg-white">Explorar el catálogo <ArrowRight className="size-4" /></Link>
            <div className="mt-6"><ServerAddress address={serverAddress} /></div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -right-4 -top-5 size-24 border border-[#8fd8e3]/20 bg-[#0f91b7]/10" />
            <div className="relative animate-[float-map_7s_ease-in-out_infinite] border border-white/15 bg-white/8 p-3 shadow-[18px_18px_0_rgba(8,116,154,.25)] backdrop-blur">
              <MediaFrame src="/images/arqueoterra/main/items.png" alt="Ítems principales de ArqueoTerraSMP 6" gradient = "linear-gradient(180deg, #1f7795, #081124)" className="aspect-[4/3] min-h-0" priority padded/>
              <div className="absolute left-7 top-7 bg-[#061723]/80 px-3 py-2 backdrop-blur"><span className="font-display text-sm text-[#82d7ff]">CATÁLOGO INICIAL</span></div>
              <Link href="/mods/arqueoterra-smp-6#seccion-1#seccion-1" className="absolute -bottom-5 right-7 flex items-center gap-3 bg-[#e5f7f3] px-4 py-3 text-[#061723] shadow-lg"><Sparkles className="size-5 text-[#08749a]" /><span className="text-xs font-black uppercase tracking-wider">Ítems principales</span></Link>
            </div>
          </div>
        </div>
        <div className="page-wrap mt-20 grid grid-cols-3 border-y border-white/10">
          {[["4", "Secciones"], [counts.items, "Objetos catalogados"], [counts.recipes, "Recetas publicadas"]].map(([value, label]) => <div key={label} className="border-r border-white/10 px-3 py-5 text-center last:border-r-0 sm:py-7"><strong className="font-display block text-3xl text-[#8fd8e3] sm:text-5xl">{value}</strong><span className="mt-1 block text-[0.58rem] font-black uppercase tracking-[0.13em] text-white/45 sm:text-xs">{label}</span></div>)}
        </div>
      </section>
      <section className="py-20 sm:py-28">
        <div className="page-wrap">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><span className="eyebrow">Las cuatro secciones</span><h2 className="section-heading mt-4">Todo ArqueoTerraSMP 6, ordenado por colección.</h2></div><Link href="/mods/arqueoterra-smp-6" className="inline-flex shrink-0 items-center gap-2 self-start border-b-2 border-[var(--ocean)] pb-1 text-sm font-black text-[var(--ocean)]">Ver las {counts.items} fichas <ArrowRight className="size-4" /></Link></div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {sections.map((section, index) => <Link key={section.title} href={`/mods/arqueoterra-smp-6#seccion-${index + 1}`} className="group overflow-hidden border border-[var(--line)] bg-white shadow-[0_14px_40px_var(--shadow)] transition hover:-translate-y-1 hover:shadow-[7px_7px_0_#8fd8e3]"><MediaFrame src={section.image} alt={section.title} gradient = "linear-gradient(180deg, #61b5d1, #081124)" bgColor="#09202C" className="aspect-[2.5/1] min-h-0 border-b border-[var(--line)]" /><div className="p-6"><span className="text-xs font-black uppercase tracking-[.16em] text-[var(--ocean)]">Sección {String(index + 1).padStart(2, "0")} · {section.count} objetos</span><h2 className="font-display mt-3 text-3xl leading-none group-hover:text-[var(--ocean)]">{section.title}</h2><p className="mt-4 text-sm leading-6 text-[var(--muted)]">{section.copy}</p></div></Link>)}
          </div>
        </div>
      </section>
    </>
  );
}
