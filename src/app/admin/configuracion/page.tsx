'use client';

import { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  CreditCard,
  Mail,
  Globe,
  Database,
  Save,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function ConfiguracionPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-500 mt-1">
            Ajustes generales del sistema PERITUS
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Guardar Cambios
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Configuración General
            </CardTitle>
            <CardDescription>Ajustes básicos de la plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appName">Nombre de la Aplicación</Label>
              <Input id="appName" defaultValue="PERITUS" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appUrl">URL de la Aplicación</Label>
              <Input id="appUrl" defaultValue="https://peritus.co" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Email de Soporte</Label>
              <Input id="supportEmail" defaultValue="soporte@peritus.co" />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configuración de Email
            </CardTitle>
            <CardDescription>Ajustes del servicio de correo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromEmail">Email de Envío</Label>
              <Input id="fromEmail" defaultValue="noreply@peritus.co" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resendKey">Resend API Key</Label>
              <Input id="resendKey" type="password" defaultValue="••••••••••" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Estado del servicio</span>
              <Badge variant="success">Conectado</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Configuración de Pagos
            </CardTitle>
            <CardDescription>Ajustes de Wompi y pagos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wompiPublic">Wompi Public Key</Label>
              <Input id="wompiPublic" type="password" defaultValue="••••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wompiPrivate">Wompi Private Key</Label>
              <Input id="wompiPrivate" type="password" defaultValue="••••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platformFee">Comisión de Plataforma (%)</Label>
              <Input id="platformFee" type="number" defaultValue="10" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Estado de Wompi</span>
              <Badge variant="warning">Sandbox</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Configuración de Seguridad
            </CardTitle>
            <CardDescription>Ajustes de seguridad y privacidad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Verificación de Email</p>
                <p className="text-sm text-gray-500">Requerir verificación al registrarse</p>
              </div>
              <Badge variant="success">Activo</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">2FA para Admins</p>
                <p className="text-sm text-gray-500">Autenticación de dos factores</p>
              </div>
              <Badge variant="secondary">Opcional</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Detección Anti-Fraude</p>
                <p className="text-sm text-gray-500">Monitoreo de actividades sospechosas</p>
              </div>
              <Badge variant="success">Activo</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>Configuración de alertas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Nuevos Registros</p>
                <p className="text-sm text-gray-500">Notificar al admin sobre nuevos usuarios</p>
              </div>
              <Badge variant="success">Activo</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Verificaciones Pendientes</p>
                <p className="text-sm text-gray-500">Alertar sobre peritos por verificar</p>
              </div>
              <Badge variant="success">Activo</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Alertas de Seguridad</p>
                <p className="text-sm text-gray-500">Notificaciones de actividad sospechosa</p>
              </div>
              <Badge variant="success">Activo</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Database Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Base de Datos
            </CardTitle>
            <CardDescription>Información de Supabase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Proveedor</span>
              <Badge variant="outline">Supabase</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Región</span>
              <Badge variant="outline">South America</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Estado</span>
              <Badge variant="success">Conectado</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">RLS</span>
              <Badge variant="success">Habilitado</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
