import { AdminPageHeader } from "@/components/admin/admin-ui";
import { RecipeForm } from "@/components/admin/recipe-form";
import { getItemOptions, getMediaOptions } from "@/lib/admin-data";
import { requireUser } from "@/lib/auth/session";

export default async function NewRecipePage() {
  const [user, items, media] = await Promise.all([requireUser(), getItemOptions(), getMediaOptions()]);
  return <div className="mx-auto max-w-5xl"><AdminPageHeader eyebrow="Nuevo contenido" title="Crear receta" description="Asocia la receta a un objeto y define sus ingredientes sin editar JSON." /><RecipeForm role={user.role} items={items} media={media} /></div>;
}
