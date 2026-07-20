import { Compass, Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[65vh] place-items-center bg-[#0a293d] px-4 py-20 text-center text-white">
      <div>
        <Compass className="mx-auto size-12 text-[#8fd8e3]" />
        <span className="font-display mt-5 block text-7xl text-[#82d7ff]">404</span>
        <h1 className="font-display mt-3 text-4xl">Esta ruta no está en el mapa</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/55">Puede que la ficha siga en borrador, haya cambiado de nombre o todavía no exista.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 bg-[#82d7ff] px-5 py-3 font-black text-[#061723]"><Home className="size-4" /> Portada</Link>
          <Link href="/buscar" className="inline-flex items-center gap-2 border border-white/15 px-5 py-3 font-black"><Search className="size-4" /> Buscar</Link>
        </div>
      </div>
    </section>
  );
}
