import Link from "next/link";
import {
  Field,
  FormSection,
  inputClassName,
  StatusField,
  textareaClassName,
} from "@/components/admin/admin-ui";
import { ConfirmDeleteButton, SaveButton } from "@/components/admin/form-buttons";
import { MediaField } from "@/components/admin/media-field";
import type { getAdminMod } from "@/lib/admin-data";
import { deleteModAction, saveModAction } from "@/lib/admin-actions";
import type { RoleCode } from "@/lib/db/schema";
import { canDeleteContent } from "@/lib/permissions";
import { listToLines } from "@/lib/utils";

type ModValue = NonNullable<Awaited<ReturnType<typeof getAdminMod>>>;

export function ModForm({
  mod,
  role,
  media,
}: {
  mod?: ModValue;
  role: RoleCode;
  media: { title: string; url: string }[];
}) {
  const saveAction = saveModAction.bind(null, mod?.id ?? null);

  return (
    <div className="mt-7 space-y-5">
      <form action={saveAction} className="space-y-5">
        <FormSection title="Identidad" description="Lo primero que verá un jugador en el catálogo.">
          <Field label="Nombre del mod" className="sm:col-span-2"><input name="title" required minLength={2} defaultValue={mod?.title} className={inputClassName} placeholder="Ej. Arsenal de las Mareas" /></Field>
          <Field label="Slug" hint="Se completa solo si lo dejas vacío"><input name="slug" defaultValue={mod?.slug} className={inputClassName} placeholder="arsenal-de-las-mareas" /></Field>
          <Field label="Categoría"><input name="category" required defaultValue={mod?.category} className={inputClassName} placeholder="Aventura y combate" /></Field>
          <Field label="Resumen corto" hint="Una o dos frases" className="sm:col-span-2"><textarea name="shortDescription" required minLength={10} defaultValue={mod?.shortDescription} className={textareaClassName} /></Field>
          <Field label="Descripción completa" className="sm:col-span-2"><textarea name="fullDescription" required minLength={20} defaultValue={mod?.fullDescription} className={`${textareaClassName} min-h-44`} /></Field>
        </FormSection>

        <FormSection title="Guía de juego" description="Contexto, reglas y camino recomendado.">
          <Field label="Propósito en el servidor" className="sm:col-span-2"><textarea name="serverPurpose" defaultValue={mod?.serverPurpose} className={textareaClassName} /></Field>
          <Field label="Mecánicas principales" className="sm:col-span-2"><textarea name="mechanics" defaultValue={mod?.mechanics} className={textareaClassName} /></Field>
          <Field label="Progresión recomendada" className="sm:col-span-2"><textarea name="progression" defaultValue={mod?.progression} className={textareaClassName} /></Field>
          <Field label="Consejos del staff" className="sm:col-span-2"><textarea name="practicalNotes" defaultValue={mod?.practicalNotes} className={textareaClassName} /></Field>
        </FormSection>

        <FormSection title="Imágenes y clasificación" description="Elige una imagen de tu biblioteca o pega una URL externa.">
          <Field label="Imagen de portada" hint="Esta es la imagen grande de la ficha y tarjeta del mod." className="sm:col-span-2"><MediaField name="coverImage" value={mod?.coverImage} assets={media} /></Field>
          <Field label="Galería" hint="Una URL por línea" className="sm:col-span-2"><textarea name="gallery" defaultValue={listToLines(mod?.gallery)} className={textareaClassName} placeholder="/uploads/captura-1.webp&#10;/uploads/captura-2.webp" /></Field>
          <Field label="Etiquetas" hint="Separadas por coma"><input name="tags" defaultValue={mod?.tags.join(", ")} className={inputClassName} placeholder="Océano, Combate, Avanzado" /></Field>
          <Field label="Orden"><input name="sortOrder" type="number" defaultValue={mod?.sortOrder ?? 0} className={inputClassName} /></Field>
          <StatusField role={role} value={mod?.status ?? "draft"} />
          <label className="flex min-h-11 items-center gap-3 self-end border border-[#cedbd8] bg-[#f3f8f6] px-4 text-sm font-bold text-[#294955]"><input name="featured" type="checkbox" defaultChecked={mod?.featured} className="size-4 accent-[#08749a]" /> Destacar en portada</label>
        </FormSection>

        <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 border border-[#d5dfdc] bg-white/95 p-4 shadow-[0_10px_35px_rgba(3,30,45,.16)] backdrop-blur">
          <Link href="/admin/mods" className="text-sm font-black text-[#55707a] hover:text-[#09202c]">Volver al listado</Link>
          <SaveButton label={mod ? "Guardar mod" : "Crear mod"} />
        </div>
      </form>

      {mod && canDeleteContent(role) ? (
        <section className="border border-[#e4b7a5] bg-[#fff9f6] p-5">
          <h2 className="font-display text-xl text-[#7c321e]">Zona de peligro</h2>
          <p className="mt-2 text-sm text-[#8a6257]">Eliminar el mod también elimina sus objetos y recetas.</p>
          <form action={deleteModAction.bind(null, mod.id)} className="mt-4"><ConfirmDeleteButton label="Eliminar mod" /></form>
        </section>
      ) : null}
    </div>
  );
}
