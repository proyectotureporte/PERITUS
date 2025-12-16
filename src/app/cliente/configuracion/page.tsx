'use client';

import { useState } from 'react';
import { Bell, Shield, Mail, Smartphone, Globe, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function ConfiguracionPage() {
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    email_cases: true,
    email_messages: true,
    email_payments: true,
    push_cases: false,
    push_messages: true,
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">
          Administra tus preferencias y configuración de cuenta
        </p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
          <CardDescription>
            Configura cómo quieres recibir notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Notificaciones por Email
            </h4>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Actualizaciones de casos</span>
                <input
                  type="checkbox"
                  checked={notifications.email_cases}
                  onChange={(e) => setNotifications(prev => ({ ...prev, email_cases: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Nuevos mensajes</span>
                <input
                  type="checkbox"
                  checked={notifications.email_messages}
                  onChange={(e) => setNotifications(prev => ({ ...prev, email_messages: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Confirmaciones de pago</span>
                <input
                  type="checkbox"
                  checked={notifications.email_payments}
                  onChange={(e) => setNotifications(prev => ({ ...prev, email_payments: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Notificaciones Push
            </h4>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Actualizaciones de casos</span>
                <input
                  type="checkbox"
                  checked={notifications.push_cases}
                  onChange={(e) => setNotifications(prev => ({ ...prev, push_cases: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Nuevos mensajes</span>
                <input
                  type="checkbox"
                  checked={notifications.push_messages}
                  onChange={(e) => setNotifications(prev => ({ ...prev, push_messages: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Seguridad
          </CardTitle>
          <CardDescription>
            Protege tu cuenta con configuraciones de seguridad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="current-password">Cambiar Contraseña</Label>
            <div className="grid gap-4 mt-2">
              <Input
                id="current-password"
                type="password"
                placeholder="Contraseña actual"
              />
              <Input
                type="password"
                placeholder="Nueva contraseña"
              />
              <Input
                type="password"
                placeholder="Confirmar nueva contraseña"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Autenticación de dos factores</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Añade una capa extra de seguridad a tu cuenta
                </p>
              </div>
              <Button variant="outline">Configurar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Preferencias
          </CardTitle>
          <CardDescription>
            Personaliza tu experiencia en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Idioma</Label>
            <select className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <Label>Zona horaria</Label>
            <select className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="America/Bogota">Bogotá (GMT-5)</option>
              <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
              <option value="America/Lima">Lima (GMT-5)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving} className="gap-2">
          <Save className="h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
