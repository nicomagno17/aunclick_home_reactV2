"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  Users,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Lock,
  Unlock
} from "lucide-react";
import { RateLimiter } from "@/lib/rate-limiting";

interface SecurityStats {
  login: {
    totalRequests: number;
    blockedRequests: number;
    uniqueIdentifiers: number;
    topIdentifiers: Array<{ identifier: string; count: number }>;
  };
  biometric: {
    totalRequests: number;
    blockedRequests: number;
    uniqueIdentifiers: number;
    topIdentifiers: Array<{ identifier: string; count: number }>;
  };
  passwordReset: {
    totalRequests: number;
    blockedRequests: number;
    uniqueIdentifiers: number;
    topIdentifiers: Array<{ identifier: string; count: number }>;
  };
  api: {
    totalRequests: number;
    blockedRequests: number;
    uniqueIdentifiers: number;
    topIdentifiers: Array<{ identifier: string; count: number }>;
  };
}

interface SecurityEvent {
  id: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  createdAt: string;
  metadata?: any;
}

export default function SecurityDashboard() {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadSecurityData = async () => {
    try {
      setLoading(true);

      // Cargar estadísticas de rate limiting
      const [loginStats, biometricStats, passwordResetStats, apiStats] = await Promise.all([
        RateLimiter.getStats('login', '24h'),
        RateLimiter.getStats('biometric', '24h'),
        RateLimiter.getStats('passwordReset', '24h'),
        RateLimiter.getStats('api', '1h'),
      ]);

      setStats({
        login: loginStats,
        biometric: biometricStats,
        passwordReset: passwordResetStats,
        api: apiStats,
      });

      // Cargar eventos recientes de seguridad (simulado)
      // En producción, esto vendría de una API
      setRecentEvents([
        {
          id: '1',
          eventType: 'login_failure',
          severity: 'medium',
          description: 'Múltiples intentos de login fallidos desde IP 192.168.1.100',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
          metadata: { ip: '192.168.1.100', attempts: 5 }
        },
        {
          id: '2',
          eventType: 'rate_limit_exceeded',
          severity: 'high',
          description: 'Rate limit excedido para endpoint /api/auth/signin',
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
          metadata: { endpoint: '/api/auth/signin', identifier: 'user@example.com' }
        },
        {
          id: '3',
          eventType: 'biometric_registration',
          severity: 'low',
          description: 'Nuevo dispositivo biométrico registrado',
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
          metadata: { userId: 123, deviceType: 'fingerprint' }
        }
      ]);

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityData();

    // Actualizar cada 5 minutos
    const interval = setInterval(loadSecurityData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Shield className="w-4 h-4" />;
      case 'low': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Dashboard de Seguridad</h2>
            <p className="text-gray-400">Monitoreo de amenazas y rate limiting</p>
          </div>
          <Button disabled>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Cargando...
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard de Seguridad</h2>
          <p className="text-gray-400">
            Monitoreo de amenazas y rate limiting
            {lastUpdate && (
              <span className="ml-2 text-xs">
                • Última actualización: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <Button onClick={loadSecurityData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Alertas de Seguridad */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Login Attempts */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Intentos de Login (24h)
              </CardTitle>
              <Lock className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatNumber(stats.login.totalRequests)}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>{stats.login.blockedRequests} bloqueados</span>
                {stats.login.blockedRequests > 0 && (
                  <TrendingUp className="w-3 h-3 text-red-400" />
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.login.uniqueIdentifiers} IPs únicas
              </div>
            </CardContent>
          </Card>

          {/* Biometric Auth */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Autenticación Biométrica (24h)
              </CardTitle>
              <Shield className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatNumber(stats.biometric.totalRequests)}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>{stats.biometric.blockedRequests} bloqueados</span>
                {stats.biometric.blockedRequests > 0 && (
                  <TrendingUp className="w-3 h-3 text-red-400" />
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.biometric.uniqueIdentifiers} usuarios únicos
              </div>
            </CardContent>
          </Card>

          {/* Password Reset */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Restablecer Contraseña (24h)
              </CardTitle>
              <RefreshCw className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatNumber(stats.passwordReset.totalRequests)}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>{stats.passwordReset.blockedRequests} bloqueados</span>
                {stats.passwordReset.blockedRequests > 0 && (
                  <TrendingUp className="w-3 h-3 text-red-400" />
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.passwordReset.uniqueIdentifiers} emails únicos
              </div>
            </CardContent>
          </Card>

          {/* API Requests */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Solicitudes API (1h)
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatNumber(stats.api.totalRequests)}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>{stats.api.blockedRequests} bloqueados</span>
                {stats.api.blockedRequests > 0 && (
                  <TrendingUp className="w-3 h-3 text-red-400" />
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.api.uniqueIdentifiers} IPs únicas
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Identifiers por Categoría */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top IPs con más intentos de login */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Top IPs - Intentos de Login</CardTitle>
              <CardDescription className="text-gray-400">
                IPs con más actividad en las últimas 24 horas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.login.topIdentifiers.slice(0, 5).map((item, index) => (
                  <div key={item.identifier} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <span className="text-sm text-gray-300 font-mono">
                        {item.identifier.length > 15 ? `${item.identifier.substring(0, 15)}...` : item.identifier}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.count}
                    </Badge>
                  </div>
                ))}
                {stats.login.topIdentifiers.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay actividad reciente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Eventos de Seguridad Recientes */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">Eventos de Seguridad Recientes</CardTitle>
              <CardDescription className="text-gray-400">
                Últimos eventos de seguridad detectados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-700/50">
                    <div className={`p-1 rounded-full ${getSeverityColor(event.severity)}`}>
                      {getSeverityIcon(event.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        {event.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getSeverityColor(event.severity)} border-current`}
                        >
                          {event.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(event.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {recentEvents.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay eventos recientes
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alertas de Seguridad */}
      {stats && (stats.login.blockedRequests > 0 || stats.api.blockedRequests > 0) && (
        <Alert className="border-orange-500 bg-orange-500/10">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-200">
            <strong>Actividad Sospechosa Detectada:</strong> Se han bloqueado {stats.login.blockedRequests + stats.api.blockedRequests} solicitudes
            en las últimas 24 horas debido a violaciones de rate limiting. Revisa los logs de seguridad para más detalles.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}