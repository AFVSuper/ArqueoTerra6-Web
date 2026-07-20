/* eslint-disable @next/next/no-img-element */
import { ExternalLink, ImagePlus, Link2, Upload } from "lucide-react";
import { AdminPageHeader, Field, inputClassName, Notice } from "@/components/admin/admin-ui";
import { ConfirmDeleteButton, SaveButton } from "@/components/admin/form-buttons";
import { getAdminMedia } from "@/lib/admin-data";
import { addExternalMediaAction, deleteMediaAction } from "@/lib/admin-actions";
import { requireUser } from "@/lib/auth/session";
import { canDeleteContent } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";

export default async function AdminMediaPage({ searchParams }: { searchParams: Promise<{ saved?: string; uploaded?: string; deleted?: string }> }) {
  const [assets, user, query] = await Promise.all([getAdminMedia(), requireUser(), searchParams]);
  return (
    <div className="mx-auto max-w-6xl">
      {query.saved ? <Notice /> : null}{query.uploaded ? <Notice type="uploaded" /> : null}{query.deleted ? <Notice type="deleted" /> : null}
      <AdminPageHeader eyebrow="Biblioteca" title="Medios" description="Sube capturas al servidor o registra imágenes alojadas en otra web." />
      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <section className="border border-[#d5dfdc] bg-white p-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center bg-[#dff2f0] text-[#08749a]"><Upload className="size-5" /></span><div><h2 className="font-display text-2xl">Subir archivo</h2><p className="text-xs text-[#6b8088]">JPG, PNG, WebP o GIF · máximo 8 MB</p></div></div><form method="post" action="/api/admin/media" encType="multipart/form-data" className="mt-6 grid gap-4"><Field label="Título"><input name="title" required className={inputClassName} placeholder="Puerto al amanecer" /></Field><Field label="Texto alternativo"><input name="altText" required className={inputClassName} placeholder="Vista del puerto del servidor" /></Field><Field label="Archivo"><input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required className={`${inputClassName} file:mr-3 file:border-0 file:bg-[#dff2f0] file:px-3 file:py-1 file:font-bold file:text-[#08749a]`} /></Field><button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#08749a] px-5 text-sm font-black text-white"><ImagePlus className="size-4" /> Subir imagen</button></form></section>
        <section className="border border-[#d5dfdc] bg-white p-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center bg-[#fff0cf] text-[#835d16]"><Link2 className="size-5" /></span><div><h2 className="font-display text-2xl">Añadir URL externa</h2><p className="text-xs text-[#6b8088]">La imagen seguirá alojada fuera de esta web</p></div></div><form action={addExternalMediaAction} className="mt-6 grid gap-4"><Field label="Título"><input name="title" required className={inputClassName} /></Field><Field label="URL"><input name="url" type="url" required className={inputClassName} placeholder="https://..." /></Field><Field label="Texto alternativo"><input name="altText" required className={inputClassName} /></Field><SaveButton label="Registrar imagen" /></form></section>
      </div>
      <div className="mt-9 flex items-end justify-between"><div><span className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-[#08749a]">Biblioteca actual</span><h2 className="font-display mt-1 text-3xl">{assets.length} imágenes</h2></div></div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => <article key={asset.id} className="overflow-hidden border border-[#d5dfdc] bg-white shadow-[0_8px_25px_rgba(3,30,45,.06)]"><div className="aspect-[16/10] bg-[#0a293d]"><img src={asset.url} alt={asset.altText} className="h-full w-full object-cover" /></div><div className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><strong className="block truncate">{asset.title}</strong><span className="text-xs text-[#7f9298]">{asset.sourceType === "upload" ? "Archivo local" : "URL externa"} · {formatDate(asset.createdAt)}</span></div><a href={asset.url} target="_blank" rel="noreferrer" className="grid size-8 shrink-0 place-items-center border border-[#d5dfdc] text-[#08749a]"><ExternalLink className="size-4" /></a></div><code className="mt-3 block truncate border border-[#e1e9e7] bg-[#f3f8f6] px-2 py-2 text-[0.68rem] text-[#55707a]">{asset.url}</code>{canDeleteContent(user.role) ? <form action={deleteMediaAction.bind(null, asset.id)} className="mt-4"><ConfirmDeleteButton /></form> : null}</div></article>)}
      </div>
    </div>
  );
}
