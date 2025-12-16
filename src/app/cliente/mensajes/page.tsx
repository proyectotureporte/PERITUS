import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  MessageSquare,
  User,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';

interface ChatRoom {
  id: string;
  case_id: string;
  created_at: string;
  updated_at: string;
  cases: {
    case_number: string;
    title: string;
    status: string;
    expert_profiles: {
      profiles: { full_name: string } | null;
    } | null;
  } | null;
  lastMessage?: {
    content: string;
    created_at: string;
    is_read: boolean;
  };
}

async function getChatRooms() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get client profile
  const { data: clientProfileData } = await supabase
    .from('client_profiles')
    .select('id')
    .eq('profile_id', user.id)
    .single();

  const clientProfile = clientProfileData as { id: string } | null;
  if (!clientProfile) return [];

  // Get chat rooms for cases where user is the client
  const { data: roomsData } = await supabase
    .from('chat_rooms')
    .select(`
      *,
      cases!inner (
        case_number,
        title,
        status,
        client_id,
        expert_profiles (
          profiles (full_name)
        )
      )
    `)
    .eq('cases.client_id', clientProfile.id)
    .order('updated_at', { ascending: false });

  interface RoomData {
    id: string;
    updated_at: string;
    cases: {
      case_number: string;
      title: string;
      status: string;
      expert_profiles: { profiles: { full_name: string } | null } | null;
    };
  }
  const rooms = (roomsData || []) as RoomData[];
  if (!rooms.length) return [];

  // Get last message for each room
  const roomsWithMessages = await Promise.all(
    rooms.map(async (room) => {
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('content, created_at, is_read')
        .eq('room_id', room.id)
        .order('created_at', { ascending: false })
        .limit(1);

      return {
        ...room,
        lastMessage: messages?.[0] || null,
      };
    })
  );

  return roomsWithMessages as unknown as ChatRoom[];
}

export default async function MensajesPage() {
  const rooms = await getChatRooms();

  const unreadCount = rooms.filter((r) => r.lastMessage && !r.lastMessage.is_read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
        <p className="text-gray-500 mt-1">
          Comunicación con los peritos de tus casos
        </p>
      </div>

      {unreadCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <p className="text-blue-700">
            Tienes <strong>{unreadCount}</strong> conversaciones sin leer
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Conversaciones</CardTitle>
          <CardDescription>Todas tus conversaciones activas</CardDescription>
        </CardHeader>
        <CardContent>
          {rooms.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tienes conversaciones activas</p>
              <p className="text-sm text-gray-400 mt-1">
                Las conversaciones se crean cuando asignas un perito a un caso
              </p>
              <Link href="/cliente/casos/nuevo">
                <Button className="mt-4">Crear Nuevo Caso</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {rooms.map((room) => (
                <Link key={room.id} href={`/cliente/casos/${room.case_id}`}>
                  <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {room.cases?.expert_profiles?.profiles?.full_name || 'Perito'}
                            </p>
                            {room.lastMessage && !room.lastMessage.is_read && (
                              <Badge variant="default" className="text-xs">Nuevo</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {room.cases?.case_number} - {room.cases?.title}
                          </p>
                          {room.lastMessage && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                              {room.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {room.lastMessage && (
                          <p className="text-xs text-gray-400">
                            {formatRelativeTime(room.lastMessage.created_at)}
                          </p>
                        )}
                        <Badge variant="outline" className="mt-1 text-xs">
                          {room.cases?.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
