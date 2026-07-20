"use client";

import { CheckCircle2, KeyRound, LoaderCircle } from "lucide-react";
import { useActionState } from "react";
import { changePasswordAction, type PasswordState } from "@/lib/auth/actions";

const initialState: PasswordState = { error: "", success: "" };
const fieldClass = "min-h-11 w-full border border-[#cedbd8] bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#08749a] focus:ring-2 focus:ring-[#8fd8e3]/35";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, initialState);
  return (
    <form action={action} className="mt-6 grid gap-5">
      <label><span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-[#294955]">Contraseña actual</span><input name="currentPassword" type="password" autoComplete="current-password" required className={fieldClass} /></label>
      <label><span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-[#294955]">Nueva contraseña</span><input name="newPassword" type="password" autoComplete="new-password" minLength={12} required className={fieldClass} /></label>
      <label><span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-[#294955]">Repite la nueva contraseña</span><input name="confirmation" type="password" autoComplete="new-password" minLength={12} required className={fieldClass} /></label>
      {state.error ? <p aria-live="polite" className="text-sm font-bold text-[#9c4429]">{state.error}</p> : null}
      {state.success ? <p aria-live="polite" className="flex items-center gap-2 text-sm font-bold text-[#176544]"><CheckCircle2 className="size-4" /> {state.success}</p> : null}
      <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#08749a] px-5 text-sm font-black text-white transition hover:bg-[#061723] disabled:opacity-60">{pending ? <LoaderCircle className="size-4 animate-spin" /> : <KeyRound className="size-4" />}{pending ? "Actualizando..." : "Cambiar contraseña"}</button>
    </form>
  );
}
