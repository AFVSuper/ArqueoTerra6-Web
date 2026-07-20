import type { Metadata } from "next";
import { ServerAddress } from "@/components/site/server-address";
import { getPublishedInstallationSections } from "@/lib/content";
import { Compass, Hammer } from "lucide-react";

export const metadata: Metadata = {
  title: "Reglamento",
  description: "Reglas del servidor.",
};

export default async function RulesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#061723] py-16 text-white sm:py-24">
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_30%_50%,rgba(15,145,183,.32),transparent_28rem)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(143,216,227,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(143,216,227,.15)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="page-wrap relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#8fd8e3]"><Hammer className="size-4" /> Reglamento del Servidor</span>
            <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[0.88] tracking-[-0.04em] sm:text-7xl">Por una convivencia agradable para todos.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60">Lee atentamente las normas, pues podemos ser muy estrictos con ellas.</p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <iframe
            src="https://drive.google.com/file/d/1fLqcf_rXr4wFlsCaKH9TxA1pSpa9EMpQ/preview"
            className="h-[900px] w-full rounded-xl border border-[var(--line)]"
            allow="autoplay"
          />
        </div>
      </section>
    </>
  );
}
