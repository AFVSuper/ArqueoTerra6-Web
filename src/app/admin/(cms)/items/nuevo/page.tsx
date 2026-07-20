import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ItemForm } from "@/components/admin/item-form";
import { getItemOptions, getMediaOptions, getModOptions } from "@/lib/admin-data";
import { requireUser } from "@/lib/auth/session";

export default async function NewItemPage() {
  const [user, mods, items, media] = await Promise.all([requireUser(), getModOptions(), getItemOptions(), getMediaOptions()]);
  return <div className="mx-auto max-w-5xl"><AdminPageHeader eyebrow="Nuevo contenido" title="Crear objeto" description="Puedes dejar durabilidad, recetas o imágenes vacías si no aplican." /><ItemForm role={user.role} mods={mods} items={items} media={media} /></div>;
}
