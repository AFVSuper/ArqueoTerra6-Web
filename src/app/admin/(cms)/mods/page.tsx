import { Layers3, Plus } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader, EmptyState, Notice, StatusBadge } from "@/components/admin/admin-ui";
import { getAdminMods } from "@/lib/admin-data";
import { formatDate } from "@/lib/utils";

export default async function AdminModsPage({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const [modsList, query] = await Promise.all([getAdminMods(), searchParams]);
  return (
    <div className="mx-auto max-w-6xl">
      {query.deleted ? <Notice type="deleted" /> : null}
      <AdminPageHeader eyebrow="Contenido" title="Mods" description="Los capítulos principales de la guía pública." action={<Link href="/admin/mods/nuevo" className="inline-flex min-h-11 items-center gap-2 bg-[#08749a] px-5 text-sm font-black text-white"><Plus className="size-4" /> Nuevo mod</Link>} />
      {modsList.length ? (
        <div className="mt-7 overflow-x-auto border border-[#d5dfdc] bg-white shadow-[0_10px_30px_rgba(3,30,45,.06)]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#09202c] text-[0.65rem] uppercase tracking-[0.12em] text-white/55"><tr><th className="px-5 py-3">Mod</th><th className="px-4 py-3">Categoría</th><th className="px-4 py-3">Objetos</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Actualizado</th><th className="px-5 py-3 text-right">Acción</th></tr></thead>
            <tbody className="divide-y divide-[#e1e9e7]">
              {modsList.map((mod) => <tr key={mod.id} className="hover:bg-[#f3f8f6]"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="font-display grid size-9 place-items-center bg-[#dff2f0] text-[#08749a]"><Layers3 className="size-4" /></span><span><strong className="block text-[#09202c]">{mod.title}</strong><span className="text-xs text-[#7f9298]">/{mod.slug}</span></span></div></td><td className="px-4 py-4 font-semibold text-[#55707a]">{mod.category}</td><td className="px-4 py-4 font-black text-[#294955]">{mod.itemCount}</td><td className="px-4 py-4"><StatusBadge status={mod.status} /></td><td className="px-4 py-4 text-xs text-[#6b8088]">{formatDate(mod.updatedAt)}</td><td className="px-5 py-4 text-right"><Link href={`/admin/mods/${mod.id}`} className="font-black text-[#08749a] hover:underline">Editar</Link></td></tr>)}
            </tbody>
          </table>
        </div>
      ) : <EmptyState>No hay mods todavía. Crea el primer capítulo de la guía.</EmptyState>}
    </div>
  );
}
