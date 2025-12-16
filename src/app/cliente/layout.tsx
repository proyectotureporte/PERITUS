import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ClientDashboardLayout } from './ClientDashboardLayout';
import type { Profile } from '@/types/database';

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const typedProfile = profile as Profile | null;

  if (!typedProfile || (typedProfile.role !== 'cliente' && typedProfile.role !== 'admin')) {
    redirect('/');
  }

  return <ClientDashboardLayout profile={typedProfile}>{children}</ClientDashboardLayout>;
}
