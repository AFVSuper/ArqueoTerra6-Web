import type { Metadata } from "next";
import {
  Box,
  ChevronRight,
  CircleHelp,
  Gauge,
  Lightbulb,
  PackageOpen,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RecipeCard } from "@/components/site/recipe-card";
import { MediaFrame } from "@/components/ui/media-frame";
import { getPublishedItemBySlug } from "@/lib/content";

type ItemPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedItemBySlug(slug);
  if (!item) return { title: "Objeto no encontrado" };
  return { title: item.name, description: item.summary };
}

export default async function ItemDetailPage({ params }: ItemPageProps) {
  const { slug } = await params;
  const item = await getPublishedItemBySlug(slug);
  if (!item) notFound();
  const stats = Object.entries(item.stats);

  return (
    <>
      <section className="relative overflow-hidden bg-[#061723] py-12 text-white sm:py-16">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_18%_50%,#0f91b7_0,transparent_30rem)]" />
        <div className="absolute right-0 top-0 h-full w-full opacity-20 [background-image:linear-gradient(rgba(143,216,227,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(143,216,227,.18)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="page-wrap relative">
          <nav className="flex flex-wrap items-center gap-2 text-xs font-bold text-white/45" aria-label="Migas de pan">
            <Link href="/">Inicio</Link><ChevronRight className="size-3" />
            <Link href="/mods">Mods</Link><ChevronRight className="size-3" />
            <Link href={`/mods/${item.modSlug}`}>{item.modTitle}</Link><ChevronRight className="size-3" />
            <span className="text-[#8fd8e3]">{item.name}</span>
          </nav>
          <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#8fd8e3]"><Box className="size-4" /> Ficha de objeto</span>
              <h1 className="font-display mt-5 text-[clamp(3rem,7vw,8rem)] leading-[0.8] tracking-[0em]">{item.name}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65">{item.summary}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                <Link href={`/mods/${item.modSlug}`} className="bg-[#82d7ff] px-3 py-2 text-xs font-black tracking-wider text-[#061723]">{item.modTitle}</Link>
                {item.tags.map((tag) => <span key={tag} className="border border-white/15 px-3 py-2 text-xs font-bold text-white/60">{tag}</span>)}
              </div>
            </div>
            <MediaFrame src={item.image} alt={`Imagen de ${item.name}`} gradient = "linear-gradient(135deg, #63d2f7, #0c304e)" className="aspect-square min-h-0 shadow-[12px_12px_0_rgba(15,145,183,.22)]" priority label="Imagen editable del objeto" padded />
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="page-wrap">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <article className="border border-[var(--line)] bg-white p-5 shadow-[4px_4px_0_#d5dfdc]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-6 text-[var(--ocean)]" />
                <span className="mt-1 block font-black uppercase tracking-[0.14em] text-[var(--muted)]">Durabilidad</span>
              </div>
              <strong className="font-display mt-1 block text-2xl">{item.durability ?? "No aplica"}</strong>
            </article>
            {stats.slice(0, 3).map(([label, value]) => (
              <article key={label} className="border border-[var(--line)] bg-white p-5 shadow-[4px_4px_0_#d5dfdc]">
              <div className="flex items-center gap-2">
                <Gauge className="size-6 text-[var(--ocean)]" />
                <span className="mt-1 block font-black uppercase tracking-[0.14em] text-[var(--muted)]">{label}</span>
              </div>
                <strong className="font-display mt-1 block text-2xl">{value}</strong>
              </article>
            ))}
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_330px]">
            <div>
              <span className="eyebrow">Descripción</span>
              {/* <h2 className="section-heading mt-4">Qué es y qué hace.</h2> */}
              <p className="text-prose mt-7 text-lg leading-9 text-[var(--ink)]">{item.description}</p>
              {item.functionDescription ? (
                <div className="mt-8 border-l-4 border-[#08749a] bg-[#dff2f0] p-6">
                  <h3 className="font-display flex items-center gap-3 text-2xl"><Sparkles className="size-6 text-[var(--ocean)]" /> Función especial</h3>
                  <p className="text-prose mt-3 text-sm leading-7 text-[var(--muted)]">{item.functionDescription}</p>
                </div>
              ) : null}
            </div>
            <aside className="border border-[var(--line)] bg-[#0a293d] p-6 text-white shadow-[7px_7px_0_#8fd8e3] lg:self-start">
              <div className="flex items-center gap-3">
                <CircleHelp className="size-7 text-[#82d7ff]" />
                <h3 className="font-display text-2xl leading-none">Ficha rápida</h3>
              </div>
              <hr className="my-4 border-t border-[#82d7ff]" />
              <dl className="divide-y divide-white/10 text-sm">
                {/* <div className="py-3"><dt className="text-white/40">Mod</dt><dd className="mt-1 font-bold">{item.modTitle}</dd></div> */}
                <div className="py-3"><dt className="text-white/40">Categoría</dt><dd className="mt-1 font-bold">{item.tags}</dd></div>
                {/* <div className="py-3"><dt className="text-white/40">Obtención</dt><dd className="mt-1 font-bold">{item.obtainMethod || "No requiere receta"}</dd></div> */}
                {item.durability ? <div className="py-3"><dt className="text-white/40">Durabilidad</dt><dd className="mt-1 font-bold">{item.durability ? `${item.durability}` : "Sin durabilidad"}</dd></div> : ""}
              </dl>
            </aside>
          </div>

          <div className="mt-16 grid gap-5 lg:grid-cols-3">
            {[
              { icon: PackageOpen, title: "Cómo conseguirlo", content: item.howToObtain },
              { icon: ShieldCheck, title: "Requisitos", content: item.requirements },
              { icon: Box, title: "Usos", content: item.uses },
              { icon: Lightbulb, title: "Consejos", content: item.tips },
            ].filter((section) => section.content).map((section) => (
              <article key={section.title} className="border border-[var(--line)] bg-white p-6 shadow-[5px_5px_0_#d5dfdc]">
                <div className="flex items-center gap-2">
                <section.icon className="size-7 text-[var(--ocean)]" />
                <h2 className="font-display mt-1 text-2xl">{section.title}</h2>
                </div>
                <p className="text-prose mt-3 text-sm leading-7 text-[var(--muted)]">{section.content}</p>
              </article>
            ))}
          </div>

          {item.gallery.length ? (
            <div className="mt-16">
              <span className="eyebrow">Imágenes oficiales</span>
              {/* <h2 className="section-heading mt-4">Referencia del objeto.</h2> */}
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {item.gallery.map((image, index) => <MediaFrame key={image} src={image} alt={`Referencia ${index + 1} de ${item.name}`} className="aspect-[4/3] min-h-0 border border-[var(--line)]" />)}
              </div>
            </div>
          ) : null}
          {item.recipes.length ? 
          <div className="mt-20">
            <span className="eyebrow">Fabricación</span>
            {/* <h2 className="section-heading mt-4">Recetas y estaciones.</h2> */}
            {item.recipes.length ? (
              <div className="mt-9 grid gap-7 lg:grid-cols-2">
                {item.recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
              </div>
            ) : (
              <div className="mt-8 border border-dashed border-[var(--line)] bg-white p-8">
                <h3 className="font-display text-2xl">No tiene receta publicada</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Consulta “Cómo conseguirlo” para ver si se obtiene explorando, comerciando o derrotando una criatura.</p>
              </div>
            )}
          </div> : "" }

          {item.relatedItems.length ? (
            <div className="mt-20">
              <span className="eyebrow">También te interesa</span>
            
                <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                  {item.relatedItems.map((related) => (
                    <article key={related.id} className="card-reveal group grid gap-5 overflow-hidden border border-[var(--line)] bg-white shadow-[0_12px_35px_var(--shadow)] transition duration-300 hover:border-[#0f91b7]/50 hover:shadow-[5px_5px_0_#d5dfdc] sm:grid-cols-[140px_1fr]">
                    <MediaFrame
                      src={related.image}
                      alt={`Imagen de ${related.name}`}
                      className="aspect-square min-h-40 sm:min-h-full"
                      label="Imagen del objeto"
                      padded
                      gradient = "linear-gradient(135deg, #63d2f7, #0c304e)"
                    />
                    <Link key={related.id} href={`/items/${related.slug}`} className="group flex flex-col justify-center bg-white p-5 transition hover:border-[#08749a]/50 hover:shadow-[5px_5px_0_#d5dfdc]">
                      <strong className="font-display text-xl group-hover:text-[var(--ocean)]">{related.name}</strong>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{related.summary}</p>
                    </Link> </article>
                  ))}
                </div>
             
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
