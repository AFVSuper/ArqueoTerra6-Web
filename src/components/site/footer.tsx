import Link from "next/link";
import { LogoMark } from "@/components/ui/logo-mark";
import { Pickaxe } from "lucide-react";

export function SiteFooter() {
  const serverName = process.env.NEXT_PUBLIC_SERVER_NAME ?? "Brújula Arcaica";

  return (
    <footer className="border-t border-white/10 bg-[#061723] py-12 text-white">
      <div className="page-wrap grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="font-display text-xl">{serverName}</span>
          </div>
          <p className="mt-5 text-sm leading-7 text-white/55">
            Una guía mantenida por el staff para que cada objeto nuevo tenga contexto, receta y una ruta clara de obtención.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-white/65">
        <Link href="/rules" className="hover:text-white">Reglamento</Link>
          <Link href="/mods" className="hover:text-white">Guía</Link>
          <Link href="/instalacion" className="hover:text-white">Instalación</Link>
          <Link href="/faq" className="hover:text-white">FAQ</Link>
          <Link href="/news" className="hover:text-white">ArqueoNews</Link>
          <Link href="https://linktr.ee/afvsuper" className="hover:text-white">AFVSuper</Link>
          <Link href="/admin/login" className="text-[#8fd8e3] hover:text-white"><Pickaxe className="" /></Link>
        </div>
      </div>
      <div className="page-wrap mt-10 border-t border-white/10 pt-6 text-xs text-white/35">
        Proyecto independiente. No afiliado con Mojang Studios.
      </div>
    </footer>
  );
}
