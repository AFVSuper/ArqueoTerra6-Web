import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-10 shrink-0 place-items-center bg-[#0f91b7] shadow-[4px_4px_0_#04131d]",
        className,
      )}
    >
      <span className="absolute left-1 top-1 size-2 bg-[#8fd8e3]" />
      <span className="absolute bottom-1 right-1 size-2 bg-[#82d7ff]" />
      <span className="block size-4 rotate-45 border-4 border-white" />
    </span>
  );
}
