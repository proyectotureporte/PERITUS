# PERITUS — contexto permanente

## Qué es
Landing pública + portal de peritos de PERITUS (peritaje judicial, Colombia). Marca hermana de CNP: comparte la BD PostgreSQL `cnp` y el mismo modelo de datos (crm_client, crm_user, cases, quote, case_event, case_document, registro_peritus). Tabla exclusiva de PERITUS: `cotizacion` (formulario público "Solicitar cotización").
Dominio: **peritus.com.co** · VPS: `ssh restaurar` (82.223.109.156) · Carpeta: `/var/www/peritus` · PM2: `peritus` · Puerto: 3002 (Nginx con TLS) · DB: PostgreSQL local `cnp` (user `peritus_user`).

## Stack
Next.js 16.0.8 (App Router, TS estricto) + React 19 + Tailwind 4 + shadcn/ui mínimo · PostgreSQL vía `pg` con SQL crudo (`src/lib/db/`, mismo patrón que CNP: alias camelCase `_id`/`_createdAt` heredados de Sanity) · Auth JWT custom con `jose` + bcryptjs (cookie `crm-token`, rol único `cliente`) · Sanity SOLO como CDN de archivos (CV, documentos) · Resend (email credenciales) · npm.

## Comandos
dev: `npm run dev` · build: `npm run build` · typecheck: `npx tsc --noEmit` · migraciones: `npm run db:migrate` (runner `scripts/migrate.mjs`, registro compartido `schema_migrations` en BD `cnp`) · deploy: push a main + en VPS `cd /var/www/peritus && git pull && npm install && npm run build && pm2 reload peritus`.

## Estructura esencial
- Páginas públicas: `/` (landing), `/perito`, `/abogado`, `/juez`, `/empresa`, `/registro` (alta de perito)
- Portal: `/portal/login`, `/portal/cases`, `/portal/cases/[id]`, `/portal/change-password`, `/portal/cotizaciones` (vista admin con contraseña compartida hardcodeada)
- API: `src/app/api/` (auth, cases, quotes approve/reject, cotizacion, portal, registro-peritus)
- Protección de rutas: `src/proxy.ts` (equivalente a middleware; lista pública + verificación JWT)
- Capa de datos: `src/lib/db/` (barrel namespaced) · Esquema propio: `db/migrations/002_cotizacion.sql` (el 001 lo aplica CNP)
- Mapa profundo: `docs/PROJECT-MAP.md`

## Reglas de ESTE proyecto
- Verificación antes de push: `npx tsc --noEmit && npm run build`
- La BD es COMPARTIDA con CNP (producción real): jamás migraciones destructivas ni tocar filas que no tengan prefijo de prueba `qa-`
- El login del portal autentica contra `registro_peritus.contrasena_hash` (contraseña elegida en /registro), NO contra `crm_user`
- `/registro` crea PERITOS, no clientes: `crm_user` (rol 'perito') + fila en `expert` (directorio que CNP lista en /crm/experts, estado 'pendiente') + `registro_peritus` (vinculado por `user_id`→crm_user). NO crea `crm_client`. El portal del perito muestra los casos donde es `cases.assigned_expert_id` (ownership: `verifyExpertOwnsCase`). El `role:'cliente'` del JWT es etiqueta interna del portal, no el rol del crm_user.
- Migraciones sobre tablas de CNP (`registro_peritus`/`crm_user`/`expert`, OWNER `cnp_user`): `peritus_user` NO puede ALTER → aplícalas como `postgres` (`sudo -u postgres psql cnp -f ...`) y registra el filename a mano en `schema_migrations`; NO uses `npm run db:migrate` para ellas. Si el flujo escribe en una tabla nueva de CNP, da `GRANT` a `peritus_user`.
- `.env` del VPS tiene `DATABASE_URL`; el `.env.local` local NO la tiene (sin BD local el dev server falla en queries)
- IDs TEXT (UUID o `_id` heredado). Cookies: `crm-token` (httpOnly, 7d)
