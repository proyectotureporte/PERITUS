'use client';

import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  MessageSquare,
  CreditCard,
  Star,
  User,
  Settings,
  HelpCircle,
  BookOpen,
  Shield,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import type { Profile } from '@/types/database';

const expertNavItems = [
  { label: 'Dashboard', href: '/perito', icon: LayoutDashboard },
  { label: 'Mis Casos', href: '/perito/casos', icon: FileText, badge: 2 },
  { label: 'Solicitudes', href: '/perito/solicitudes', icon: ClipboardList, badge: 3 },
  { label: 'Mensajes', href: '/perito/mensajes', icon: MessageSquare, badge: 1 },
  { label: 'Mis Ingresos', href: '/perito/ingresos', icon: CreditCard },
  { label: 'Reseñas', href: '/perito/resenas', icon: Star },
  { label: 'Recursos', href: '/perito/recursos', icon: BookOpen },
  { label: 'Mi Perfil', href: '/perito/perfil', icon: User },
  { label: 'Verificación', href: '/perito/verificacion', icon: Shield },
  { label: 'Configuración', href: '/perito/configuracion', icon: Settings },
  { label: 'Ayuda', href: '/perito/ayuda', icon: HelpCircle },
];

interface ExpertDashboardLayoutProps {
  children: React.ReactNode;
  profile: Profile;
}

export function ExpertDashboardLayout({ children, profile }: ExpertDashboardLayoutProps) {
  return (
    <DashboardLayout profile={profile} navItems={expertNavItems}>
      {children}
    </DashboardLayout>
  );
}
