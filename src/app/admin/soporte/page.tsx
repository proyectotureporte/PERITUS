'use client';

import { useState } from 'react';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Send,
  Search,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Mock data for support tickets - In production, this would come from Supabase
const mockTickets = [
  {
    id: '1',
    subject: 'No puedo subir documentos',
    user_name: 'Juan Pérez',
    user_email: 'juan@email.com',
    status: 'open',
    priority: 'high',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    messages: [
      { from: 'user', content: 'Intento subir mi cédula pero aparece un error', time: '2h' },
    ],
  },
  {
    id: '2',
    subject: 'Consulta sobre pagos',
    user_name: 'María García',
    user_email: 'maria@email.com',
    status: 'pending',
    priority: 'medium',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      { from: 'user', content: '¿Cuándo se libera el pago de un caso completado?', time: '1d' },
      { from: 'admin', content: 'Los pagos se liberan 24 horas después de la aprobación del cliente.', time: '12h' },
    ],
  },
  {
    id: '3',
    subject: 'Verificación de perfil',
    user_name: 'Carlos López',
    user_email: 'carlos@email.com',
    status: 'resolved',
    priority: 'low',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      { from: 'user', content: '¿Cuánto tarda la verificación?', time: '3d' },
      { from: 'admin', content: 'Normalmente 24-48 horas hábiles.', time: '3d' },
      { from: 'user', content: 'Gracias!', time: '2d' },
    ],
  },
];

function getStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }> = {
    open: { label: 'Abierto', variant: 'destructive' },
    pending: { label: 'Pendiente', variant: 'warning' },
    resolved: { label: 'Resuelto', variant: 'success' },
  };
  const info = map[status] || { label: status, variant: 'default' as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
}

function getPriorityBadge(priority: string) {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    high: { label: 'Alta', variant: 'destructive' },
    medium: { label: 'Media', variant: 'default' },
    low: { label: 'Baja', variant: 'secondary' },
  };
  const info = map[priority] || { label: priority, variant: 'secondary' as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
}

export default function SoportePage() {
  const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null);
  const [reply, setReply] = useState('');

  const stats = {
    open: mockTickets.filter((t) => t.status === 'open').length,
    pending: mockTickets.filter((t) => t.status === 'pending').length,
    resolved: mockTickets.filter((t) => t.status === 'resolved').length,
    total: mockTickets.length,
  };

  const handleSendReply = () => {
    if (!reply.trim()) return;
    // In production, this would send to Supabase
    console.log('Sending reply:', reply);
    setReply('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Centro de Soporte</h1>
        <p className="text-gray-500 mt-1">Gestión de tickets y consultas de usuarios</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Abiertos</p>
                <p className="text-xl font-bold">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-gray-500">Pendientes</p>
                <p className="text-xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Resueltos</p>
                <p className="text-xl font-bold">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ticket List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tickets</CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTicket?.id === ticket.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{ticket.subject}</p>
                      <p className="text-sm text-gray-500">{ticket.user_name}</p>
                    </div>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {getPriorityBadge(ticket.priority)}
                    <span className="text-xs text-gray-400">
                      {ticket.messages[ticket.messages.length - 1]?.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ticket Detail */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedTicket ? selectedTicket.subject : 'Selecciona un ticket'}
            </CardTitle>
            {selectedTicket && (
              <CardDescription>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {selectedTicket.user_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {selectedTicket.user_email}
                  </span>
                </div>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {selectedTicket ? (
              <div className="space-y-4">
                {/* Messages */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {selectedTicket.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg ${
                        msg.from === 'admin'
                          ? 'bg-blue-50 ml-8'
                          : 'bg-gray-50 mr-8'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {msg.from === 'admin' ? 'Soporte' : selectedTicket.user_name}
                        </span>
                        <span className="text-xs text-gray-400">{msg.time}</span>
                      </div>
                      <p className="text-gray-700">{msg.content}</p>
                    </div>
                  ))}
                </div>

                {/* Reply */}
                {selectedTicket.status !== 'resolved' && (
                  <div className="border-t pt-4">
                    <Textarea
                      placeholder="Escribe tu respuesta..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Marcar Resuelto
                        </Button>
                      </div>
                      <Button onClick={handleSendReply}>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Selecciona un ticket para ver los detalles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
