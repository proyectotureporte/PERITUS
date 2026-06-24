# PERITUS — Mapa del proyecto (generado 2026-06-11 por app-qa)

## Despliegue
| Qué | Valor |
|---|---|
| URL producción | https://peritus.com.co (Nginx → 127.0.0.1:3002) |
| VPS | `ssh restaurar` (82.223.109.156), carpeta `/var/www/peritus`, PM2 `peritus` |
| BD | PostgreSQL local del VPS, base **`cnp` (COMPARTIDA con CNP)**, rol `peritus_user` |
| Email | Resend, FROM `Peritus <contacto@peritus.com.co>` |
| Archivos | Sanity CDN (proyecto `fbva5pcb`), solo assets |
| CI/CD | NO hay GitHub Actions: deploy manual por SSH |

## Páginas
| Ruta | Tipo | Qué hace |
|---|---|---|
| `/` | pública | Landing con formulario de cotización (`CotizacionForm` → POST /api/cotizacion) |
| `/perito`, `/abogado`, `/juez`, `/empresa` | públicas | Landings por audiencia |
| `/registro` | pública | Alta de perito (formulario multipart con CV → POST /api/registro-peritus) |
| `/portal/login` | pública | Login portal (POST /api/auth/login, type:'portal') |
| `/portal` | protegida | redirect a /portal/cases |
| `/portal/cases` | protegida (rol cliente) | Lista de casos ASIGNADOS al perito (GET /api/cases → `cases.assigned_expert_id`) |
| `/portal/cases/[id]` | protegida | Detalle: tabs caso/cotizaciones/eventos/documentos; subir documento; aprobar/rechazar cotización |
| `/portal/change-password` | pública en proxy, requiere cookie en API | Cambio de contraseña |
| `/portal/cotizaciones` | pública con "gate" de contraseña compartida (hash hardcodeado en el código) | Vista admin de solicitudes de cotización |

## Endpoints API
| Método+Ruta | Auth (proxy) | Notas |
|---|---|---|
| POST `/api/auth/login` | pública | registro_peritus.contrasena_hash; setea cookie `crm-token` (7d) |
| POST `/api/auth/logout` | pública | borra cookie |
| GET `/api/auth/me` | pública | lee cookie; mustChangePassword siempre false |
| POST `/api/cotizacion` | pública | Zod; INSERT cotizacion |
| POST `/api/registro-peritus` | pública | multipart; crea **crm_user (rol 'perito') + expert (directorio, 'pendiente') + registro_peritus (`user_id`→crm_user)** en transacción; **ya NO crea crm_client**; sube CV a Sanity; email credenciales (CNPxxxx) |
| GET `/api/cases` | JWT | lista casos del clientId del usuario |
| GET `/api/cases/[id]` | JWT | ownership check (verifyClientOwnsCase) |
| GET/POST `/api/cases/[id]/documents` | JWT | ownership check; POST sube archivo (10MB max) a Sanity + case_document |
| GET `/api/cases/[id]/events` | JWT | ownership check |
| GET `/api/cases/[id]/quotes` | JWT | ownership check |
| POST `/api/quotes/[id]/approve` | JWT | ownership check (`verifyExpertOwnsCase` → assigned_expert_id) |
| POST `/api/quotes/[id]/reject` | JWT | ownership check (`verifyExpertOwnsCase` → assigned_expert_id) |
| POST `/api/portal/change-password` | pública en proxy | valida cookie internamente; actualiza registro_peritus.contrasena_hash |
| POST `/api/portal/cotizaciones/auth` | pública | compara contra hash bcrypt hardcodeado; NO emite sesión |
| GET `/api/portal/cotizaciones/list` | pública (allowlist proxy) | ⚠️ devuelve TODAS las cotizaciones (PII) sin ninguna auth |

## Flujos de usuario
1. **Cotización pública**: landing → form → POST /api/cotizacion → fila en `cotizacion` → visible en /portal/cotizaciones.
2. **Registro de perito**: /registro → POST multipart → crm_user (rol 'perito', password CNPxxxx) + expert (directorio de Peritos del CRM de CNP, `validation_status` 'pendiente', con CV y datos mapeados: disciplines=profesión, specialization=especialidad, experience_years, city, tax_id=cédula) + registro_peritus (`user_id`→crm_user, contraseña elegida) → email de credenciales (manda la CNPxxxx, ¡no la elegida!) → pantalla de éxito con código PER-XXXX. **Aparecen en CRM › Peritos, NO en Clientes.**
3. **Portal (perito)**: login con email + contraseña elegida en registro → /portal/cases (casos donde es `assigned_expert_id`) → detalle → ver quotes/eventos/documentos → subir documento → aprobar/rechazar quote (estado 'enviada'). Ownership por `assigned_expert_id` (`verifyExpertOwnsCase`).
4. **Admin cotizaciones**: /portal/cotizaciones → contraseña compartida → lista.

## Esquema DB (tablas que PERITUS toca, en BD compartida `cnp`)
- `cotizacion` (exclusiva PERITUS): id TEXT PK, nombre, email, telefono, tipo_peritaje, ciudad, descripcion, fecha_creacion, estado ('pendiente'), created_at, updated_at
- Compartidas con CNP: `crm_user`, `expert` (directorio de peritos que lista CNP en /crm/experts), `cases`, `quote`, `case_event`, `case_document`, `registro_peritus` (+ columna `user_id`→crm_user, migración 003), `crm_client`, `schema_migrations`

## Realtime
No hay (CNP tiene WS; PERITUS no usa ninguno).

## Gotchas conocidos
- `.env.local` local sin `DATABASE_URL` → dev local rompe en cualquier query.
- `next.config.mjs` vacío: sin security headers.
- Sin rate limiting en ningún endpoint público.
- El proxy permite `/portal/change-password` y `/api/portal/cotizaciones/*` sin token.
- Email de credenciales: asunto/branding "Portal CNP" y contraseña CNPxxxx que NO sirve para el login de peritus.com.co.
- **Modelo perito**: un perito = `crm_user` (rol 'perito') + fila en `expert` (lo que CNP lista en /crm/experts). `registro_peritus.user_id` los vincula; sus casos son `cases.assigned_expert_id`. El "rol" del JWT del portal sigue siendo `cliente` (etiqueta interna del portal, NO el crm_user.role) para no tocar proxy/login.
- **Migraciones sobre tablas compartidas**: `registro_peritus`/`crm_user`/`expert` son OWNER `cnp_user`; `peritus_user` NO puede ALTER → esas migraciones se aplican como `postgres` (no con `npm run db:migrate`) y se registran a mano en `schema_migrations`. `peritus_user` necesitó `GRANT SELECT,INSERT,UPDATE ON expert` para el flujo de registro.
