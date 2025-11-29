"use client";

import { useState, useEffect, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle, Loader2, Eye, EyeOff } from "lucide-react";
import { analyzeUserForBots, useBotDetection, type UserBehavior } from "@/lib/bot-detection-client";
import { useToast } from "@/hooks/use-toast";

interface SmartCaptchaProps {
  onVerify: (token: string, riskAssessment: any) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  siteKey?: string;
  mode?: 'invisible' | 'visible';
  className?: string;
}

export default function SmartCaptcha({
  onVerify,
  onError,
  onExpire,
  siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001', // Test key
  mode = 'invisible',
  className = ""
}: SmartCaptchaProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [riskAssessment, setRiskAssessment] = useState<any>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [behaviorData, setBehaviorData] = useState<Partial<UserBehavior>>({});
  const [showDebug, setShowDebug] = useState(false);

  const captchaRef = useRef<HCaptcha>(null);
  const { toast } = useToast();
  const { analyzeBehavior } = useBotDetection();

  // Estado para tracking de comportamiento
  const [mouseMovements, setMouseMovements] = useState<Array<{x: number, y: number, timestamp: number}>>([]);
  const [keyboardEvents, setKeyboardEvents] = useState<Array<{key: string, timestamp: number, type: 'keydown' | 'keyup'}>>([]);
  const [scrollEvents, setScrollEvents] = useState<Array<{position: number, timestamp: number}>>([]);
  const [startTime] = useState(Date.now());
  const [fieldFocusTime, setFieldFocusTime] = useState<Record<string, number>>({});

  useEffect(() => {
    // Iniciar análisis de comportamiento
    analyzeUserBehavior();

    // Configurar event listeners
    setupBehaviorTracking();

    return () => {
      cleanupBehaviorTracking();
    };
  }, []);

  const setupBehaviorTracking = () => {
    // Mouse movements
    const handleMouseMove = (e: MouseEvent) => {
      setMouseMovements(prev => [...prev.slice(-49), { // Keep last 50 movements
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      }]);
    };

    // Keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeyboardEvents(prev => [...prev.slice(-49), {
        key: e.key,
        timestamp: Date.now(),
        type: 'keydown'
      }]);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeyboardEvents(prev => [...prev.slice(-49), {
        key: e.key,
        timestamp: Date.now(),
        type: 'keyup'
      }]);
    };

    // Scroll events
    const handleScroll = () => {
      setScrollEvents(prev => [...prev.slice(-19), { // Keep last 20 scroll events
        position: window.scrollY,
        timestamp: Date.now()
      }]);
    };

    // Focus events para campos
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.id) {
        setFieldFocusTime(prev => ({
          ...prev,
          [target.id]: Date.now()
        }));
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.id && fieldFocusTime[target.id]) {
        const focusStart = fieldFocusTime[target.id];
        const duration = Date.now() - focusStart;
        setFieldFocusTime(prev => ({
          ...prev,
          [target.id]: duration
        }));
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  };

  const cleanupBehaviorTracking = () => {
    // Los event listeners se limpian en el return del useEffect
  };

  const analyzeUserBehavior = async () => {
    try {
      // Recopilar datos de comportamiento actuales
      const currentBehavior: UserBehavior = {
        ip: 'unknown', // Se obtiene del servidor
        userAgent: navigator.userAgent,
        timestamp: new Date(),
        timeOnPage: Date.now() - startTime,
        mouseMovements,
        keyboardEvents,
        scrollEvents,
        typingSpeed: calculateTypingSpeed(),
        fieldFocusTime,
        pasteEvents: 0, // Se cuenta en el formulario
        formCompletionTime: 0, // Se calcula cuando se envía
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
        touchSupport: 'ontouchstart' in window,
        previousVisits: 0, // Se obtiene del localStorage o API
        sessionId: undefined, // Se obtiene del contexto de sesión
        timeSinceLastVisit: undefined, // Se calcula del localStorage
      };

      // Analizar con el detector de bots
      const result = await analyzeBehavior(currentBehavior);
      setRiskAssessment(result);

      // Decidir si mostrar captcha basado en el riesgo
      if (result.recommendedAction === 'block') {
        onError?.('Acceso bloqueado por actividad sospechosa');
        toast({
          title: "Acceso restringido",
          description: "Se detectó actividad sospechosa. Inténtalo de nuevo más tarde.",
          variant: "destructive",
        });
        return;
      }

      if (result.recommendedAction === 'challenge') {
        setShowCaptcha(true);
        toast({
          title: "Verificación requerida",
          description: "Por favor completa la verificación de seguridad.",
          variant: "default",
        });
      } else {
        // Usuario de bajo riesgo - permitir sin captcha
        setIsVerified(true);
        onVerify('low-risk-user', result);
      }

    } catch (error) {
      console.error('Error analyzing user behavior:', error);
      // En caso de error, mostrar captcha como fallback
      setShowCaptcha(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateTypingSpeed = (): number => {
    const keydownEvents = keyboardEvents.filter(e => e.type === 'keydown' && e.key.length === 1);
    const timeSpan = Date.now() - startTime;
    const minutes = timeSpan / (1000 * 60);
    return keydownEvents.length / minutes;
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    setIsVerified(true);

    toast({
      title: "Verificación completada",
      description: "Gracias por verificar tu identidad.",
    });

    onVerify(token, riskAssessment);
  };

  const handleCaptchaError = (error: string) => {
    console.error('Captcha error:', error);
    onError?.(error);

    toast({
      title: "Error de verificación",
      description: "Hubo un problema con la verificación. Inténtalo de nuevo.",
      variant: "destructive",
    });
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
    setIsVerified(false);
    onExpire?.();

    toast({
      title: "Verificación expirada",
      description: "La verificación ha expirado. Por favor verifica de nuevo.",
      variant: "default",
    });
  };

  const resetCaptcha = () => {
    setCaptchaToken(null);
    setIsVerified(false);
    captchaRef.current?.resetCaptcha();
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="w-3 h-3" />;
      case 'medium':
      case 'high': return <AlertTriangle className="w-3 h-3" />;
      case 'critical': return <Shield className="w-3 h-3" />;
      default: return <Shield className="w-3 h-3" />;
    }
  };

  if (isAnalyzing) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Analizando comportamiento...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Assessment Results */}
      {riskAssessment && (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2">
            {getRiskIcon(riskAssessment.riskLevel)}
            <span className="text-sm font-medium">Nivel de riesgo:</span>
            <Badge className={`${getRiskBadgeColor(riskAssessment.riskLevel)} text-white`}>
              {riskAssessment.riskLevel.toUpperCase()}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
            className="text-xs"
          >
            {showDebug ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
            Debug
          </Button>
        </div>
      )}

      {/* Debug Information */}
      {showDebug && riskAssessment && (
        <Alert className="text-xs">
          <AlertDescription>
            <div className="space-y-2">
              <div><strong>Score:</strong> {riskAssessment.score}/100</div>
              <div><strong>Confidence:</strong> {(riskAssessment.confidence * 100).toFixed(1)}%</div>
              <div><strong>Is Bot:</strong> {riskAssessment.isBot ? 'Sí' : 'No'}</div>
              <div><strong>Reasons:</strong></div>
              <ul className="list-disc list-inside ml-4">
                {riskAssessment.reasons.map((reason: string, index: number) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
              <div><strong>Recommended Action:</strong> {riskAssessment.recommendedAction}</div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Captcha Widget */}
      {showCaptcha && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Verificación de seguridad requerida
            </span>
          </div>

          <HCaptcha
            ref={captchaRef}
            sitekey={siteKey}
            onVerify={handleCaptchaVerify}
            onError={handleCaptchaError}
            onExpire={handleCaptchaExpire}
            size={mode === 'invisible' ? 'invisible' : 'normal'}
            theme="auto"
          />

          {isVerified && (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Verificación completada</span>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetCaptcha}
              disabled={!isVerified}
            >
              Reiniciar
            </Button>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {!showCaptcha && !isAnalyzing && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Análisis completado. {isVerified ? 'Verificación exitosa.' : 'No se requiere verificación adicional.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}