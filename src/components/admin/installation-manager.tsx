import { Field, inputClassName, StatusField, textareaClassName } from "@/components/admin/admin-ui";
import { ConfirmDeleteButton, SaveButton } from "@/components/admin/form-buttons";
import { deleteInstallationAction, saveInstallationAction } from "@/lib/admin-actions";
import type { installationSections, RoleCode } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { canDeleteContent } from "@/lib/permissions";
import { listToLines } from "@/lib/utils";

type InstallationSection = InferSelectModel<typeof installationSections>;

function InstallationForm({ section, role }: { section?: InstallationSection; role: RoleCode }) {
  return <div className="border border-[#d5dfdc] bg-white p-5 shadow-[0_8px_25px_rgba(3,30,45,.06)] sm:p-6"><form action={saveInstallationAction.bind(null, section?.id ?? null)} className="grid gap-4 sm:grid-cols-2"><Field label="Título" className="sm:col-span-2"><input name="title" required defaultValue={section?.title} className={inputClassName} /></Field><Field label="Introducción" className="sm:col-span-2"><input name="intro" defaultValue={section?.intro} className={inputClassName} /></Field><Field label="Explicación" className="sm:col-span-2"><textarea name="body" defaultValue={section?.body} className={textareaClassName} /></Field><Field label="Pasos" hint="Uno por línea" className="sm:col-span-2"><textarea name="steps" defaultValue={listToLines(section?.steps)} className={textareaClassName} /></Field><Field label="Icono"><select name="icon" defaultValue={section?.icon ?? "compass"} className={inputClassName}><option value="download">Descarga</option><option value="package">Paquete</option><option value="gauge">Rendimiento</option><option value="server">Servidor</option><option value="compass">Brújula</option></select></Field><Field label="Orden"><input name="sortOrder" type="number" defaultValue={section?.sortOrder ?? 0} className={inputClassName} /></Field><StatusField role={role} value={section?.status ?? "draft"} /><div className="flex items-end justify-end"><SaveButton label={section ? "Guardar sección" : "Añadir sección"} /></div></form>{section && canDeleteContent(role) ? <form action={deleteInstallationAction.bind(null, section.id)} className="mt-4 border-t border-[#e1e9e7] pt-4"><ConfirmDeleteButton /></form> : null}</div>;
}

export function InstallationManager({ sections, role }: { sections: InstallationSection[]; role: RoleCode }) {
  return <div className="mt-7 space-y-5"><InstallationForm role={role} />{sections.map((section) => <InstallationForm key={section.id} section={section} role={role} />)}</div>;
}
