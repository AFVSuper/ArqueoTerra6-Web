import { AdminPageHeader, Notice } from "@/components/admin/admin-ui";
import { FaqManager } from "@/components/admin/faq-manager";
import { getAdminFaq } from "@/lib/admin-data";
import { requireUser } from "@/lib/auth/session";

export default async function AdminFaqPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const [entries, user, query] = await Promise.all([getAdminFaq(), requireUser(), searchParams]);
  return <div className="mx-auto max-w-5xl">{query.saved ? <Notice /> : null}{query.deleted ? <Notice type="deleted" /> : null}<AdminPageHeader eyebrow="Páginas informativas" title="Preguntas frecuentes" description="Añade respuestas cortas y agrúpalas por categoría." /><FaqManager entries={entries} role={user.role} /></div>;
}
