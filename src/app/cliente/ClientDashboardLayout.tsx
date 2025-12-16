'use client';

import {
  LayoutDashboard,
  FileText,
  Search,
  MessageSquare,
  CreditCard,
  Star,
  User,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import type { Profile } from '@/types/database';

const clientNavItems = [
  { label: 'Dashboard', href: '/cliente', icon: LayoutDashboard },
  { label: 'Mis Casos', href: '/cliente/casos', icon: FileText, badge: 3 },
  { label: 'Buscar Perito', href: '/cliente/buscar', icon: Search },
  { label: 'Mensajes', href: '/cliente/mensajes', icon: MessageSquare, badge: 2 },
  { label: 'Pagos', href: '/cliente/pagos', icon: CreditCard },
  { label: 'Calificaciones', href: '/cliente/calificaciones', icon: Star },
  { label: 'Mi Perfil', href: '/cliente/perfil', icon: User },
  { label: 'Configuración', href: '/cliente/configuracion', icon: Settings },
  { label: 'Ayuda', href: '/cliente/ayuda', icon: HelpCircle },
];

interface ClientDashboardLayoutProps {
  children: React.ReactNode;
  profile: Profile;
}

export function ClientDashboardLayout({ children, profile }: ClientDashboardLayoutProps) {
  return (
    <DashboardLayout profile={profile} navItems={clientNavItems}>
      {children}
    </DashboardLayout>
  );
}
