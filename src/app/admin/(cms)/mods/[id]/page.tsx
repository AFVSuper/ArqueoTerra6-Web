import { notFound } from "next/navigation";
import { AdminPageHeader, Notice } from "@/components/admin/admin-ui";
import { ModForm } from "@/components/admin/mod-form";
import { getAdminMod, getMediaOptions } from "@/lib/admin-data";
import { requireUser } from "@/lib/auth/session";

export default async function EditModPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [mod, user, media] = await Promise.all([getAdminMod(Number(id)), requireUser(), getMediaOptions()]);
  if (!mod) notFound();
  return <div className="mx-auto max-w-5xl">{query.saved ? <Notice /> : null}<AdminPageHeader eyebrow="Editar mod" title={mod.title} description={`Ruta pública: /mods/${mod.slug}`} /><ModForm mod={mod} role={user.role} media={media} /></div>;
}
