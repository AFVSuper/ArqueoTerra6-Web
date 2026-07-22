import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const databasePath = path.resolve(
  projectRoot,
  process.env.DATABASE_PATH || ".data/minecraft-guide.db",
);
const outputPath = path.resolve(
  projectRoot,
  process.argv[2] ||
    "netlify/database/migrations/202607220002_import_sqlite_content.sql",
);

if (!existsSync(databasePath)) {
  throw new Error(`No se encontró la base SQLite en ${databasePath}`);
}

const database = new DatabaseSync(databasePath, { readOnly: true });

const tableDefinitions = [
  {
    name: "roles",
    columns: ["id", "code", "name", "description"],
  },
  {
    name: "users",
    columns: [
      "id",
      "name",
      "username",
      "password_hash",
      "role_id",
      "created_at",
      "updated_at",
    ],
    timestamps: ["created_at", "updated_at"],
  },
  // Las sesiones se excluyen intencionadamente: las cookies antiguas no deben
  // seguir siendo válidas después de cambiar de base de datos y despliegue.
  {
    name: "mods",
    columns: [
      "id",
      "slug",
      "title",
      "short_description",
      "full_description",
      "server_purpose",
      "mechanics",
      "progression",
      "practical_notes",
      "category",
      "cover_image",
      "gallery",
      "featured",
      "status",
      "sort_order",
      "created_at",
      "updated_at",
    ],
    timestamps: ["created_at", "updated_at"],
    booleans: ["featured"],
  },
  {
    name: "items",
    columns: [
      "id",
      "mod_id",
      "slug",
      "name",
      "summary",
      "description",
      "function_description",
      "requirements",
      "durability",
      "stats",
      "how_to_obtain",
      "uses",
      "tips",
      "image",
      "gallery",
      "status",
      "sort_order",
      "created_at",
      "updated_at",
    ],
    timestamps: ["created_at", "updated_at"],
  },
  {
    name: "crafting_recipes",
    columns: [
      "id",
      "item_id",
      "title",
      "station",
      "inputs",
      "output_name",
      "output_quantity",
      "notes",
      "image",
      "status",
      "created_at",
      "updated_at",
    ],
    timestamps: ["created_at", "updated_at"],
  },
  {
    name: "tags",
    columns: ["id", "slug", "name"],
  },
  {
    name: "mod_tags",
    columns: ["mod_id", "tag_id"],
  },
  {
    name: "item_tags",
    columns: ["item_id", "tag_id"],
  },
  {
    name: "item_relations",
    columns: ["item_id", "related_item_id"],
  },
  {
    name: "faq_entries",
    columns: [
      "id",
      "question",
      "answer",
      "category",
      "status",
      "sort_order",
      "created_at",
      "updated_at",
    ],
    timestamps: ["created_at", "updated_at"],
  },
  {
    name: "installation_sections",
    columns: [
      "id",
      "title",
      "intro",
      "body",
      "steps",
      "icon",
      "status",
      "sort_order",
      "created_at",
      "updated_at",
    ],
    timestamps: ["created_at", "updated_at"],
  },
  {
    name: "media_assets",
    columns: [
      "id",
      "title",
      "url",
      "alt_text",
      "source_type",
      "mime_type",
      "created_by_id",
      "created_at",
    ],
    timestamps: ["created_at"],
    filter(row) {
      if (!String(row.url).startsWith("/uploads/")) return true;
      const localFile = path.join(projectRoot, "public", String(row.url));
      return existsSync(localFile);
    },
  },
];

const serialTables = [
  "roles",
  "users",
  "sessions",
  "mods",
  "items",
  "crafting_recipes",
  "tags",
  "faq_entries",
  "installation_sections",
  "media_assets",
];

function quoteIdentifier(identifier) {
  return `"${String(identifier).replaceAll('"', '""')}"`;
}

function quoteText(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlValue(value, column, definition) {
  if (value === null || value === undefined) return "NULL";
  if (definition.timestamps?.includes(column)) {
    return `to_timestamp(${Number(value)} / 1000.0)`;
  }
  if (definition.booleans?.includes(column)) {
    return Number(value) ? "TRUE" : "FALSE";
  }
  if (typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }
  return quoteText(value);
}

const output = [
  "-- Generado desde .data/minecraft-guide.db.",
  "-- No se importan sesiones antiguas ni registros de uploads cuyo archivo ya no existe.",
  "BEGIN;",
  "",
];

for (const definition of tableDefinitions) {
  const rows = database
    .prepare(`SELECT ${definition.columns.map(quoteIdentifier).join(", ")} FROM ${quoteIdentifier(definition.name)}`)
    .all()
    .filter((row) => definition.filter?.(row) ?? true);

  if (rows.length === 0) {
    output.push(`-- ${definition.name}: sin filas para importar.`, "");
    continue;
  }

  output.push(
    `INSERT INTO ${quoteIdentifier(definition.name)} (${definition.columns
      .map(quoteIdentifier)
      .join(", ")}) VALUES`,
  );

  rows.forEach((row, index) => {
    const values = definition.columns.map((column) =>
      sqlValue(row[column], column, definition),
    );
    const suffix = index === rows.length - 1 ? "" : ",";
    output.push(`(${values.join(", ")})${suffix}`);
  });

  output.push("ON CONFLICT DO NOTHING;", "");
}

for (const table of serialTables) {
  output.push(
    `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM ${quoteIdentifier(table)};`,
  );
}

output.push("", "COMMIT;", "");
mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, output.join("\n"), "utf8");
database.close();
console.log(`Migración PostgreSQL creada en ${outputPath}`);
