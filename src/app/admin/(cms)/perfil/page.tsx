import { KeyRound, ShieldCheck, UserRound } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { PasswordForm } from "@/components/admin/password-form";
import { requireUser } from "@/lib/auth/session";
import { roleLabel } from "@/lib/permissions";

export default async function AdminProfilePage() {
  const user = await requireUser();
  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader eyebrow="Cuenta" title="Mi perfil" description="Revisa tu rol y cambia la contraseña de acceso al CMS." />
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <article className="border border-[#d5dfdc] bg-white p-6"><UserRound className="size-6 text-[#08749a]" /><span className="mt-5 block text-xs font-black uppercase tracking-[0.12em] text-[#7f9298]">Usuario</span><strong className="font-display mt-1 block text-2xl">{user.name}</strong><span className="text-sm text-[#55707a]">@{user.username}</span></article>
        <article className="border border-[#d5dfdc] bg-white p-6"><ShieldCheck className="size-6 text-[#08749a]" /><span className="mt-5 block text-xs font-black uppercase tracking-[0.12em] text-[#7f9298]">Rol actual</span><strong className="font-display mt-1 block text-2xl">{roleLabel(user.role)}</strong><span className="text-sm text-[#55707a]">Permisos aplicados en cada acción</span></article>
      </div>
      <section className="mt-5 border border-[#d5dfdc] bg-white p-6 shadow-[0_8px_25px_rgba(3,30,45,.06)] sm:p-8"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center bg-[#dff2f0] text-[#08749a]"><KeyRound className="size-5" /></span><div><h2 className="font-display text-2xl">Cambiar contraseña</h2><p className="text-xs text-[#6b8088]">Usa al menos 12 caracteres y evita reutilizar una clave.</p></div></div><PasswordForm /></section>
    </div>
  );
}
