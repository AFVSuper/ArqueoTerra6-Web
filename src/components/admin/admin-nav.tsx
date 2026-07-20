"use client";

import {
  BookOpenCheck,
  Box,
  CircleHelp,
  ExternalLink,
  Hammer,
  Images,
  LayoutDashboard,
  Layers3,
  ListChecks,
  UserRound,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RoleCode } from "@/lib/db/schema";

const links = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/admin/perfil", label: "Mi perfil", icon: UserRound },
  { href: "/admin/mods", label: "Mods", icon: Layers3 },
  { href: "/admin/items", label: "Objetos", icon: Box },
  { href: "/admin/recetas", label: "Recetas", icon: Hammer },
  { href: "/admin/medios", label: "Medios", icon: Images },
  { href: "/admin/faq", label: "FAQ", icon: CircleHelp },
  { href: "/admin/instalacion", label: "Instalación", icon: ListChecks },
];

export function AdminNav({ role }: { role: RoleCode }) {
  const pathname = usePathname();
  const visibleLinks = role === "SUPERADMIN"
    ? [...links, { href: "/admin/usuarios", label: "Usuarios", icon: UsersRound }]
    : links;

  return (
    <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible lg:p-4" aria-label="Navegación del CMS">
      {visibleLinks.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link key={link.href} href={link.href} className={`flex shrink-0 items-center gap-3 px-3 py-2.5 text-sm font-extrabold transition lg:w-full ${active ? "bg-[#0f91b7] text-white shadow-[3px_3px_0_#8fd8e3]" : "text-white/55 hover:bg-white/8 hover:text-white"}`}>
            <link.icon className="size-4 shrink-0" /> {link.label}
          </Link>
        );
      })}
      <div className="mx-2 hidden h-px bg-white/10 lg:my-3 lg:block" />
      <Link href="/" target="_blank" className="flex shrink-0 items-center gap-3 px-3 py-2.5 text-sm font-extrabold text-white/55 transition hover:bg-white/8 hover:text-white lg:w-full">
        <ExternalLink className="size-4" /> Ver web pública
      </Link>
      <Link href="/admin/guia" className="hidden items-center gap-3 px-3 py-2.5 text-sm font-extrabold text-white/55 transition hover:bg-white/8 hover:text-white">
        <BookOpenCheck className="size-4" /> Ayuda editorial
      </Link>
    </nav>
  );
}
