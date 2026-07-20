/* eslint-disable @next/next/no-img-element */
import { ArrowDown, Hammer, InfoIcon } from "lucide-react";
import type { RecipeInput } from "@/lib/utils";

type RecipeCardProps = {
  recipe: {
    id: number;
    title: string;
    station: string;
    inputs: RecipeInput[];
    outputName: string;
    outputQuantity: number;
    notes: string;
    image?: string | null;
  };
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="overflow-hidden border border-[var(--line)] bg-white shadow-[0_16px_40px_var(--shadow)]">
      <div className="flex items-center justify-between gap-4 bg-[#0a293d] px-5 py-4 text-white sm:px-6">
        <div>
          <span className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#8fd8e3]">Receta</span>
          <h3 className="font-display mt-1 text-2xl leading-none">{recipe.title}</h3>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 border border-white/15 bg-white/8 px-3 py-2 text-xs font-bold">
          <Hammer className="size-4 text-[#82d7ff]" /> {recipe.station}
        </span>
      </div>
      <div className="p-5 sm:p-6">
        {recipe.image ? (
          <img src={recipe.image} alt={`Crafteo de ${recipe.outputName}`} className="mb-0 max-h-96 w-full border border-[var(--line)] bg-[#f3f8f6] object-contain" />
        ) : null}
        {/* <div className="grid gap-3 sm:grid-cols-3">
          {recipe.inputs.map((input, index) => (
            <div key={`${input.name}-${index}`} className="flex min-h-20 items-center gap-3 border border-[var(--line)] bg-[#f3f8f6] p-3">
              <span className="font-display grid size-9 shrink-0 place-items-center bg-[#dff2f0] text-lg text-[var(--ocean)]">
                {input.quantity}
              </span>
              <span className="text-sm font-extrabold leading-tight">{input.name}</span>
            </div>
          ))}
        </div> */}
        {/* <ArrowDown className="mx-auto my-4 size-5 text-[var(--ocean)]" />
        <div className="flex items-center justify-between gap-4 border-2 border-[#08749a] bg-[#dff2f0] p-4">
          <span>
            <span className="block text-[0.62rem] font-black uppercase tracking-[0.15em] text-[var(--ocean)]">Resultado</span>
            <strong className="font-display mt-1 block text-xl">{recipe.outputName}</strong>
          </span>
          <span className="font-display text-3xl text-[var(--ocean)]">×{recipe.outputQuantity}</span>
        </div> */}
        {recipe.notes ? (
          // <p className="mt-4 border-l-0 border-[#82d7ff] pl-0 text-sm leading-6 text-[var(--muted)]">
            <div className="flex items-center pt-4">
              <InfoIcon className="size-5 color-[#82d7ff]"/>
              <div className="pl-2">{recipe.notes}</div>
            </div>
          // </p>
        ) : null}
      </div>
    </article>
  );
}
