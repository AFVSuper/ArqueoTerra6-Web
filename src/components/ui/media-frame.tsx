/* eslint-disable @next/next/no-img-element */
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MediaFrameProps = {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
  label?: string;
  padded?: boolean;
  bgColor?: string; 
  gradient?: string;
};

export function MediaFrame({
  src,
  alt,
  className,
  priority = false,
  label = "Añade tu captura desde el CMS",
  padded = false,
  bgColor = "#2D89A9",
  gradient
}: MediaFrameProps) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", padded && "p-3", className)} style={{ background: gradient ?? bgColor, }}>
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="h-full w-full object-cover transition duration-500 hover:scale-[1.025]"
        />
      </div>
    );
  }

  return (
    <div
      aria-label={alt}
      className={cn(
        "relative isolate flex min-h-52 overflow-hidden bg-[#0a293d] text-white",
        className,
      )}
      role="img"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(143,216,227,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(143,216,227,.08)_1px,transparent_1px)] bg-[size:22px_22px]" />
      <div className="absolute inset-x-0 bottom-0 h-[62%] bg-[#08749a] [clip-path:polygon(0_62%,12%_48%,25%_57%,36%_30%,51%_44%,63%_15%,76%_38%,89%_20%,100%_34%,100%_100%,0_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[36%] bg-[#0f91b7] [clip-path:polygon(0_43%,15%_29%,31%_42%,48%_20%,65%_38%,82%_17%,100%_31%,100%_100%,0_100%)]" />
      <div className="relative z-10 m-auto flex max-w-56 flex-col items-center gap-3 p-6 text-center">
        <span className="grid size-11 place-items-center border border-white/25 bg-white/10 backdrop-blur">
          <ImageIcon className="size-5" />
        </span>
        <span className="text-sm font-bold text-[#e5f7f3]">{label}</span>
      </div>
    </div>
  );
}
