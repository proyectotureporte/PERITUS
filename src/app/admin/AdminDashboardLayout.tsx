'use client';

import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  CreditCard,
  AlertTriangle,
  BarChart3,
  Settings,
  HelpCircle,
  UserCheck,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import type { Profile } from '@/types/database';

const adminNavItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Usuarios', href: '/admin/usuarios', icon: Users },
  { label: 'Verificaciones', href: '/admin/verificaciones', icon: UserCheck, badge: 5 },
  { label: 'Casos', href: '/admin/casos', icon: FileText },
  { label: 'Pagos', href: '/admin/pagos', icon: CreditCard },
  { label: 'Alertas', href: '/admin/alertas', icon: AlertTriangle, badge: 3 },
  { label: 'Auditoría', href: '/admin/auditoria', icon: Shield },
  { label: 'Reportes', href: '/admin/reportes', icon: BarChart3 },
  { label: 'Configuración', href: '/admin/configuracion', icon: Settings },
  { label: 'Soporte', href: '/admin/soporte', icon: HelpCircle },
];

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  profile: Profile;
}

export function AdminDashboardLayout({ children, profile }: AdminDashboardLayoutProps) {
  return (
    <DashboardLayout profile={profile} navItems={adminNavItems}>
      {children}
    </DashboardLayout>
  );
}
