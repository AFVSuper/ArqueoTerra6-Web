import Link from "next/link";
import { Field, FormSection, inputClassName, StatusField, textareaClassName } from "@/components/admin/admin-ui";
import { ConfirmDeleteButton, SaveButton } from "@/components/admin/form-buttons";
import { MediaField } from "@/components/admin/media-field";
import type { getAdminRecipe } from "@/lib/admin-data";
import { deleteRecipeAction, saveRecipeAction } from "@/lib/admin-actions";
import type { RoleCode } from "@/lib/db/schema";
import { canDeleteContent } from "@/lib/permissions";
import { recipeInputsToText } from "@/lib/utils";

type RecipeValue = NonNullable<Awaited<ReturnType<typeof getAdminRecipe>>>;

export function RecipeForm({ recipe, role, items, media }: { recipe?: RecipeValue; role: RoleCode; items: { id: number; name: string; modTitle: string }[]; media: { title: string; url: string }[] }) {
  return (
    <div className="mt-7 space-y-5">
      <form action={saveRecipeAction.bind(null, recipe?.id ?? null)} className="space-y-5">
        <FormSection title="Resultado" description="Qué fabrica la receta y a qué objeto pertenece.">
          <Field label="Objeto de la guía" className="sm:col-span-2"><select name="itemId" required defaultValue={recipe?.itemId} className={inputClassName}><option value="">Selecciona un objeto</option>{items.map((item) => <option key={item.id} value={item.id}>{item.modTitle} · {item.name}</option>)}</select></Field>
          <Field label="Título de la receta"><input name="title" required defaultValue={recipe?.title} className={inputClassName} placeholder="Ensamblaje del tridente" /></Field>
          <Field label="Estación"><input name="station" required defaultValue={recipe?.station} className={inputClassName} placeholder="Mesa de herrería" /></Field>
          <Field label="Nombre del resultado"><input name="outputName" required defaultValue={recipe?.outputName} className={inputClassName} /></Field>
          <Field label="Cantidad"><input name="outputQuantity" type="number" min="1" required defaultValue={recipe?.outputQuantity ?? 1} className={inputClassName} /></Field>
        </FormSection>
        <FormSection title="Ingredientes" description="Una línea por ingrediente usando el formato Nombre | cantidad.">
          <Field label="Lista de ingredientes" hint="Ej. Lingote de cobre | 4" className="sm:col-span-2"><textarea name="inputs" required defaultValue={recipeInputsToText(recipe?.inputs)} className={`${textareaClassName} min-h-48`} placeholder="Tridente | 1&#10;Escama prismática | 4" /></Field>
          <Field label="Notas" className="sm:col-span-2"><textarea name="notes" defaultValue={recipe?.notes} className={textareaClassName} placeholder="Condiciones especiales o forma de colocar los ingredientes." /></Field>
        </FormSection>
        <FormSection title="Presentación editorial" description="Esta imagen se ve junto a la receta; no cambia la imagen principal del objeto.">
          <Field label="Imagen de la receta" className="sm:col-span-2"><MediaField name="image" value={recipe?.image} assets={media} /></Field>
          <StatusField role={role} value={recipe?.status ?? "draft"} />
        </FormSection>
        <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 border border-[#d5dfdc] bg-white/95 p-4 shadow-[0_10px_35px_rgba(3,30,45,.16)] backdrop-blur"><Link href="/admin/recetas" className="text-sm font-black text-[#55707a]">Volver al listado</Link><SaveButton label={recipe ? "Guardar receta" : "Crear receta"} /></div>
      </form>
      {recipe && canDeleteContent(role) ? <section className="border border-[#e4b7a5] bg-[#fff9f6] p-5"><h2 className="font-display text-xl text-[#7c321e]">Zona de peligro</h2><form action={deleteRecipeAction.bind(null, recipe.id)} className="mt-4"><ConfirmDeleteButton label="Eliminar receta" /></form></section> : null}
    </div>
  );
}
