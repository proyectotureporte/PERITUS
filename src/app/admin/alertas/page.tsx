import { createClient } from '@/lib/supabase/server';
import {
  AlertTriangle,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';

interface SuspiciousActivity {
  id: string;
  case_id: string | null;
  user_id: string;
  activity_type: string;
  severity: string;
  description: string;
  evidence: Record<string, unknown>;
  resolved: boolean;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
}

async function getAlerts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('suspicious_activities')
    .select(`
      *,
      profiles:user_id (full_name, email)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }

  return data as SuspiciousActivity[];
}

async function getAlertStats() {
  const supabase = await createClient();

  const { count: total } = await supabase
    .from('suspicious_activities')
    .select('*', { count: 'exact', head: true });

  const { count: unresolved } = await supabase
    .from('suspicious_activities')
    .select('*', { count: 'exact', head: true })
    .eq('resolved', false);

  const { count: critical } = await supabase
    .from('suspicious_activities')
    .select('*', { count: 'exact', head: true })
    .eq('severity', 'critical')
    .eq('resolved', false);

  const { count: high } = await supabase
    .from('suspicious_activities')
    .select('*', { count: 'exact', head: true })
    .eq('severity', 'high')
    .eq('resolved', false);

  return {
    total: total || 0,
    unresolved: unresolved || 0,
    critical: critical || 0,
    high: high || 0,
  };
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'critical':
      return <Badge variant="destructive">Crítico</Badge>;
    case 'high':
      return <Badge variant="warning">Alto</Badge>;
    case 'medium':
      return <Badge variant="secondary">Medio</Badge>;
    case 'low':
      return <Badge variant="outline">Bajo</Badge>;
    default:
      return <Badge variant="outline">{severity}</Badge>;
  }
}

function getActivityTypeBadge(type: string) {
  const typeMap: Record<string, string> = {
    contact_attempt: 'Intento de Contacto',
    data_export: 'Exportación de Datos',
    pattern_detected: 'Patrón Detectado',
    tos_violation: 'Violación TOS',
  };

  return <Badge variant="outline">{typeMap[type] || type}</Badge>;
}

export default async function AlertasPage() {
  const [alerts, stats] = await Promise.all([getAlerts(), getAlertStats()]);

  const unresolvedAlerts = alerts.filter((a) => !a.resolved);
  const resolvedAlerts = alerts.filter((a) => a.resolved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alertas de Seguridad</h1>
        <p className="text-gray-500 mt-1">
          Monitorea actividades sospechosas y posibles violaciones
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Total Alertas</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-gray-500">Sin Resolver</p>
                <p className="text-xl font-bold">{stats.unresolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Críticas</p>
                <p className="text-xl font-bold">{stats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Alta Prioridad</p>
                <p className="text-xl font-bold">{stats.high}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unresolved Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Alertas Pendientes
            {stats.unresolved > 0 && (
              <Badge variant="destructive">{stats.unresolved}</Badge>
            )}
          </CardTitle>
          <CardDescription>Actividades que requieren revisión</CardDescription>
        </CardHeader>
        <CardContent>
          {unresolvedAlerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">No hay alertas pendientes</p>
              <p className="text-sm text-gray-400 mt-1">
                El sistema está funcionando correctamente
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {unresolvedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-red-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        {getSeverityBadge(alert.severity)}
                        {getActivityTypeBadge(alert.activity_type)}
                      </div>
                      <p className="font-medium text-gray-900 mt-2">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Usuario: {alert.profiles?.full_name || 'Desconocido'}</span>
                        <span>{alert.profiles?.email}</span>
                        <span>{formatRelativeTime(alert.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Revisar
                      </Button>
                      <Button size="sm">Resolver</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resolved Alerts */}
      {resolvedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alertas Resueltas</CardTitle>
            <CardDescription>Historial de actividades revisadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resolvedAlerts.slice(0, 10).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">{alert.description}</span>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(alert.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
