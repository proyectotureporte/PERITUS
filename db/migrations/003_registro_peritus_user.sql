-- ============================================================================
-- PERITUS — Migración 003_registro_peritus_user
--
-- Vincula cada registro de perito (formulario público /registro) con su cuenta
-- `crm_user` (rol 'perito'). Hasta ahora el registro solo guardaba `client_id`
-- (→ crm_client), porque el perito se creaba como CLIENTE. A partir de ahora el
-- perito se crea como PERITO: un `crm_user` (rol 'perito') + una fila en `expert`
-- (directorio de peritos del CRM de CNP), y el portal de peritus.com.co resuelve
-- "sus casos" por `cases.assigned_expert_id = registro_peritus.user_id`.
--
-- Columna ADITIVA y nullable: no toca filas existentes ni rompe a CNP, que sigue
-- usando `registro_peritus` con SELECT de columnas explícitas. BD compartida `cnp`.
-- ============================================================================

BEGIN;

ALTER TABLE registro_peritus ADD COLUMN IF NOT EXISTS user_id TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'registro_peritus_user_id_fkey'
  ) THEN
    ALTER TABLE registro_peritus
      ADD CONSTRAINT registro_peritus_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES crm_user(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_registro_peritus_user ON registro_peritus (user_id);

COMMIT;
