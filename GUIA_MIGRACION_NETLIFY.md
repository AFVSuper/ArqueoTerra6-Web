# Guía completa: migrar este CMS de SQLite a Netlify

Esta guía explica exactamente qué se cambió, por qué y cómo repetirlo desde cero en otra copia del proyecto.

---

## 0. Qué problema estamos resolviendo

El proyecto original guarda estado en dos lugares locales:

1. `.data/minecraft-guide.db`: base SQLite.
2. `public/uploads`: imágenes subidas desde el CMS.

Eso funciona en un servidor con disco persistente, pero no debe utilizarse como almacenamiento permanente dentro de una aplicación serverless. En Netlify el código desplegado se reconstruye desde GitHub y las funciones no comparten un disco local permanente.

La solución utilizada es:

- **SQLite → PostgreSQL con Netlify Database.**
- **`public/uploads` → Netlify Blobs.**
- **Contenido inicial → migraciones SQL versionadas en GitHub.**

---

## 1. Haz una copia de seguridad

Antes de tocar nada, conserva:

```text
.data/minecraft-guide.db
public/uploads/
```

No borres la base SQLite hasta verificar que el contenido aparece en Netlify.

También crea una rama Git separada:

```powershell
git checkout -b migracion-netlify
```

---

## 2. Localiza todo lo que depende del disco local

Busca estas expresiones en el proyecto:

```powershell
Get-ChildItem -Recurse -File | Select-String -Pattern "better-sqlite3|sqliteTable|DATABASE_PATH|public/uploads|writeFile|unlink|\.data"
```

En este proyecto aparecían principalmente en:

```text
src/lib/db/database.ts
src/lib/db/schema.ts
src/app/api/admin/media/route.ts
src/lib/admin-actions.ts
drizzle.config.ts
package.json
next.config.ts
.env.example
README.md
```

No basta con cambiar una sola ruta: base, esquema, uploads, borrado, scripts y documentación deben apuntar a la nueva arquitectura.

---

## 3. Cambia las dependencias

Elimina SQLite del runtime:

```powershell
npm uninstall better-sqlite3 @types/better-sqlite3
```

Añade PostgreSQL y los servicios de Netlify:

```powershell
npm install @netlify/database @netlify/blobs pg
npm install -D @types/pg netlify-cli
```

Elimina estos scripts de `package.json`:

```json
"predev": "npm run db:seed",
"prebuild": "npm run db:seed"
```

No debes sembrar o modificar producción automáticamente durante cada build.

Añade:

```json
"netlify:dev": "netlify dev"
```

En este proyecto también se añadió:

```json
"db:export-sqlite": "node scripts/export-sqlite-to-postgres.mjs"
```

---

## 4. Convierte el esquema Drizzle de SQLite a PostgreSQL

### Antes

```ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
```

### Después

```ts
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
```

Cambios fundamentales:

| SQLite | PostgreSQL |
|---|---|
| `sqliteTable` | `pgTable` |
| `integer(...).primaryKey({ autoIncrement: true })` | `serial(...).primaryKey()` |
| fecha como entero en milisegundos | `timestamp(..., { withTimezone: true })` |
| booleano guardado como `0/1` | `boolean()` |

Mantén exactamente los nombres SQL existentes (`created_at`, `role_id`, etc.) para que la migración de datos coincida.

Archivo resultante:

```text
src/lib/db/schema.ts
```

---

## 5. Sustituye la conexión SQLite por PostgreSQL

El archivo `src/lib/db/database.ts` ya no debe:

- crear `.data`;
- abrir `better-sqlite3`;
- ejecutar `CREATE TABLE` al arrancar;
- activar WAL.

Ahora obtiene la conexión proporcionada por Netlify Database y crea un pool PostgreSQL:

```ts
import { getConnectionString } from "@netlify/database";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
```

La lógica usada es:

1. Si existe `DATABASE_URL`, la utiliza. Esto permite conectar otro PostgreSQL manualmente.
2. En Netlify, utiliza `getConnectionString()`.
3. Guarda el pool en `globalThis` para no abrir conexiones nuevas con cada recarga en desarrollo.

No configures `DATABASE_URL` manualmente en Netlify si utilizas Netlify Database; la plataforma proporciona la conexión.

---

## 6. Crea la migración del esquema

Netlify aplica automáticamente los SQL dentro de:

```text
netlify/database/migrations/
```

Este proyecto contiene:

```text
202607220001_create_schema.sql
```

Ese archivo crea:

- roles;
- usuarios;
- sesiones;
- mods;
- objetos;
- recetas;
- etiquetas;
- relaciones;
- FAQ;
- instalación;
- biblioteca de medios.

Para un cambio futuro crea una migración nueva; no edites una migración que ya fue aplicada:

```powershell
npx netlify database migrations new --description "add nueva columna"
```

Después escribe un `ALTER TABLE`, actualiza `src/lib/db/schema.ts` y prueba primero en local o en un Deploy Preview.

---

## 7. Exporta el contenido de SQLite a PostgreSQL

El script incluido lee:

```text
.data/minecraft-guide.db
```

Y genera:

```text
netlify/database/migrations/202607220002_import_sqlite_content.sql
```

Ejecuta:

```powershell
npm run db:export-sqlite
```

El script:

- conserva IDs;
- convierte milisegundos SQLite a `TIMESTAMPTZ`;
- convierte `0/1` a booleanos;
- escapa comillas correctamente;
- importa relaciones en el orden correcto;
- ajusta las secuencias `SERIAL` al ID máximo;
- no duplica filas gracias a `ON CONFLICT DO NOTHING`;
- no importa sesiones antiguas;
- omite registros `/uploads/...` cuyo archivo ya no existe.

### Por qué no importar sesiones

Una sesión antigua está vinculada a una cookie y al entorno anterior. Importarla no aporta nada y puede mantener accesos que deberían expirar al cambiar de infraestructura. Los usuarios sí se importan; las sesiones, no.

### Importante

La migración de datos es para crear una base nueva a partir de la copia SQLite. No regeneres y vuelvas a aplicar otra importación completa sobre una producción que ya contiene cambios nuevos del CMS.

---

## 8. Migra las imágenes nuevas a Netlify Blobs

### Antes

La ruta de subida hacía:

```ts
mkdir(...)
writeFile(...)
```

Y guardaba:

```text
/uploads/2026-07/imagen.jpg
```

### Después

La ruta:

```text
src/app/api/admin/media/route.ts
```

abre el store:

```text
arqueoterra-media
```

Y guarda el archivo con una clave como:

```text
uploads/2026-07/imagen-a1b2c3d4.jpg
```

También guarda metadatos:

- `contentType`;
- título;
- texto alternativo.

La URL guardada en PostgreSQL queda así:

```text
/api/media/uploads/2026-07/imagen-a1b2c3d4.jpg
```

---

## 9. Añade una ruta para servir los Blobs

Archivo:

```text
src/app/api/media/[...key]/route.ts
```

Esa ruta:

1. recibe la clave;
2. busca el Blob;
3. recupera sus metadatos;
4. devuelve el `Content-Type` correcto;
5. añade caché de larga duración.

Sin esta ruta, guardarías la imagen pero el navegador no tendría una URL pública de tu aplicación para mostrarla.

---

## 10. Cambia el borrado de imágenes

En `src/lib/admin-actions.ts` elimina:

```ts
unlink(...)
```

Y utiliza:

```ts
getStore(...).delete(key)
```

Solo se elimina del store cuando la URL empieza por:

```text
/api/media/
```

Las imágenes estáticas versionadas en `public/images` no se borran del repositorio desde el CMS.

---

## 11. Qué hacer con uploads antiguos reales

En esta copia no existe el archivo asociado al registro de prueba `/uploads/2026-07/test-e44f4f69.jpg`, por eso se excluyó.

Cuando repitas la migración y sí tengas archivos reales dentro de `public/uploads`, haz esto después de enlazar el proyecto con Netlify:

```powershell
npx netlify blobs:set arqueoterra-media "uploads/2026-07/mi-imagen.jpg" --input ".\public\uploads\2026-07\mi-imagen.jpg"
```

Después cambia en la base la URL:

```text
/uploads/2026-07/mi-imagen.jpg
```

por:

```text
/api/media/uploads/2026-07/mi-imagen.jpg
```

Puedes entrar al SQL interactivo con:

```powershell
npx netlify database connect
```

Ejemplo de actualización:

```sql
UPDATE media_assets
SET url = '/api/media/uploads/2026-07/mi-imagen.jpg'
WHERE url = '/uploads/2026-07/mi-imagen.jpg';
```

Repite el proceso por cada upload antiguo. Las imágenes oficiales que ya están en `public/images` no necesitan pasar a Blobs.

---

## 12. Evita consultas a la base durante un build sin contexto

El contenido público se obtiene en tiempo de ejecución, por eso el layout público incluye:

```ts
export const dynamic = "force-dynamic";
```

El sitemap también es dinámico. Así el build compila la aplicación y las consultas se ejecutan cuando Netlify ya dispone de la conexión PostgreSQL.

---

## 13. Configura Netlify

Archivo `netlify.toml`:

```toml
[build]
  command = "npm run build"

[build.environment]
  NODE_VERSION = "22"
```

No añadas un publish directory manual para este Next.js moderno. Netlify detecta el framework y utiliza su adaptador.

Elimina de `next.config.ts`:

```ts
serverExternalPackages: ["better-sqlite3"]
```

Añade `.netlify` a `.gitignore`.

---

## 14. Prueba local completa

Instala:

```powershell
npm install
```

Inicia sesión en Netlify CLI:

```powershell
npx netlify login
```

Enlaza o crea el proyecto:

```powershell
npx netlify init
```

Primera terminal:

```powershell
npm run netlify:dev
```

Segunda terminal:

```powershell
npx netlify database migrations apply
```

Comprueba el estado:

```powershell
npx netlify database status
```

Haz una consulta rápida:

```powershell
npx netlify database connect --query "SELECT COUNT(*) FROM items"
```

En esta copia el resultado esperado tras la importación es:

```text
36
```

Comprueba además:

- inicio público;
- listado de objetos;
- ficha individual;
- login del CMS;
- edición de una ficha;
- subida y borrado de una imagen.

---

## 15. Sube el proyecto a GitHub

Comprueba primero que `.gitignore` excluye:

```text
node_modules
.next
.netlify
.env*
.data
```

Inicializa Git si hace falta:

```powershell
git init
git add .
git commit -m "Migrate CMS to Netlify Database and Blobs"
git branch -M main
git remote add origin URL_DE_TU_REPOSITORIO
git push -u origin main
```

Es recomendable usar un repositorio privado, ya que la migración conserva el hash bcrypt del administrador actual.

---

## 16. Publica desde GitHub en Netlify

1. En Netlify selecciona **Add new project**.
2. Elige **Import an existing project**.
3. Conecta GitHub.
4. Selecciona el repositorio.
5. Comprueba que el build command sea `npm run build`.
6. No cambies la versión Node: `netlify.toml` ya fija Node 22.
7. Añade variables públicas si quieres cambiar los datos visibles:

```text
NEXT_PUBLIC_SERVER_NAME
NEXT_PUBLIC_SERVER_ADDRESS
NEXT_PUBLIC_SITE_URL
```

8. No añadas `DATABASE_PATH`.
9. No añadas `DATABASE_URL` si utilizarás Netlify Database.
10. Publica.

En el primer deploy Netlify detecta las migraciones, crea/aplica el esquema y después publica el código. Si una migración falla, el deploy no debe quedar publicado.

---

## 17. Verificación después del despliegue

En Netlify revisa:

### Database

- `roles`: 3
- `users`: 1
- `mods`: 1
- `items`: 36
- `crafting_recipes`: 26
- `tags`: 6
- `item_relations`: 48
- `faq_entries`: 4
- `installation_sections`: 3
- `media_assets`: 4
- `sessions`: 0 inicialmente

### Blobs

El store `arqueoterra-media` puede no aparecer hasta que subas la primera imagen desde el CMS.

### CMS

1. Inicia sesión con la contraseña que utilizabas en la base SQLite.
2. Cambia inmediatamente la contraseña desde el perfil.
3. Edita una ficha y verifica que el cambio permanece después de otro deploy.
4. Sube una imagen y confirma que aparece en Blobs y que su URL empieza por `/api/media/`.

---

## 18. Cómo repetirlo en otro proyecto similar

Usa este orden exacto:

1. Copia de seguridad de SQLite y uploads.
2. Localiza todas las escrituras al disco.
3. Sustituye dependencias SQLite por PostgreSQL/Netlify.
4. Convierte el esquema Drizzle.
5. Cambia la conexión.
6. Crea la migración de esquema.
7. Exporta los datos.
8. Excluye sesiones.
9. Migra uploads a Blobs.
10. Añade lectura y borrado de Blobs.
11. Elimina semillas automáticas del build.
12. Marca las páginas dependientes de la DB como dinámicas cuando sea necesario.
13. Prueba local con Netlify Dev.
14. Sube a GitHub.
15. Publica un Deploy Preview.
16. Verifica tablas, login, edición y uploads.
17. Publica producción.
18. Mantén las migraciones antiguas intactas.

La idea clave es esta: **el repositorio contiene código y migraciones; PostgreSQL contiene datos; Blobs contiene archivos**. Ningún dato que deba sobrevivir puede depender del disco local de una función.
