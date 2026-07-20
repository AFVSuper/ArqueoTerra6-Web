import type { Metadata } from "next";
import {
  ArrowRight,
  Boxes,
  ChevronRight,
  CircleDot,
  Compass,
  Lightbulb,
  Route,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ItemCard } from "@/components/site/item-card";
import { MediaFrame } from "@/components/ui/media-frame";
import { getPublishedModBySlug } from "@/lib/content";

type ModPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ModPageProps): Promise<Metadata> {
  const { slug } = await params;
  const mod = await getPublishedModBySlug(slug);
  if (!mod) return { title: "Mod no encontrado" };
  return { title: mod.title, description: mod.shortDescription };
}

export default async function ModDetailPage({ params }: ModPageProps) {
  const { slug } = await params;
  const mod = await getPublishedModBySlug(slug);
  if (!mod) notFound();
  const sections = [
    { name: "Ítems principales", image: "/images/arqueoterra/main/items_header.png" },
    { name: "Pergaminos de Mejora", image: "/images/arqueoterra/main/scrolls_header.png" },
    { name: "Ore Hunters", image: "/images/arqueoterra/main/ore_hunters_header.png" },
    { name: "Otros Cambios", image: "/images/arqueoterra/main/extra_header.png" },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-[#061723] py-12 text-white sm:py-18">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_78%_20%,#0f91b7_0,transparent_30rem)]" />
        <div className="page-wrap relative">
          <nav className="flex flex-wrap items-center gap-2 text-xs font-bold text-white/45" aria-label="Migas de pan">
            <Link href="/">Inicio</Link><ChevronRight className="size-3" />
            <Link href="/mods">Mods</Link><ChevronRight className="size-3" />
            <span className="text-[#8fd8e3]">{mod.title}</span>
          </nav>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#82d7ff] px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.14em] text-[#061723]">{mod.category}</span>
                {mod.tags.map((tag) => (
                  <span key={tag} className="border border-white/15 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.12em] text-white/65">{tag}</span>
                ))}
              </div>
              <h1 className="font-display mt-6 text-[clamp(3.4rem,8vw,7rem)] leading-[0.82] tracking-[-0.055em]">{mod.title}</h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">{mod.shortDescription}</p>
              <div className="mt-8 flex flex-wrap gap-5 text-sm font-bold text-white/60">
                <span className="inline-flex items-center gap-2"><Boxes className="size-4 text-[#8fd8e3]" /> {mod.items.length} objetos publicados</span>
                <span className="inline-flex items-center gap-2"><Wrench className="size-4 text-[#82d7ff]" /> {mod.recipes.length} recetas destacadas</span>
              </div>
            </div>
            <MediaFrame src={mod.coverImage} alt={`Portada de ${mod.title}`} className="aspect-[16/10] min-h-0 border border-white/15 shadow-[12px_12px_0_rgba(15,145,183,.22)]" priority label="Portada editable del mod" />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="page-wrap grid gap-12 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <span className="font-display text-lg">En este capítulo</span>
            <nav className="mt-4 flex flex-col border-l border-[var(--line)] text-sm font-bold text-[var(--muted)]">
              {[
                ["resumen", "Qué añade"],
                ["mecanicas", "Mecánicas"],
                ["progresion", "Progresión"],
                ["objetos", "Objetos"],
                ["recetas", "Recetas"],
              ].map(([href, label]) => (
                <a key={href} href={`#${href}`} className="border-l-2 border-transparent px-4 py-2.5 transition hover:border-[var(--ocean)] hover:text-[var(--ocean)]">{label}</a>
              ))}
            </nav>
          </aside>
          <div className="min-w-0">
            <div id="resumen" className="scroll-mt-28">
              <span className="eyebrow">Resumen del mod</span>
              <h2 className="section-heading mt-4">Qué añade a la aventura.</h2>
              <p className="text-prose mt-7 text-lg leading-9 text-[var(--muted)]">{mod.fullDescription}</p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              <article className="border border-[var(--line)] bg-white p-6 shadow-[5px_5px_0_#d5dfdc]">
                <div className="flex items-center gap-3">
                  <Compass className="size-7 text-[var(--ocean)]" />
                  <h3 className="font-display mt-1 text-2xl">En el servidor</h3>
                </div>
                <p className="text-prose mt-3 text-sm leading-7 text-[var(--muted)]">{mod.serverPurpose}</p>
              </article>
              <article id="mecanicas" className="scroll-mt-28 border border-[var(--line)] bg-white p-6 shadow-[5px_5px_0_#d5dfdc]">
                <div className="flex items-center gap-3">
                  <CircleDot className="size-7 text-[var(--ocean)]" />
                  <h3 className="font-display mt-1 text-2xl">Mecánicas clave</h3>
                </div>
                <p className="text-prose mt-3 text-sm leading-7 text-[var(--muted)]">{mod.mechanics}</p>
              </article>
              <article id="progresion" className="scroll-mt-28 border border-[var(--line)] bg-[#0a293d] p-6 text-white shadow-[5px_5px_0_#8fd8e3] sm:col-span-2">
                <div className="flex items-center gap-3">
                  <Route className="size-7 text-[#82d7ff]" />
                  <h3 className="font-display mt-1 text-3xl">Ruta recomendada</h3>
                </div>
                <p className="text-prose mt-3 max-w-3xl text-sm leading-7 text-white/65">{mod.progression}</p>
                {mod.practicalNotes ? (
                  <div className="mt-6 flex gap-3 border-t border-white/10 pt-5 text-sm leading-6 text-[#dff2f0]">
                    <Lightbulb className="mt-0.5 size-5 shrink-0 text-[#82d7ff]" />
                    <p className="text-prose"><strong>Consejo del staff:</strong> {mod.practicalNotes}</p>
                  </div>
                ) : null}
              </article>
            </div>

            <div id="objetos" className="mt-20 scroll-mt-28">
              <span className="eyebrow">Catálogo relacionado</span>
              <h2 className="section-heading mt-4">Objetos de {mod.title}.</h2>
              {mod.items.length ? (
                <div className="mt-9 space-y-14">
                  {sections.map((section, index) => {
                    const sectionItems = mod.items.filter((item) => item.tags.includes(section.name));
                    if (!sectionItems.length) return null;
                    return <section key={section.name} id={`seccion-${index + 1}`} className="scroll-mt-28"><div className="overflow-hidden border border-[var(--line)] bg-[#0a293d] text-white"><MediaFrame src={section.image} alt={section.name} className="aspect-[3/1] min-h-0 opacity-100" gradient = "linear-gradient(180deg, #61b5d1, #081124)" /><div className="p-5"><span className="text-xs font-black uppercase tracking-[.16em] text-[#8fd8e3]">Sección {String(index + 1).padStart(2, "0")} · {sectionItems.length} objetos</span><h3 className="font-display mt-2 text-3xl leading-none">{section.name}</h3></div></div><div className="mt-5 grid gap-5">{sectionItems.map((item) => <ItemCard key={item.id} item={{ ...item, modTitle: mod.title, modSlug: mod.slug }} compact />)}</div></section>;
                  })}
                </div>
              ) : (
                <p className="mt-8 border border-dashed border-[var(--line)] bg-white p-8 text-[var(--muted)]">Todavía no hay objetos publicados para este mod.</p>
              )}
            </div>

            <div id="recetas" className="mt-20 scroll-mt-28">
              <span className="eyebrow">Acceso rápido</span>
              <h2 className="section-heading mt-4">Recetas destacadas.</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {mod.recipes.map((recipe) => (
                  <Link key={recipe.id} href={`/items/${recipe.itemSlug}`} className="group flex items-center gap-4 border border-[var(--line)] bg-white p-5 transition hover:border-[#08749a]/50 hover:shadow-[5px_5px_0_#d5dfdc]">
                    <span className="grid size-11 shrink-0 place-items-center bg-[#dff2f0] text-[var(--ocean)]"><Wrench className="size-5" /></span>
                    <span className="min-w-0 flex-1"><strong className="font-display block truncate text-xl">{recipe.outputName} ×{recipe.outputQuantity}</strong><span className="text-xs font-bold text-[var(--muted)]">{recipe.station}</span></span>
                    <ArrowRight className="size-4 text-[var(--ocean)] transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
