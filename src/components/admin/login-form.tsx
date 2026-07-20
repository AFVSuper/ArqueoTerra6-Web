"use client";

import { KeyRound, LoaderCircle, LogIn, UserRound } from "lucide-react";
import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = { error: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-white/55">Usuario</span>
        <span className="flex min-h-12 items-center gap-3 border border-white/15 bg-white/8 px-4 focus-within:border-[#8fd8e3]/70">
          <UserRound className="size-4 text-[#8fd8e3]" />
          <input name="username" autoComplete="username" required className="min-w-0 flex-1 bg-transparent py-3 text-white outline-none placeholder:text-white/25" placeholder="tu.usuario" />
        </span>
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-white/55">Contraseña</span>
        <span className="flex min-h-12 items-center gap-3 border border-white/15 bg-white/8 px-4 focus-within:border-[#8fd8e3]/70">
          <KeyRound className="size-4 text-[#8fd8e3]" />
          <input name="password" type="password" autoComplete="current-password" required minLength={8} className="min-w-0 flex-1 bg-transparent py-3 text-white outline-none placeholder:text-white/25" placeholder="••••••••••" />
        </span>
      </label>
      <p aria-live="polite" className={`min-h-6 text-sm font-bold ${state.error ? "text-[#f2a780]" : "text-transparent"}`}>
        {state.error || "Sin errores"}
      </p>
      <button type="submit" disabled={pending} className="flex min-h-13 w-full items-center justify-center gap-3 bg-[#82d7ff] px-5 font-black text-[#061723] transition hover:bg-white disabled:cursor-wait disabled:opacity-70">
        {pending ? <LoaderCircle className="size-5 animate-spin" /> : <LogIn className="size-5" />}
        {pending ? "Entrando..." : "Entrar al panel"}
      </button>
    </form>
  );
}
