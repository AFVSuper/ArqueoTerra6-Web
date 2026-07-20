import Link from "next/link";
import { Field, FormSection, inputClassName, StatusField, textareaClassName } from "@/components/admin/admin-ui";
import { ConfirmDeleteButton, SaveButton } from "@/components/admin/form-buttons";
import { MediaField } from "@/components/admin/media-field";
import type { getAdminItem } from "@/lib/admin-data";
import { deleteItemAction, saveItemAction } from "@/lib/admin-actions";
import type { RoleCode } from "@/lib/db/schema";
import { canDeleteContent } from "@/lib/permissions";
import { listToLines, recordToStats } from "@/lib/utils";

type ItemValue = NonNullable<Awaited<ReturnType<typeof getAdminItem>>>;

export function ItemForm({ item, role, mods, items, media }: { item?: ItemValue; role: RoleCode; mods: { id: number; title: string }[]; items: { id: number; name: string; modTitle: string }[]; media: { title: string; url: string }[] }) {
  return (
    <div className="mt-7 space-y-5">
      <form action={saveItemAction.bind(null, item?.id ?? null)} className="space-y-5">
        <FormSection title="Identidad del objeto" description="Nombre, mod propietario y resumen para listados.">
          <Field label="Nombre" className="sm:col-span-2"><input name="name" required defaultValue={item?.name} className={inputClassName} placeholder="Tridente abisal" /></Field>
          <Field label="Mod"><select name="modId" required defaultValue={item?.modId} className={inputClassName}><option value="">Selecciona un mod</option>{mods.map((mod) => <option key={mod.id} value={mod.id}>{mod.title}</option>)}</select></Field>
          <Field label="Slug" hint="Automático si queda vacío"><input name="slug" defaultValue={item?.slug} className={inputClassName} placeholder="tridente-abisal" /></Field>
          <Field label="Resumen corto" className="sm:col-span-2"><textarea name="summary" required minLength={10} defaultValue={item?.summary} className={textareaClassName} /></Field>
          <Field label="Descripción completa" className="sm:col-span-2"><textarea name="description" required minLength={20} defaultValue={item?.description} className={`${textareaClassName} min-h-44`} /></Field>
          <Field label="Qué hace" className="sm:col-span-2"><textarea name="functionDescription" defaultValue={item?.functionDescription} className={textareaClassName} /></Field>
          <Field label="Requisitos" hint="Nivel, objeto previo, bioma, permisos o condiciones necesarias" className="sm:col-span-2"><textarea name="requirements" defaultValue={item?.requirements} className={textareaClassName} /></Field>
        </FormSection>

        <FormSection title="Datos de juego" description="Los campos vacíos se ocultan limpiamente en la ficha pública.">
          <Field label="Durabilidad" hint="Vacío si no aplica"><input name="durability" type="number" min="0" defaultValue={item?.durability ?? ""} className={inputClassName} /></Field>
          <Field label="Orden dentro del mod"><input name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} className={inputClassName} /></Field>
          <Field label="Stats" hint="Una por línea: Nombre: valor" className="sm:col-span-2"><textarea name="stats" defaultValue={recordToStats(item?.stats)} className={textareaClassName} placeholder="Daño: 11&#10;Velocidad: 1.1" /></Field>
          <Field label="Cómo conseguirlo" className="sm:col-span-2"><textarea name="howToObtain" defaultValue={item?.howToObtain} className={textareaClassName} /></Field>
          <Field label="Usos" className="sm:col-span-2"><textarea name="uses" defaultValue={item?.uses} className={textareaClassName} /></Field>
          <Field label="Consejos" className="sm:col-span-2"><textarea name="tips" defaultValue={item?.tips} className={textareaClassName} /></Field>
        </FormSection>

        <FormSection title="Relaciones e imágenes">
          <Field label="Imagen principal" hint="Esta es la imagen grande de la ficha pública del objeto." className="sm:col-span-2"><MediaField name="image" value={item?.image} assets={media} /></Field>
          <Field label="Galería" hint="Una URL por línea" className="sm:col-span-2"><textarea name="gallery" defaultValue={listToLines(item?.gallery)} className={textareaClassName} /></Field>
          <Field label="Etiquetas"><input name="tags" defaultValue={item?.tags.join(", ")} className={inputClassName} placeholder="Combate, Raro" /></Field>
          <StatusField role={role} value={item?.status ?? "draft"} />
          <Field label="Objetos relacionados" hint="Ctrl para elegir varios" className="sm:col-span-2"><select name="relatedItemIds" multiple size={6} defaultValue={item?.relatedItemIds.map(String)} className={inputClassName}>{items.filter((option) => option.id !== item?.id).map((option) => <option key={option.id} value={option.id}>{option.modTitle} · {option.name}</option>)}</select></Field>
        </FormSection>

        <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 border border-[#d5dfdc] bg-white/95 p-4 shadow-[0_10px_35px_rgba(3,30,45,.16)] backdrop-blur"><Link href="/admin/items" className="text-sm font-black text-[#55707a] hover:text-[#09202c]">Volver al listado</Link><SaveButton label={item ? "Guardar objeto" : "Crear objeto"} /></div>
      </form>
      {item && canDeleteContent(role) ? <section className="border border-[#e4b7a5] bg-[#fff9f6] p-5"><h2 className="font-display text-xl text-[#7c321e]">Zona de peligro</h2><p className="mt-2 text-sm text-[#8a6257]">También se eliminarán sus recetas.</p><form action={deleteItemAction.bind(null, item.id)} className="mt-4"><ConfirmDeleteButton label="Eliminar objeto" /></form></section> : null}
    </div>
  );
}
