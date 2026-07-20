import { Hammer, Plus } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader, EmptyState, Notice, StatusBadge } from "@/components/admin/admin-ui";
import { getAdminRecipes } from "@/lib/admin-data";

export default async function AdminRecipesPage({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const [recipes, query] = await Promise.all([getAdminRecipes(), searchParams]);
  return <div className="mx-auto max-w-6xl">{query.deleted ? <Notice type="deleted" /> : null}<AdminPageHeader eyebrow="Contenido" title="Recetas" description="Ingredientes, cantidades, estaciones y notas especiales." action={<Link href="/admin/recetas/nueva" className="inline-flex min-h-11 items-center gap-2 bg-[#08749a] px-5 text-sm font-black text-white"><Plus className="size-4" /> Nueva receta</Link>} />{recipes.length ? <div className="mt-7 grid gap-4">{recipes.map((recipe) => <Link key={recipe.id} href={`/admin/recetas/${recipe.id}`} className="group grid gap-4 border border-[#d5dfdc] bg-white p-5 transition hover:border-[#08749a]/50 hover:shadow-[5px_5px_0_#d5dfdc] sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="grid size-11 place-items-center bg-[#dff2f0] text-[#08749a]"><Hammer className="size-5" /></span><span><strong className="font-display block text-xl">{recipe.outputName}</strong><span className="text-sm text-[#6b8088]">{recipe.modTitle} · {recipe.itemName} · {recipe.station}</span></span><StatusBadge status={recipe.status} /></Link>)}</div> : <EmptyState>No hay recetas todavía.</EmptyState>}</div>;
}
