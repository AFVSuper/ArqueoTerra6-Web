import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function linesToList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function listToLines(value: string | null | undefined) {
  return safeJsonParse<string[]>(value, []).join("\n");
}

export function statsToRecord(value: FormDataEntryValue | null) {
  const entries = linesToList(value)
    .map((line) => line.split(":"))
    .map(([key, ...rest]) => [key?.trim(), rest.join(":").trim()] as const)
    .filter(([key, statValue]) => key && statValue);

  return Object.fromEntries(entries);
}

export function recordToStats(value: string | null | undefined) {
  const record = safeJsonParse<Record<string, string>>(value, {});
  return Object.entries(record)
    .map(([key, statValue]) => `${key}: ${statValue}`)
    .join("\n");
}

export type RecipeInput = { name: string; quantity: number };

export function recipeInputsFromText(value: FormDataEntryValue | null) {
  return linesToList(value).map((line) => {
    const [name, quantity] = line.split("|").map((part) => part.trim());
    return { name, quantity: Math.max(1, Number(quantity) || 1) };
  });
}

export function recipeInputsToText(value: string | null | undefined) {
  return safeJsonParse<RecipeInput[]>(value, [])
    .map((input) => `${input.name} | ${input.quantity}`)
    .join("\n");
}

export function formatDate(value: Date | number | null | undefined) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value instanceof Date ? value : new Date(value));
}
