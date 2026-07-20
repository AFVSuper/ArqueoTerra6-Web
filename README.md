# Brújula Cúbica

Guía web y CMS propio para un servidor modded de Minecraft. La parte pública organiza el contenido por mod y ofrece fichas de objetos, recetas, búsqueda, instalación y FAQ. El panel privado permite al staff redactar, revisar y publicar todo el contenido.

## Arranque local

Requisitos: Node.js 20.9 o superior.

```powershell
npm.cmd install
Copy-Item .env.example .env.local
npm.cmd run dev
```

Abre `http://localhost:3000`. El comando de desarrollo prepara automáticamente la base SQLite y los datos de demostración.

Si no cambias las variables antes del primer arranque, el acceso local inicial es:

- Usuario: `admin`
- Contraseña: `cambiar-esta-clave`

Cambia esa contraseña inmediatamente desde `CMS > Mi perfil`. `ADMIN_PASSWORD` solo se usa cuando se crea la cuenta inicial; no reemplaza contraseñas existentes.

## Contenido y roles

- `Editor`: crea, modifica y elimina contenido; sus cambios se guardan como borrador.
- `Revisor`: edita y puede publicar; no elimina contenido.
- `Superadmin`: tiene todos los permisos y crea cuentas de staff.

No existe registro público. Cada Server Action, ruta de subida y consulta privada vuelve a validar sesión y rol en el servidor.

Los campos complejos siguen formatos sencillos:

- Galerías y pasos: una entrada por línea.
- Etiquetas: separadas por comas.
- Stats: una línea por dato, por ejemplo `Daño: 11`.
- Ingredientes: una línea con `Nombre | cantidad`.

## Imágenes

En `CMS > Medios` se puede subir JPG, PNG, WebP o GIF de hasta 8 MB, o registrar una URL externa. Después la URL aparece como sugerencia en los formularios de mods, objetos y recetas.

Los archivos subidos se guardan en `public/uploads` y la base local en `.data/minecraft-guide.db`; ambos están ignorados por Git. Haz copia de seguridad de esas dos rutas.

## Comandos

```powershell
npm.cmd run dev       # desarrollo y semilla automática
npm.cmd run test      # pruebas de búsqueda y permisos
npm.cmd run lint      # revisión estática
npm.cmd run build     # compilación de producción
npm.cmd run start     # servidor de producción
npm.cmd run db:seed   # prepara esquema, cuenta y demo sin duplicar datos
npm.cmd run db:studio # inspección visual con Drizzle Studio
```

## Despliegue

Esta versión está orientada a un servidor Node persistente, VPS o contenedor con volumen. Conserva `.data` y `public/uploads` entre despliegues. Para varias instancias o un entorno serverless, migra SQLite a Postgres y los uploads a almacenamiento de objetos antes de escalar horizontalmente.

Configura como mínimo `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SERVER_NAME`, `NEXT_PUBLIC_SERVER_ADDRESS` y `NEXT_PUBLIC_SITE_URL` antes del primer arranque de producción.
