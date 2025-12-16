import { createClient } from '@/lib/supabase/server';
import {
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  FileText,
  Download,
  ArrowUpRight,
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
  payment_method: string | null;
  created_at: string;
  cases: {
    case_number: string;
    title: string;
  } | null;
  payee: { full_name: string } | null;
}

async function getClientPayments() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('payments')
    .select(`
      *,
      cases (case_number, title),
      payee:payee_id (full_name)
    `)
    .eq('payer_id', user.id)
    .order('created_at', { ascending: false });

  return (data || []) as Payment[];
}

async function getPaymentStats(userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('payments')
    .select('amount, status')
    .eq('payer_id', userId);

  const payments = data as { amount: number; status: string }[] | null;

  return {
    total: payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0,
    escrow: payments?.filter((p) => p.status === 'escrow').reduce((sum, p) => sum + Number(p.amount), 0) || 0,
    released: payments?.filter((p) => p.status === 'released').reduce((sum, p) => sum + Number(p.amount), 0) || 0,
    count: payments?.length || 0,
  };
}

function getStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }> = {
    pending: { label: 'Pendiente', variant: 'warning' },
    escrow: { label: 'En Escrow', variant: 'default' },
    released: { label: 'Pagado', variant: 'success' },
    refunded: { label: 'Reembolsado', variant: 'secondary' },
    disputed: { label: 'Disputado', variant: 'destructive' },
  };
  const info = map[status] || { label: status, variant: 'default' as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
}

export default async function PagosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const [payments, stats] = await Promise.all([
    getClientPayments(),
    getPaymentStats(user.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Pagos</h1>
        <p className="text-gray-500 mt-1">
          Historial de pagos y transacciones
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pagado</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En Escrow</p>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(stats.escrow)}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Liberados</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.released)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>Todas tus transacciones</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tienes pagos registrados</p>
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
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.cases?.title || 'Pago'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {payment.cases?.case_number} • Para: {payment.payee?.full_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(payment.status)}
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(payment.created_at)}
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
