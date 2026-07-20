import { Search } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/ui/logo-mark";
import { MobileNav } from "./mobile-nav";
import { SearchShortcut } from "./search-shortcut";

const links = [
  { href: "/rules", label: "Reglamento" },
  { href: "/mods", label: "Guía" },
  { href: "/instalacion", label: "Instalación" },
  { href: "/faq", label: "FAQ" },
  { href: "/news", label: "ArqueoNews" },
];

export function SiteHeader() {
  const serverName = process.env.NEXT_PUBLIC_SERVER_NAME ?? "Brújula Arcaica";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#061723]/95 text-white backdrop-blur-xl">
      <SearchShortcut />
      <div className="page-wrap flex h-[74px] items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3" aria-label="Ir a la portada">
          <LogoMark className="transition-transform group-hover:-translate-y-0.5" />
          <span>
            <span className="font-display block text-lg leading-none tracking-wide">{serverName}</span>
            <span className="mt-1 block text-[0.62rem] font-black uppercase tracking-[0.2em] text-[#8fd8e3]">
              Guía del explorador
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Navegación principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-extrabold text-white/70 transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/buscar"
            className="flex min-h-10 items-center gap-2 border border-white/15 bg-white/8 px-4 text-sm font-extrabold transition hover:border-[#8fd8e3]/50 hover:bg-white/12"
          >
            <Search className="size-4 text-[#8fd8e3]" /> Buscar
            <kbd className="ml-2 border border-white/15 px-1.5 py-0.5 text-[0.6rem] text-white/45">/</kbd>
          </Link>
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}
