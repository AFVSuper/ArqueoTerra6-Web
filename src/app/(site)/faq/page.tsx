import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { ChevronDown, LifeBuoy, MessageCircleQuestion } from "lucide-react";
import { getPublishedFaq } from "@/lib/content";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Respuestas sobre instalación, mods, rendimiento y uso de la guía.",
};

export default async function FaqPage() {
  const entries = await getPublishedFaq();
  const grouped = Map.groupBy(entries, (entry) => entry.category);

  return (
    <>
      <section className="relative overflow-hidden bg-[#061723] py-16 text-white sm:py-20">
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,145,183,.32),transparent_28rem)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(143,216,227,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(143,216,227,.15)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="page-wrap relative max-w-4xl text-center">
          <MessageCircleQuestion className="mx-auto size-9 text-[#8fd8e3]" />
          <h1 className="font-display mt-5 text-5xl leading-none sm:text-7xl">Preguntas del campamento</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/60">
            Lo esencial para entrar, resolver errores habituales y entender cómo se mantiene esta guía.
          </p>
        </div>
      </section>
      <section className="py-14 sm:py-20">
        <div className="page-wrap max-w-4xl space-y-12">
          {[...grouped.entries()].map(([category, categoryEntries]) => (
            <section key={category}>
              <div className="flex items-center gap-3 border-b border-[var(--line)] pb-4">
                <span className="grid size-9 place-items-center bg-[#dff2f0] text-[var(--ocean)]"><LifeBuoy className="size-4" /></span>
                <h2 className="font-display text-3xl">{category}</h2>
                <span className="ml-auto text-xs font-black text-[var(--muted)]">{categoryEntries.length}</span>
              </div>
              <div className="mt-4 space-y-3">
                {categoryEntries.map((entry) => (
                  <details key={entry.id} className="group border border-[var(--line)] bg-white shadow-[0_8px_25px_var(--shadow)] open:border-[#08749a]/40">
                    <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 font-extrabold sm:px-6">
                      <span className="font-display flex-1 text-xl leading-tight sm:text-2xl">{entry.question}</span>
                      <ChevronDown className="size-5 shrink-0 text-[var(--ocean)] transition group-open:rotate-180" />
                    </summary>
                    <div className="prose prose-sm max-w-none border-t border-[var(--line)] px-5 py-5 leading-7 text-[var(--muted)] sm:px-6">
                      <ReactMarkdown>{entry.answer}</ReactMarkdown>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
