"use client";

import { LoaderCircle, Save, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SaveButton({ label = "Guardar cambios" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#08749a] px-5 text-sm font-black text-white transition hover:bg-[#061723] disabled:cursor-wait disabled:opacity-60">
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
      {pending ? "Guardando..." : label}
    </button>
  );
}

export function ConfirmDeleteButton({ label = "Eliminar" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm("Esta acción no se puede deshacer. ¿Quieres continuar?")) {
          event.preventDefault();
        }
      }}
      className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#e4b7a5] px-4 text-sm font-black text-[#9c4429] transition hover:bg-[#fff0eb] disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      {pending ? "Eliminando..." : label}
    </button>
  );
}
