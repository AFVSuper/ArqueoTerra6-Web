import { getStore } from "@netlify/blobs";

export async function GET(_: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const blob = await getStore("arqueoterra-media").get(key.join("/"), { type: "blob" });
  if (!blob) return new Response("Imagen no encontrada", { status: 404 });
  return new Response(blob, { headers: { "Cache-Control": "public, max-age=31536000, immutable" } });
}
