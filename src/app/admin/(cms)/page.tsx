import { ArrowRight, Box, Eye, FileClock, Hammer, Layers3 } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader, StatusBadge } from "@/components/admin/admin-ui";
import { getAdminDashboardData } from "@/lib/admin-data";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();
  const cards = [
    { label: "Mods", icon: Layers3, href: "/admin/mods", data: data.mods },
    { label: "Objetos", icon: Box, href: "/admin/items", data: data.items },
    { label: "Recetas", icon: Hammer, href: "/admin/recetas", data: data.recipes },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader eyebrow="Centro editorial" title="Estado de la guía" description="Un vistazo rápido al catálogo, los borradores pendientes y los últimos cambios." action={<Link href="/" target="_blank" className="inline-flex min-h-11 items-center gap-2 bg-[#09202c] px-5 text-sm font-black text-white"><Eye className="size-4" /> Ver web</Link>} />
      <div className="mt-7 grid gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="group border border-[#d5dfdc] bg-white p-6 shadow-[0_10px_30px_rgba(3,30,45,.06)] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#8fd8e3]">
            <div className="flex items-start justify-between"><span className="grid size-11 place-items-center bg-[#dff2f0] text-[#08749a]"><card.icon className="size-5" /></span><ArrowRight className="size-4 text-[#08749a] transition group-hover:translate-x-1" /></div>
            <strong className="font-display mt-6 block text-4xl text-[#09202c]">{card.data.total}</strong>
            <span className="text-sm font-black text-[#294955]">{card.label}</span>
            <div className="mt-4 flex gap-4 border-t border-[#e1e9e7] pt-4 text-xs font-bold text-[#6b8088]"><span>{card.data.published} publicados</span><span>{card.data.draft} borradores</span></div>
          </Link>
        ))}
      </div>
      <section className="mt-8 border border-[#d5dfdc] bg-white shadow-[0_10px_30px_rgba(3,30,45,.06)]">
        <div className="flex items-center justify-between border-b border-[#e1e9e7] px-5 py-4 sm:px-6"><div><span className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-[#08749a]">Actividad</span><h2 className="font-display mt-1 text-2xl">Mods actualizados</h2></div><FileClock className="size-5 text-[#08749a]" /></div>
        <div className="divide-y divide-[#e1e9e7]">
          {data.recentMods.map((mod) => (
            <Link key={mod.id} href={`/admin/mods/${mod.id}`} className="flex items-center gap-4 px-5 py-4 transition hover:bg-[#f3f8f6] sm:px-6"><span className="font-display grid size-9 place-items-center bg-[#0a293d] text-[#8fd8e3]">M</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{mod.title}</strong><span className="text-xs text-[#7f9298]">Actualizado {formatDate(mod.updatedAt)}</span></span><StatusBadge status={mod.status} /></Link>
          ))}
        </div>
      </section>
    </div>
  );
}
