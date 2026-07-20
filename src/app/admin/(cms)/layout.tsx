import { LogOut } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoMark } from "@/components/ui/logo-mark";
import { logoutAction } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/session";
import { roleLabel } from "@/lib/permissions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="min-h-screen bg-[#edf3f1] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="z-30 border-b border-white/10 bg-[#061723] text-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-[72px] items-center gap-3 border-b border-white/10 px-5"><LogoMark /><div><strong className="font-display block text-lg leading-none">Brújula Arcaica</strong><span className="mt-1 block text-[0.6rem] font-black uppercase tracking-[0.16em] text-[#8fd8e3]">Panel editorial</span></div></div>
        <AdminNav role={user.role} />
        <div className="border-t border-white/10 p-4 lg:absolute lg:inset-x-0 lg:bottom-0">
          <div className="flex items-center gap-3">
            <span className="font-display grid size-10 place-items-center bg-white/10 text-lg text-[#8fd8e3]">{user.name.charAt(0).toUpperCase()}</span>
            <span className="min-w-0 flex-1"><strong className="block truncate text-sm">{user.name}</strong><span className="block text-xs text-white/40">{roleLabel(user.role)}</span></span>
            <form action={logoutAction}>
              <button type="submit" title="Cerrar sesión" className="grid size-9 place-items-center text-white/45 transition hover:bg-white/10 hover:text-white"><LogOut className="size-4" /></button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 p-4 sm:p-7 lg:p-10">{children}</main>
    </div>
  );
}
