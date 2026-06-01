-- ============================================================================
-- PERITUS — Migración 002_cotizacion
--
-- PERITUS comparte la BD `cnp` (esquema 001_initial.sql ya aplicado por CNP).
-- Esta migración SOLO añade la tabla `cotizacion`, que es exclusiva de PERITUS
-- (formulario público de "Solicitar cotización"). No existe en CNP.
--
-- El registro de migraciones (schema_migrations) es compartido en la BD `cnp`,
-- pero esta migración tiene un nombre de archivo propio, así que el runner de
-- PERITUS la aplica una sola vez sin colisionar con las de CNP.
-- ============================================================================

BEGIN;

-- La función set_updated_at() ya existe (creada en 001 por CNP). Se redefine de
-- forma idempotente por si esta migración corriera sobre una BD sin ella.
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- cotizacion (solicitud pública de cotización) -------------------------------
CREATE TABLE IF NOT EXISTS cotizacion (
  id              TEXT PRIMARY KEY,
  nombre          TEXT NOT NULL,
  email           TEXT NOT NULL,
  telefono        TEXT NOT NULL,
  tipo_peritaje   TEXT NOT NULL,
  ciudad          TEXT NOT NULL,
  descripcion     TEXT NOT NULL,
  fecha_creacion  TIMESTAMPTZ,
  estado          TEXT NOT NULL DEFAULT 'pendiente',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cotizacion_estado     ON cotizacion (estado);
CREATE INDEX IF NOT EXISTS idx_cotizacion_created_at ON cotizacion (created_at DESC);

DROP TRIGGER IF EXISTS trg_cotizacion_updated_at ON cotizacion;
CREATE TRIGGER trg_cotizacion_updated_at
  BEFORE UPDATE ON cotizacion
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
