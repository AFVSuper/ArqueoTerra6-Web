import { describe, expect, it } from "vitest";
import type { SearchEntry } from "@/lib/content";
import { searchEntries } from "@/lib/search";

const entries: SearchEntry[] = [
  { id: "mod-1", kind: "mod", title: "Arsenal de las Mareas", subtitle: "Mod", description: "Aventura oceánica", href: "/mods/mareas", category: "Aventura", tags: ["Océano"], searchText: "Arsenal de las Mareas aventura oceánica tridente" },
  { id: "item-1", kind: "item", title: "Tridente abisal", subtitle: "Arsenal de las Mareas", description: "Arma submarina", href: "/items/tridente", category: "Aventura", tags: ["Combate"], searchText: "Tridente abisal Arsenal de las Mareas arma submarina combate" },
];

describe("searchEntries", () => {
  it("prioriza una coincidencia exacta de título", () => {
    expect(searchEntries(entries, "Tridente abisal")[0]?.id).toBe("item-1");
  });

  it("normaliza tildes y encuentra texto profundo", () => {
    expect(searchEntries(entries, "oceano").map((entry) => entry.id)).toContain("mod-1");
  });

  it("exige que estén presentes todos los términos", () => {
    expect(searchEntries(entries, "tridente inexistente")).toHaveLength(0);
  });
});
