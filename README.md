# Brújula Cúbica — versión preparada para Netlify

Guía web y CMS propio para un servidor modded de Minecraft. Esta variante está adaptada para un despliegue serverless en Netlify:

- PostgreSQL persistente mediante Netlify Database.
- Imágenes nuevas del CMS mediante Netlify Blobs.
- Migraciones automáticas en `netlify/database/migrations`.
- Contenido actual importado desde la antigua base SQLite.

La explicación completa está en [`GUIA_MIGRACION_NETLIFY.md`](./GUIA_MIGRACION_NETLIFY.md).

## Requisitos

- Node.js 22.
- npm.
- Cuenta de GitHub.
- Cuenta de Netlify.

## Instalar dependencias

```powershell
npm install
```

## Desarrollo local con el entorno de Netlify

Primera terminal:

```powershell
npm run netlify:dev
```

Segunda terminal, la primera vez o cuando añadas una migración:

```powershell
npx netlify database migrations apply
```

Después abre la dirección que indique Netlify Dev, normalmente `http://localhost:8888`.

> `npm run dev` inicia únicamente Next.js. Para probar Netlify Database y Netlify Blobs utiliza `npm run netlify:dev`.

## Comandos

```powershell
npm run netlify:dev      # Next.js + servicios locales de Netlify
npm run build            # compilación de producción
npm run lint             # revisión estática
npm run test             # pruebas
npm run db:export-sqlite # regenera la migración de datos desde .data
npm run db:seed          # semilla manual contra PostgreSQL
npm run db:studio        # Drizzle Studio; necesita DATABASE_URL
```

## Almacenamiento

- Los datos del CMS viven en PostgreSQL.
- Las imágenes subidas desde el CMS viven en el store `arqueoterra-media` de Netlify Blobs.
- Las imágenes oficiales incluidas en `public/images` siguen versionadas con GitHub.
- `.data/minecraft-guide.db` queda únicamente como copia local y origen para regenerar la migración inicial. La aplicación desplegada no la utiliza.

## Seguridad

Las sesiones SQLite antiguas no se importan. Al publicar tendrás que iniciar sesión de nuevo. El usuario administrador actual sí se conserva para mantener el acceso al CMS; cambia su contraseña tras el primer despliegue, especialmente si el repositorio de GitHub es público.
