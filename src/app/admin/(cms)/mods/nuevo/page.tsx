import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ModForm } from "@/components/admin/mod-form";
import { getMediaOptions } from "@/lib/admin-data";
import { requireUser } from "@/lib/auth/session";

export default async function NewModPage() {
  const [user, media] = await Promise.all([requireUser(), getMediaOptions()]);
  return <div className="mx-auto max-w-5xl"><AdminPageHeader eyebrow="Nuevo contenido" title="Crear mod" description="Empieza en borrador y completa la guía a tu ritmo." /><ModForm role={user.role} media={media} /></div>;
}
