import type { Metadata } from "next";
import { Nunito_Sans, Pixelify_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const bodyFont = Nunito_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// const displayFont = Pixelify_Sans({
//   variable: "--font-display",
//   subsets: ["latin"],
//   display: "swap",
// });

const displayFont = localFont({
  src: "./fonts/MINECRAFTREGULAR-BMG3-2.otf",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: `${process.env.NEXT_PUBLIC_SERVER_NAME ?? "Brújula Arcaica"} | Guía del servidor`,
    template: `%s | ${process.env.NEXT_PUBLIC_SERVER_NAME ?? "Brújula Arcaica"}`,
  },
  description:
    "Guía en español de mods, objetos, recetas y acceso al servidor de Minecraft.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
