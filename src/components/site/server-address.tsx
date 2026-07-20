"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ServerAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copyAddress}
      className="group inline-flex min-h-12 items-center gap-3 border border-white/15 bg-white/8 px-4 text-left text-white transition hover:bg-white/14"
      aria-label={`Copiar dirección ${address}`}
    >
      <span className="size-2 bg-[#8fd8e3] shadow-[0_0_12px_#8fd8e3]" />
      <span>
        <span className="block text-[0.65rem] font-black uppercase tracking-[0.18em] text-[#8fd8e3]">
          Dirección del servidor
        </span>
        <span className="font-display text-base tracking-wide">{address}</span>
      </span>
      {copied ? (
        <Check className="ml-1 size-4 text-[#82d7ff]" />
      ) : (
        <Copy className="ml-1 size-4 text-white/55 transition group-hover:text-white" />
      )}
    </button>
  );
}
