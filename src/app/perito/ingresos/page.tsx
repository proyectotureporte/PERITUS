import { createClient } from '@/lib/supabase/server';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Calendar,
  Download,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  escrow_released_at: string | null;
  cases: {
    case_number: string;
    title: string;
  } | null;
  payer: { full_name: string } | null;
}

async function getExpertPayments() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('payments')
    .select(`
      *,
      cases (case_number, title),
      payer:payer_id (full_name)
    `)
    .eq('payee_id', user.id)
    .order('created_at', { ascending: false });

  return (data || []) as Payment[];
}

async function getPaymentStats(userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('payments')
    .select('amount, status')
    .eq('payee_id', userId);

  const payments = data as { amount: number; status: string }[] | null;

  const released = payments?.filter((p) => p.status === 'released').reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const escrow = payments?.filter((p) => p.status === 'escrow').reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const pending = payments?.filter((p) => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  return {
    total: released + escrow + pending,
    released,
    escrow,
    pending,
    count: payments?.length || 0,
  };
}

function getStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }> = {
    pending: { label: 'Pendiente', variant: 'warning' },
    escrow: { label: 'En Escrow', variant: 'default' },
    released: { label: 'Recibido', variant: 'success' },
    refunded: { label: 'Reembolsado', variant: 'secondary' },
    disputed: { label: 'Disputado', variant: 'destructive' },
  };
  const info = map[status] || { label: status, variant: 'default' as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
}

export default async function IngresosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const [payments, stats] = await Promise.all([
    getExpertPayments(),
    getPaymentStats(user.id),
  ]);

  // Calculate this month's earnings
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const thisMonthEarnings = payments
    .filter((p) => p.status === 'released' && new Date(p.escrow_released_at || p.created_at) >= thisMonth)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Ingresos</h1>
          <p className="text-gray-500 mt-1">Resumen de pagos y ganancias</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Ganado</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.released)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En Escrow</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.escrow)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Pendiente de liberación</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Este Mes</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(thisMonthEarnings)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Transacciones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Escrow Info */}
      {stats.escrow > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800">Fondos en Escrow</h3>
                <p className="text-blue-700 mt-1">
                  Tienes {formatCurrency(stats.escrow)} en escrow. Estos fondos se liberarán
                  automáticamente 24 horas después de que el cliente apruebe tu informe.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>Todos tus ingresos por casos completados</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tienes pagos registrados</p>
              <p className="text-sm text-gray-400 mt-1">
                Los pagos aparecerán aquí cuando completes casos
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        payment.status === 'released' ? 'bg-green-100' :
                        payment.status === 'escrow' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <DollarSign className={`h-5 w-5 ${
                          payment.status === 'released' ? 'text-green-600' :
                          payment.status === 'escrow' ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.cases?.title || 'Pago'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {payment.cases?.case_number} • De: {payment.payer?.full_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(payment.status)}
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(payment.escrow_released_at || payment.created_at)}
                        </span>
                      </div>
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
