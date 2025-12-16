import { createClient } from '@/lib/supabase/server';
import {
  FileText,
  User,
  Calendar,
  Filter,
  Search,
  Download,
  Activity,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';

interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  profiles: { full_name: string; email: string } | null;
}

async function getAuditLogs() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      profiles:actor_id (full_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }

  return data as AuditLog[];
}

function getActionBadge(action: string) {
  const actionColors: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
    create: 'success',
    update: 'default',
    delete: 'destructive',
    login: 'secondary',
    logout: 'secondary',
    verify: 'success',
    reject: 'warning',
  };
  return <Badge variant={actionColors[action.toLowerCase()] || 'outline'}>{action}</Badge>;
}

function getEntityBadge(entity: string) {
  return <Badge variant="outline">{entity}</Badge>;
}

export default async function AuditoriaPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logs de Auditoría</h1>
          <p className="text-gray-500 mt-1">Registro de todas las acciones del sistema</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Logs
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Total Registros</p>
                <p className="text-xl font-bold">{logs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Usuarios Activos</p>
                <p className="text-xl font-bold">
                  {new Set(logs.map((l) => l.actor_id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-gray-500">Entidades Afectadas</p>
                <p className="text-xl font-bold">
                  {new Set(logs.map((l) => l.entity_type)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Hoy</p>
                <p className="text-xl font-bold">
                  {logs.filter((l) => {
                    const today = new Date().toDateString();
                    return new Date(l.created_at).toDateString() === today;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registro de Actividad</CardTitle>
              <CardDescription>Últimas 100 acciones registradas</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay registros de auditoría</p>
              <p className="text-sm text-gray-400 mt-1">
                Las acciones del sistema se registrarán aquí
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        {getActionBadge(log.action)}
                        {getEntityBadge(log.entity_type)}
                        <span className="text-sm text-gray-500">
                          por <span className="font-medium">{log.profiles?.full_name || 'Sistema'}</span>
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {log.entity_type}:{log.entity_id.slice(0, 8)}
                        </span>
                      </div>
                      {log.ip_address && (
                        <p className="text-xs text-gray-400 mt-1">
                          IP: {log.ip_address}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{formatRelativeTime(log.created_at)}</p>
                      <Button variant="ghost" size="sm" className="mt-1">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
