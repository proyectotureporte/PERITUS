import { createClient } from '@/lib/supabase/server';
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Download,
  Filter,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

interface Payment {
  id: string;
  case_id: string;
  payer_id: string;
  payee_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  payment_gateway: string;
  gateway_transaction_id: string | null;
  created_at: string;
  cases: {
    case_number: string;
    title: string;
  } | null;
  payer: { full_name: string; email: string } | null;
  payee: { full_name: string; email: string } | null;
}

async function getPayments() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      cases (case_number, title),
      payer:payer_id (full_name, email),
      payee:payee_id (full_name, email)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payments:', error);
    return [];
  }

  return data as Payment[];
}

async function getPaymentStats() {
  const supabase = await createClient();

  const { data: payments } = await supabase.from('payments').select('amount, status');
  const paymentsTyped = payments as { amount: number; status: string }[] | null;

  const totalRevenue = paymentsTyped
    ?.filter((p) => p.status === 'released')
    .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  const inEscrow = paymentsTyped
    ?.filter((p) => p.status === 'escrow')
    .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  const pending = paymentsTyped
    ?.filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  const refunded = paymentsTyped
    ?.filter((p) => p.status === 'refunded')
    .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  return { totalRevenue, inEscrow, pending, refunded, count: paymentsTyped?.length || 0 };
}

function getStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' }> = {
    pending: { label: 'Pendiente', variant: 'warning' },
    escrow: { label: 'En Escrow', variant: 'default' },
    released: { label: 'Liberado', variant: 'success' },
    refunded: { label: 'Reembolsado', variant: 'secondary' },
    disputed: { label: 'Disputado', variant: 'destructive' },
  };
  const info = map[status] || { label: status, variant: 'outline' as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
}

export default async function PagosPage() {
  const [payments, stats] = await Promise.all([getPayments(), getPaymentStats()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
          <p className="text-gray-500 mt-1">Control de transacciones y pagos del sistema</p>
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
                <p className="text-sm text-gray-500">Ingresos Liberados</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
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
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.inEscrow)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(stats.pending)}</p>
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
                <p className="text-sm text-gray-500">Reembolsados</p>
                <p className="text-2xl font-bold text-gray-600">{formatCurrency(stats.refunded)}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-xl">
                <XCircle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transacciones</CardTitle>
              <CardDescription>Historial de todos los pagos</CardDescription>
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
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay transacciones registradas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Caso</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Pagador</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Beneficiario</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Monto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Fecha</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm text-gray-500">
                        {payment.gateway_transaction_id?.slice(0, 8) || payment.id.slice(0, 8)}...
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{payment.cases?.case_number}</span>
                      </td>
                      <td className="py-3 px-4 text-sm">{payment.payer?.full_name || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">{payment.payee?.full_name || 'N/A'}</td>
                      <td className="py-3 px-4 font-medium">{formatCurrency(payment.amount)}</td>
                      <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {formatRelativeTime(payment.created_at)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
