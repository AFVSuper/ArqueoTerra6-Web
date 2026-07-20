import { CheckCircle2, CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import type { ContentStatus, RoleCode } from "@/lib/db/schema";
import { canPublishContent } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export const inputClassName =
  "min-h-11 w-full border border-[#cedbd8] bg-white px-3 py-2.5 text-sm font-semibold text-[#09202c] outline-none transition placeholder:font-normal placeholder:text-[#7f9298] focus:border-[#08749a] focus:ring-2 focus:ring-[#8fd8e3]/35";

export const textareaClassName = `${inputClassName} min-h-32 resize-y leading-6`;

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-[#d5dfdc] pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#08749a]">{eyebrow}</span>
        <h1 className="font-display mt-2 text-4xl leading-none text-[#09202c] sm:text-5xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-[#55707a]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-black uppercase tracking-[0.1em] text-[#294955]">
        {label}
        {hint ? <span className="normal-case tracking-normal text-[#7f9298]">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-[#d5dfdc] bg-white p-5 shadow-[0_10px_30px_rgba(3,30,45,.07)] sm:p-6">
      <h2 className="font-display text-2xl text-[#09202c]">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-6 text-[#6b8088]">{description}</p> : null}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.64rem] font-black uppercase tracking-[0.1em] ${status === "published" ? "bg-[#dff2e8] text-[#176544]" : "bg-[#fff0cf] text-[#835d16]"}`}>
      <span className={`size-1.5 rounded-full ${status === "published" ? "bg-[#2c9b69]" : "bg-[#d99b28]"}`} />
      {status === "published" ? "Publicado" : "Borrador"}
    </span>
  );
}

export function StatusField({ role, value }: { role: RoleCode; value: ContentStatus }) {
  if (!canPublishContent(role)) {
    return (
      <Field label="Estado" hint="Publica un revisor">
        <input type="hidden" name="status" value="draft" />
        <div className="flex min-h-11 items-center border border-[#e6d5aa] bg-[#fff8e8] px-3 text-sm font-bold text-[#835d16]">Se guardará como borrador</div>
      </Field>
    );
  }

  return (
    <Field label="Estado">
      <select name="status" defaultValue={value} className={inputClassName}>
        <option value="draft">Borrador</option>
        <option value="published">Publicado</option>
      </select>
    </Field>
  );
}

export function Notice({ type = "saved" }: { type?: "saved" | "deleted" | "uploaded" }) {
  const content = {
    saved: "Cambios guardados correctamente.",
    deleted: "El contenido se ha eliminado.",
    uploaded: "La imagen se ha subido a la biblioteca.",
  }[type];
  return (
    <div className="mb-5 flex items-center gap-3 border border-[#9ed5bd] bg-[#edf9f2] px-4 py-3 text-sm font-bold text-[#176544]">
      <CheckCircle2 className="size-5" /> {content}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 flex min-h-48 flex-col items-center justify-center border border-dashed border-[#bfcfcb] bg-white p-8 text-center text-sm text-[#6b8088]">
      <CircleAlert className="mb-3 size-7 text-[#08749a]" /> {children}
    </div>
  );
}
