import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, "d 'de' MMMM, yyyy", { locale: es });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: es });
}

export function formatCurrency(amount: number, currency: string = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-CO').format(num);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const SPECIALTY_LABELS: Record<string, string> = {
  finanzas: 'Finanzas',
  psicologia: 'Psicología',
  ingenieria: 'Ingeniería',
  medicina: 'Medicina',
  informatica: 'Informática',
  seguridad_digital: 'Seguridad Digital',
  documentologia: 'Documentología',
  grafologia: 'Grafología',
  contabilidad: 'Contabilidad',
  ambiental: 'Ambiental',
  urbanistica: 'Urbanística',
  legal: 'Legal',
};

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  pending_assignment: 'Pendiente de asignación',
  assigned: 'Asignado',
  in_progress: 'En progreso',
  review: 'En revisión',
  completed: 'Completado',
  cancelled: 'Cancelado',
  disputed: 'En disputa',
};

export const URGENCY_LABELS: Record<string, string> = {
  normal: 'Normal',
  urgent: 'Urgente',
  critical: 'Crítico',
};
