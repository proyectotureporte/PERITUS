'use client';

import { useState } from 'react';
import { Bell, Shield, Mail, Smartphone, Globe, Save, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function ConfiguracionPeritoPage() {
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState({
    is_available: true,
    response_time: '24',
    vacation_mode: false,
    vacation_start: '',
    vacation_end: '',
  });
  const [notifications, setNotifications] = useState({
    email_new_cases: true,
    email_messages: true,
    email_payments: true,
    email_deadlines: true,
    push_new_cases: true,
    push_messages: true,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">
          Administra tus preferencias y disponibilidad
        </p>
      </div>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Disponibilidad
          </CardTitle>
          <CardDescription>
            Configura tu disponibilidad para recibir nuevos casos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Estado de disponibilidad</Label>
              <p className="text-sm text-gray-500 mt-1">
                Indica si estás disponible para recibir nuevos casos
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={availability.is_available}
                onChange={(e) => setAvailability(prev => ({ ...prev, is_available: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tiempo de respuesta prometido
            </Label>
            <select
              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              value={availability.response_time}
              onChange={(e) => setAvailability(prev => ({ ...prev, response_time: e.target.value }))}
            >
              <option value="12">12 horas</option>
              <option value="24">24 horas</option>
              <option value="48">48 horas</option>
              <option value="72">72 horas</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Este tiempo se muestra a los clientes en tu perfil
            </p>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label>Modo vacaciones</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Pausa temporalmente la recepción de nuevos casos
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability.vacation_mode}
                  onChange={(e) => setAvailability(prev => ({ ...prev, vacation_mode: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
              </label>
            </div>
            {availability.vacation_mode && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha inicio</Label>
                  <Input
                    type="date"
                    value={availability.vacation_start}
                    onChange={(e) => setAvailability(prev => ({ ...prev, vacation_start: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Fecha fin</Label>
                  <Input
                    type="date"
                    value={availability.vacation_end}
                    onChange={(e) => setAvailability(prev => ({ ...prev, vacation_end: e.target.value }))}
                    className="mt-2"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
              Email
            </h4>
            <div className="space-y-4">
              {[
                { key: 'email_new_cases', label: 'Nuevas solicitudes de casos' },
                { key: 'email_messages', label: 'Nuevos mensajes' },
                { key: 'email_payments', label: 'Pagos recibidos' },
                { key: 'email_deadlines', label: 'Recordatorios de fechas límite' },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={notifications[item.key as keyof typeof notifications]}
                    onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Push
            </h4>
            <div className="space-y-4">
              {[
                { key: 'push_new_cases', label: 'Nuevas solicitudes de casos' },
                { key: 'push_messages', label: 'Nuevos mensajes' },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={notifications[item.key as keyof typeof notifications]}
                    onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              ))}
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
            Protege tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Cambiar Contraseña</Label>
            <div className="grid gap-4 mt-2">
              <Input type="password" placeholder="Contraseña actual" />
              <Input type="password" placeholder="Nueva contraseña" />
              <Input type="password" placeholder="Confirmar nueva contraseña" />
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Autenticación de dos factores</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Añade una capa extra de seguridad
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
