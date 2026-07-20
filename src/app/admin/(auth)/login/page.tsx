import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { LogoMark } from "@/components/ui/logo-mark";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Acceso del staff" };

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin");
  const showLocalCredentials = process.env.NODE_ENV !== "production" && !process.env.ADMIN_PASSWORD;

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#061723] px-4 py-12 text-white">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(143,216,227,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(143,216,227,.13)_1px,transparent_1px)] [background-size:30px_30px]" />
      <div className="absolute -left-40 top-1/4 size-96 rounded-full bg-[#0f91b7]/20 blur-3xl" />
      <section className="relative w-full max-w-md border border-white/15 bg-[#0a293d]/90 p-7 shadow-[12px_12px_0_rgba(15,145,183,.22)] backdrop-blur sm:p-9">
        <div className="flex items-center gap-3"><LogoMark /><span className="font-display text-xl">Brújula Arcaica</span></div>
        <span className="mt-10 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-[#8fd8e3]"><ShieldCheck className="size-4" /> Acceso privado</span>
        <h1 className="font-display mt-3 text-4xl leading-none">Panel del staff</h1>
        <p className="mt-4 text-sm leading-6 text-white/50">Gestiona mods, objetos, recetas e información para jugadores.</p>
        <LoginForm />
      
      </section>
    </main>
  );
}
