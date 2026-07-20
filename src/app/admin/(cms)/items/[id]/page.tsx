import { notFound } from "next/navigation";
import { AdminPageHeader, Notice } from "@/components/admin/admin-ui";
import { ItemForm } from "@/components/admin/item-form";
import { getAdminItem, getItemOptions, getMediaOptions, getModOptions } from "@/lib/admin-data";
import { requireUser } from "@/lib/auth/session";

export default async function EditItemPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [item, user, mods, items, media] = await Promise.all([getAdminItem(Number(id)), requireUser(), getModOptions(), getItemOptions(), getMediaOptions()]);
  if (!item) notFound();
  return <div className="mx-auto max-w-5xl">{query.saved ? <Notice /> : null}<AdminPageHeader eyebrow="Editar objeto" title={item.name} description={`Ruta pública: /items/${item.slug}`} /><ItemForm item={item} role={user.role} mods={mods} items={items} media={media} /></div>;
}
