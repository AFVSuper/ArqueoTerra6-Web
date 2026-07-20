"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/rules", label: "Reglamento" },
  { href: "/mods", label: "Guía" },
  { href: "/instalacion", label: "Instalación" },
  { href: "/faq", label: "FAQ" },
  { href: "/news", label: "ArqueoNews" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="grid size-11 place-items-center border border-white/15 bg-white/8 text-white"
        aria-expanded={open}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open ? (
        <div className="absolute inset-x-0 top-full border-t border-white/10 bg-[#061723] p-4 shadow-2xl">
          <nav className="page-wrap flex flex-col gap-2" aria-label="Navegación móvil">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`border px-4 py-3 font-bold ${pathname.startsWith(link.href) ? "border-[#8fd8e3]/50 bg-[#0f91b7]/15 text-[#8fd8e3]" : "border-white/10 text-white"}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/buscar"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 bg-[#82d7ff] px-4 py-3 font-black text-[#061723]"
            >
              <Search className="size-4" /> Buscar en la guía
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
