import { notFound } from "next/navigation";
import { AdminPageHeader, Notice } from "@/components/admin/admin-ui";
import { RecipeForm } from "@/components/admin/recipe-form";
import { getAdminRecipe, getItemOptions, getMediaOptions } from "@/lib/admin-data";
import { requireUser } from "@/lib/auth/session";

export default async function EditRecipePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [recipe, user, items, media] = await Promise.all([getAdminRecipe(Number(id)), requireUser(), getItemOptions(), getMediaOptions()]);
  if (!recipe) notFound();
  return <div className="mx-auto max-w-5xl">{query.saved ? <Notice /> : null}<AdminPageHeader eyebrow="Editar receta" title={recipe.outputName} description={recipe.title} /><RecipeForm recipe={recipe} role={user.role} items={items} media={media} /></div>;
}
