import type { Metadata } from "next";
import { ServerAddress } from "@/components/site/server-address";
import { getPublishedInstallationSections } from "@/lib/content";
import { Compass, Hammer, Newspaper, NewspaperIcon } from "lucide-react";
import { MediaFrame } from "@/components/ui/media-frame";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ArqueoNews",
  description: "Periódico de ArqueoTerra.",
};

export default async function RulesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#061723] py-16 text-white sm:py-24">
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_30%_50%,rgba(15,145,183,.32),transparent_28rem)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(143,216,227,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(143,216,227,.15)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="page-wrap relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#8fd8e3]"><NewspaperIcon className="size-4" /> ArqueoNews</span>
            <h1 className="font-display mt-5 max-w-4xl text-5xl leading-[0.88] tracking-[-0.04em] sm:text-7xl">Novedades del servidor, anuncios y matemáticas.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60">(Aunque nadie hace los problemas de matemáticas 😭)</p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="page-wrap">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><span className="eyebrow">Links de Archivos</span></div></div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <article key="hemeroteca" className="group grid gap-5 overflow-hidden border border-[var(--line)] bg-white shadow-[0_12px_35px_var(--shadow)] transition duration-300 hover:border-[#0f91b7]/50 hover:shadow-[5px_5px_0_#d5dfdc] sm:grid-cols-[140px_1fr]">
                    <MediaFrame
                      src="images/arqueoterra/main/sello_vi.png"
                      alt="Imagen de Hemeroteca"
                      className="aspect-square min-h-40 sm:min-h-full"
                      label="Imagen del objeto"
                      padded
                      gradient = "linear-gradient(135deg, #63d2f7, #0c304e)"
                    />
                    <Link key="hemeroteca" href="https://drive.google.com/drive/folders/1JGe1OoixkagBJrmUa4tBmoWyNIK9mqy6?usp=drive_link" className="group flex flex-col justify-center bg-white p-5 transition hover:border-[#08749a]/50 hover:shadow-[5px_5px_0_#d5dfdc]">
                      <strong className="font-display text-xl group-hover:text-[var(--ocean)]">Hemeroteca</strong>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--ink)]">Aquí se almacenan todos los periódicos</p>
                    </Link> </article>
          <article key="math" className="group grid gap-5 overflow-hidden border border-[var(--line)] bg-white shadow-[0_12px_35px_var(--shadow)] transition duration-300 hover:border-[#0f91b7]/50 hover:shadow-[5px_5px_0_#d5dfdc] sm:grid-cols-[140px_1fr]">
                    <MediaFrame
                      src="images/arqueoterra/main/math.png"
                      alt="Imagen de Matemáticas"
                      className="aspect-square min-h-40 sm:min-h-full"
                      label="Imagen del objeto"
                
                      gradient = "linear-gradient(135deg, #63d2f7, #0c304e)"
                    />
                    <Link key="math" href="https://drive.google.com/file/d/1fMZuNHn-AQQ0krpMzy2dLZzo8H5MnA_J/view?usp=sharing" className="group flex flex-col justify-center bg-white p-5 transition hover:border-[#08749a]/50 hover:shadow-[5px_5px_0_#d5dfdc]">
                      <strong className="font-display text-xl group-hover:text-[var(--ocean)]">Problemas</strong>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--ink)]">Colección de problemas de matemáticas. ¡Atrévete!</p>
                    </Link> </article>
          </div>  
        </div>
      </section>
    </>
  );
}
