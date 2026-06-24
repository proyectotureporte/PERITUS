// Catálogo de macro-categorías de perito y sus especialidades (PDF "Estructura de
// Clasificación de Peritos", §3 y §6). Usado por el formulario público /registro
// (dropdowns dependientes) y por el endpoint de registro (derivar disciplinas).

export const EXPERT_CATEGORIES = [
  'medicos', 'psicologos', 'ingenieros_arquitectos', 'tecnologia_informatica',
  'forense_documental', 'financieros_avaluadores', 'otros',
] as const;
export type ExpertCategory = (typeof EXPERT_CATEGORIES)[number];

export const EXPERT_CATEGORY_LABELS: Record<ExpertCategory, string> = {
  medicos: 'Médicos',
  psicologos: 'Psicólogos',
  ingenieros_arquitectos: 'Ingenieros y arquitectos',
  tecnologia_informatica: 'Tecnología e informática',
  forense_documental: 'Forense documental',
  financieros_avaluadores: 'Financieros y avaluadores',
  otros: 'Otros',
};

export const EXPERT_CATEGORY_SPECIALTIES: Record<ExpertCategory, string[]> = {
  medicos: ['Médico laboral', 'Anestesiólogo', 'Cirujano plástico', 'Médico general'],
  psicologos: ['Psicología jurídica', 'Psicología forense'],
  ingenieros_arquitectos: ['Ingeniero civil', 'Arquitecto', 'Otro perfil técnico'],
  tecnologia_informatica: ['Ingeniería de sistemas', 'Seguridad digital', 'Informática forense', 'Auditoría de sistemas'],
  forense_documental: ['Grafología', 'Dactiloscopia', 'Análisis documental'],
  financieros_avaluadores: ['Análisis financiero', 'Valoración de activos', 'Avalúos', 'Estudios económicos'],
  otros: ['Otro'],
};

// Macro-categoría → disciplinas de caso (enum case_discipline de CNP) para que el
// perito siga siendo asignable por el motor de casos existente.
export const EXPERT_CATEGORY_TO_DISCIPLINES: Record<ExpertCategory, string[]> = {
  medicos: ['medico'],
  psicologos: ['otro'],
  ingenieros_arquitectos: ['ingenieria', 'arquitectura'],
  tecnologia_informatica: ['informatico'],
  forense_documental: ['grafologia'],
  financieros_avaluadores: ['financiero', 'contable', 'valuacion'],
  otros: ['otro'],
};
