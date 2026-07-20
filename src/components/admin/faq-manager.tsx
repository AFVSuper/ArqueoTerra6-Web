import { Field, inputClassName, StatusField, textareaClassName } from "@/components/admin/admin-ui";
import { ConfirmDeleteButton, SaveButton } from "@/components/admin/form-buttons";
import { deleteFaqAction, saveFaqAction } from "@/lib/admin-actions";
import type { faqEntries } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import type { RoleCode } from "@/lib/db/schema";
import { canDeleteContent } from "@/lib/permissions";

type FaqEntry = InferSelectModel<typeof faqEntries>;

function FaqForm({ entry, role }: { entry?: FaqEntry; role: RoleCode }) {
  return (
    <div className="border border-[#d5dfdc] bg-white p-5 shadow-[0_8px_25px_rgba(3,30,45,.06)] sm:p-6">
      <form action={saveFaqAction.bind(null, entry?.id ?? null)} className="grid gap-4 sm:grid-cols-2">
        <Field label="Pregunta" className="sm:col-span-2"><input name="question" required defaultValue={entry?.question} className={inputClassName} placeholder="¿Necesito instalar todos los mods?" /></Field>
        <Field label="Respuesta (admite Markdown: **negrita**, listas con -, etc.)" className="sm:col-span-2"><textarea name="answer" required defaultValue={entry?.answer} className={textareaClassName} rows={6} /></Field>
        <Field label="Categoría"><input name="category" required defaultValue={entry?.category} className={inputClassName} placeholder="Instalación" /></Field>
        <Field label="Orden"><input name="sortOrder" type="number" defaultValue={entry?.sortOrder ?? 0} className={inputClassName} /></Field>
        <StatusField role={role} value={entry?.status ?? "draft"} />
        <div className="flex items-end justify-end"><SaveButton label={entry ? "Guardar pregunta" : "Añadir pregunta"} /></div>
      </form>
      {entry && canDeleteContent(role) ? <form action={deleteFaqAction.bind(null, entry.id)} className="mt-4 border-t border-[#e1e9e7] pt-4"><ConfirmDeleteButton /></form> : null}
    </div>
  );
}

export function FaqManager({ entries, role }: { entries: FaqEntry[]; role: RoleCode }) {
  return <div className="mt-7 space-y-5"><FaqForm role={role} />{entries.map((entry) => <FaqForm key={entry.id} entry={entry} role={role} />)}</div>;
}
