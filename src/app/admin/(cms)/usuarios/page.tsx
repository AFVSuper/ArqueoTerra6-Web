import { KeyRound, ShieldCheck, UserPlus, UsersRound } from "lucide-react";
import { redirect } from "next/navigation";
import { AdminPageHeader, Field, inputClassName, Notice } from "@/components/admin/admin-ui";
import { ConfirmDeleteButton, SaveButton } from "@/components/admin/form-buttons";
import { getAdminUsers, getRoleOptions } from "@/lib/admin-data";
import { createStaffUserAction, deleteStaffUserAction } from "@/lib/admin-actions";
import { requireUser } from "@/lib/auth/session";
import { roleLabel } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const currentUser = await requireUser();
  if (currentUser.role !== "SUPERADMIN") redirect("/admin");
  const [users, roles, query] = await Promise.all([getAdminUsers(), getRoleOptions(), searchParams]);
  return (
    <div className="mx-auto max-w-6xl">
      {query.saved ? <Notice /> : null}{query.deleted ? <Notice type="deleted" /> : null}
      <AdminPageHeader eyebrow="Seguridad" title="Usuarios del staff" description="No existe registro público. Solo un superadmin puede crear cuentas internas." />
      <section className="mt-7 border border-[#d5dfdc] bg-white p-6 shadow-[0_8px_25px_rgba(3,30,45,.06)]">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center bg-[#dff2f0] text-[#08749a]"><UserPlus className="size-5" /></span><div><h2 className="font-display text-2xl">Añadir miembro</h2><p className="text-xs text-[#6b8088]">La contraseña debe tener al menos 10 caracteres.</p></div></div>
        <form action={createStaffUserAction} className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Nombre"><input name="name" required className={inputClassName} /></Field><Field label="Usuario"><input name="username" required className={inputClassName} /></Field><Field label="Contraseña"><input name="password" type="password" minLength={10} required className={inputClassName} /></Field><Field label="Rol"><select name="role" className={inputClassName}>{roles.map((role) => <option key={role.id} value={role.code}>{role.name}</option>)}</select></Field><div className="sm:col-span-2 sm:justify-self-end"><SaveButton label="Crear cuenta" /></div></form>
      </section>
      <section className="mt-8"><div className="flex items-center gap-3"><UsersRound className="size-5 text-[#08749a]" /><h2 className="font-display text-3xl">Equipo actual</h2></div><div className="mt-5 grid gap-4 md:grid-cols-2">{users.map((user) => <article key={user.id} className="border border-[#d5dfdc] bg-white p-5"><div className="flex items-start gap-4"><span className="font-display grid size-11 shrink-0 place-items-center bg-[#0a293d] text-xl text-[#8fd8e3]">{user.name.charAt(0).toUpperCase()}</span><div className="min-w-0 flex-1"><strong className="block truncate">{user.name}</strong><span className="text-sm text-[#6b8088]">@{user.username}</span><div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-[#55707a]"><span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-[#08749a]" /> {roleLabel(user.role)}</span><span className="inline-flex items-center gap-1.5"><KeyRound className="size-3.5 text-[#08749a]" /> Desde {formatDate(user.createdAt)}</span></div></div></div>{user.id !== currentUser.id ? <form action={deleteStaffUserAction.bind(null, user.id)} className="mt-4 border-t border-[#e1e9e7] pt-4"><ConfirmDeleteButton label="Eliminar acceso" /></form> : <p className="mt-4 border-t border-[#e1e9e7] pt-4 text-xs font-bold text-[#176544]">Esta es tu sesión actual.</p>}</article>)}</div></section>
      <section className="mt-8 border border-[#d5dfdc] bg-[#f8fbfa] p-5"><h2 className="font-display text-xl">Matriz de permisos</h2><div className="mt-4 grid gap-3 text-sm text-[#55707a] sm:grid-cols-3"><p><strong className="block text-[#09202c]">Editor</strong>Crea, modifica y elimina borradores.</p><p><strong className="block text-[#09202c]">Revisor</strong>Edita y decide qué se publica.</p><p><strong className="block text-[#09202c]">Superadmin</strong>Control total y gestión de usuarios.</p></div></section>
    </div>
  );
}
