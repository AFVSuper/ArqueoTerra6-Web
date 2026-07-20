import { AdminPageHeader, Notice } from "@/components/admin/admin-ui";
import { InstallationManager } from "@/components/admin/installation-manager";
import { getAdminInstallation } from "@/lib/admin-data";
import { requireUser } from "@/lib/auth/session";

export default async function AdminInstallationPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const [sections, user, query] = await Promise.all([getAdminInstallation(), requireUser(), searchParams]);
  return <div className="mx-auto max-w-5xl">{query.saved ? <Notice /> : null}{query.deleted ? <Notice type="deleted" /> : null}<AdminPageHeader eyebrow="Páginas informativas" title="Instalación" description="Ordena los pasos para preparar el modpack y entrar al servidor." /><InstallationManager sections={sections} role={user.role} /></div>;
}
