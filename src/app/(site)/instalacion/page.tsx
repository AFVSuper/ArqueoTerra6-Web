import type { Metadata } from "next";
import {
  CheckCircle2,
  Compass,
  Download,
  FileWarningIcon,
  Gauge,
  PackageOpen,
  Server,
  TriangleAlertIcon,
} from "lucide-react";
import { ServerAddress } from "@/components/site/server-address";
import { getPublishedInstallationSections } from "@/lib/content";

export const metadata: Metadata = {
  title: "Instalación",
  description: "Pasos para instalar el modpack y entrar al servidor.",
};

const icons = {
  download: Download,
  package: PackageOpen,
  gauge: Gauge,
  server: Server,
  compass: Compass,
};

export default async function InstallationPage() {
  const sections = await getPublishedInstallationSections();
  const address = process.env.NEXT_PUBLIC_SERVER_ADDRESS ?? "play.tuservidor.net";

  return (
    <>
      <section className="relative overflow-hidden bg-[#061723] py-16 text-white sm:py-24">
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_30%_50%,rgba(15,145,183,.32),transparent_28rem)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(143,216,227,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(143,216,227,.15)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="page-wrap relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#8fd8e3]"><Compass className="size-4" /> Punto de entrada</span>
            <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[0.88] tracking-[-0.04em] sm:text-7xl">Prepara tu partida. Cruza el portal.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60">Sigue los pasos en orden. El staff puede editar esta guía cuando cambie la versión, el launcher o el modpack.</p>
          </div>
          <ServerAddress address={address} />
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="page-wrap max-w-5xl">
          <div className="relative space-y-6 before:absolute before:bottom-12 before:left-[27px] before:top-12 before:w-px before:bg-[#8fd8e3] sm:before:left-[39px]">
            {sections.map((section, index) => {
              const Icon = icons[section.icon as keyof typeof icons] ?? Compass;
              return (
                <article key={section.id} className="relative grid gap-5 sm:grid-cols-[80px_1fr]">
                  <div className="relative z-10 grid size-14 place-items-center border-4 border-[#f3f8f6] bg-[#08749a] text-white shadow-[4px_4px_0_#09202c] sm:size-20">
                    <Icon className="size-6 sm:size-8" />
                  </div>
                  <div className="border border-[var(--line)] bg-white p-6 shadow-[0_14px_40px_var(--shadow)] sm:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-sm text-[var(--ocean)]">PASO {String(index + 1).padStart(2, "0")}</span>
                      <span className="h-px flex-1 bg-[var(--line)]" />
                    </div>
                    <h2 className="font-display mt-4 text-3xl leading-none sm:text-4xl">{section.title}</h2>
                    {section.intro ? <p className="mt-4 text-base font-extrabold text-[var(--ink)]">{section.intro}</p> : null}
                    {section.body ? <p className="text-prose mt-3 text-sm leading-7 text-[var(--muted)]">{section.body}</p> : null}
                    {section.steps.length ? (
                      <ol className="mt-6 grid gap-3">
                        {section.steps.map((step) => (
                          <li key={step} className="flex gap-3 border border-[var(--line)] bg-[#f3f8f6] p-3 text-sm font-bold leading-6">
                            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--ocean)]" /> {step}
                          </li>
                        ))}
                      </ol>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-12 border border-[#851515] bg-[#ffc4c4] p-4 text-sm leading-5 text-[var(--ink)] sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <TriangleAlertIcon className="size-8 shrink-0 text-[#851515]"/>
              <strong className="font-display block text-2xl text-[var(--ink)]">¿Algo no funciona?</strong>
            </div>
            <div className="mt-2">
              Comprueba primero que el perfil del launcher tenga la misma versión que el servidor. Si el problema continúa, comparte una captura completa del error con administración abriendo un ticket en Discord.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
