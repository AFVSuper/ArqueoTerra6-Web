"use client";
/* eslint-disable @next/next/no-img-element */

import { ImageIcon, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { inputClassName } from "@/components/admin/admin-ui";

type MediaFieldProps = {
  name: string;
  value?: string | null;
  assets: { title: string; url: string }[];
  placeholder?: string;
};

export function MediaField({
  name,
  value = "",
  assets,
  placeholder = "/uploads/... o https://...",
}: MediaFieldProps) {
  const [selectedUrl, setSelectedUrl] = useState(value ?? "");

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          name={name}
          value={selectedUrl}
          onChange={(event) => setSelectedUrl(event.target.value)}
          className={inputClassName}
          placeholder={placeholder}
        />
        {selectedUrl ? (
          <button
            type="button"
            onClick={() => setSelectedUrl("")}
            className="grid size-11 shrink-0 place-items-center border border-[#cedbd8] text-[#55707a] hover:border-[#d05d43] hover:text-[#b23e25]"
            aria-label="Quitar imagen seleccionada"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {assets.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {assets.map((asset) => {
            const selected = asset.url === selectedUrl;
            return (
              <button
                key={asset.url}
                type="button"
                onClick={() => setSelectedUrl(asset.url)}
                className={cn(
                  "overflow-hidden border bg-white text-left transition hover:border-[#08749a]",
                  selected
                    ? "border-[#08749a] ring-2 ring-[#8fd8e3]"
                    : "border-[#d5dfdc]",
                )}
              >
                <img
                  src={asset.url}
                  alt=""
                  className="aspect-[16/10] w-full object-cover"
                />
                <span className="block truncate px-2 py-2 text-xs font-bold text-[#294955]">
                  {asset.title}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="flex items-center gap-2 text-xs text-[#6b8088]">
          <ImageIcon className="size-4" /> Aún no hay imágenes en la biblioteca.
        </p>
      )}
    </div>
  );
}
