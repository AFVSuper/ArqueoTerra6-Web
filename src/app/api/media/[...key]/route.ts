import { getStore } from "@netlify/blobs";

export const runtime = "nodejs";

const MEDIA_STORE = "arqueoterra-media";

const contentTypesByExtension: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

function inferContentType(key: string) {
  const extension = key.split(".").pop()?.toLowerCase() ?? "";
  return contentTypesByExtension[extension] ?? "application/octet-stream";
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params;
  const blobKey = key.map((segment) => decodeURIComponent(segment)).join("/");
  const entry = await getStore(MEDIA_STORE).getWithMetadata(blobKey, {
    type: "blob",
  });

  if (!entry) return new Response("Imagen no encontrada", { status: 404 });

  const metadataContentType =
    typeof entry.metadata?.contentType === "string"
      ? entry.metadata.contentType
      : null;
  const blobContentType =
    entry.data.type && entry.data.type !== "application/octet-stream"
      ? entry.data.type
      : null;
  const contentType = metadataContentType ?? blobContentType ?? inferContentType(blobKey);

  const headers = new Headers({
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  });

  if (entry.etag) headers.set("ETag", entry.etag);

  return new Response(entry.data, { headers });
}
