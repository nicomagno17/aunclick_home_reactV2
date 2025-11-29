// Client-side bot detection utilities - NO server imports allowed
"use client";

// Tipos para análisis de comportamiento (client-safe)
export interface UserBehavior {
  // Información básica
  ip: string;
  userAgent: string;
  timestamp: Date;

  // Comportamiento de navegación
  timeOnPage: number;
  mouseMovements: Array<{ x: number; y: number; timestamp: number }>;
  keyboardEvents: Array<{ key: string; timestamp: number; type: 'keydown' | 'keyup' }>;
  scrollEvents: Array<{ position: number; timestamp: number }>;

  // Comportamiento de formulario
  typingSpeed: number; // caracteres por minuto
  fieldFocusTime: Record<string, number>; // tiempo en cada campo
  pasteEvents: number; // número de eventos de pegar
  formCompletionTime: number; // tiempo total para completar

  // Información del dispositivo
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  touchSupport: boolean;

  // Información de sesión
  sessionId?: string;
  previousVisits: number;
  timeSinceLastVisit?: number;
}

export interface BotDetectionResult {
  isBot: boolean;
  confidence: number; // 0-1
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  recommendedAction: 'allow' | 'challenge' | 'block';
  score: number; // 0-100, donde > 70 es bot probable
}

// Pesos para diferentes factores de detección
const DETECTION_WEIGHTS = {
  // Comportamiento humano normal vs bot
  typingSpeed: 0.15, // Bots tipean muy rápido o muy lento
  mouseMovement: 0.20, // Bots tienen movimientos de mouse predecibles
  timeOnPage: 0.10, // Bots pasan poco tiempo en página
  formCompletion: 0.15, // Bots completan formularios instantáneamente

  // Anomalías técnicas
  userAgent: 0.10, // User agents sospechosos
  automationTools: 0.10, // Herramientas de automatización detectadas
  headlessBrowser: 0.10, // Navegadores headless

  // Patrón de comportamiento
  timingPatterns: 0.05, // Patrones temporales sospechosos
  interactionQuality: 0.05, // Calidad de interacciones
};

// Lista de user agents conocidos de bots
const BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'scraper', 'selenium', 'chrome-headless',
  'phantomjs', 'nightmare', 'puppeteer', 'playwright', 'webdriver',
  'headless', 'automation', 'test', 'crawl', 'scrap', 'monitor'
];

// Lista de herramientas de automatización conocidas
const AUTOMATION_TOOLS = [
  'selenium', 'webdriver', 'puppeteer', 'playwright', 'cypress',
  'testcafe', 'nightwatch', 'protractor', 'webdriverio'
];

export class BotDetectorClient {
  /**
   * Analiza el comportamiento del usuario para detectar bots (client-side only)
   */
  static analyzeBehavior(behavior: UserBehavior): BotDetectionResult {
    const reasons: string[] = [];
    let score = 0;

    // 1. Análisis de velocidad de tipeo
    const typingScore = this.analyzeTypingSpeed(behavior.typingSpeed);
    score += typingScore.score * DETECTION_WEIGHTS.typingSpeed;
    if (typingScore.reason) reasons.push(typingScore.reason);

    // 2. Análisis de movimientos del mouse
    const mouseScore = this.analyzeMouseMovement(behavior.mouseMovements);
    score += mouseScore.score * DETECTION_WEIGHTS.mouseMovement;
    if (mouseScore.reason) reasons.push(mouseScore.reason);

    // 3. Análisis de tiempo en página
    const timeScore = this.analyzeTimeOnPage(behavior.timeOnPage);
    score += timeScore.score * DETECTION_WEIGHTS.timeOnPage;
    if (timeScore.reason) reasons.push(timeScore.reason);

    // 4. Análisis de completación de formulario
    const formScore = this.analyzeFormCompletion(behavior.formCompletionTime, behavior.pasteEvents);
    score += formScore.score * DETECTION_WEIGHTS.formCompletion;
    if (formScore.reason) reasons.push(formScore.reason);

    // 5. Análisis de User Agent
    const uaScore = this.analyzeUserAgent(behavior.userAgent);
    score += uaScore.score * DETECTION_WEIGHTS.userAgent;
    if (uaScore.reason) reasons.push(uaScore.reason);

    // 6. Detección de herramientas de automatización
    const automationScore = this.detectAutomationTools(behavior.userAgent, behavior.platform);
    score += automationScore.score * DETECTION_WEIGHTS.automationTools;
    if (automationScore.reason) reasons.push(automationScore.reason);

    // 7. Detección de navegadores headless
    const headlessScore = this.detectHeadlessBrowser(behavior);
    score += headlessScore.score * DETECTION_WEIGHTS.headlessBrowser;
    if (headlessScore.reason) reasons.push(headlessScore.reason);

    // 8. Análisis de patrones temporales
    const timingScore = this.analyzeTimingPatterns(behavior);
    score += timingScore.score * DETECTION_WEIGHTS.timingPatterns;
    if (timingScore.reason) reasons.push(timingScore.reason);

    // 9. Calidad de interacciones
    const qualityScore = this.analyzeInteractionQuality(behavior);
    score += qualityScore.score * DETECTION_WEIGHTS.interactionQuality;
    if (qualityScore.reason) reasons.push(qualityScore.reason);

    // Normalizar score a 0-100
    score = Math.min(100, Math.max(0, score));

    // Determinar nivel de riesgo y acción recomendada
    const riskLevel = this.calculateRiskLevel(score);
    const recommendedAction = this.getRecommendedAction(score, riskLevel);

    return {
      isBot: score > 70,
      confidence: score / 100,
      riskLevel,
      reasons,
      recommendedAction,
      score
    };
  }

  private static analyzeTypingSpeed(speed: number): { score: number; reason?: string } {
    // Velocidad normal humana: 40-60 caracteres por minuto
    // Bots: muy rápido (> 200) o muy lento (< 10)
    if (speed > 200) {
      return { score: 80, reason: 'Velocidad de tipeo anormalmente alta' };
    }
    if (speed < 10) {
      return { score: 60, reason: 'Velocidad de tipeo anormalmente baja' };
    }
    if (speed > 100) {
      return { score: 40, reason: 'Velocidad de tipeo elevada' };
    }
    return { score: 0 };
  }

  private static analyzeMouseMovement(movements: Array<{ x: number; y: number; timestamp: number }>): { score: number; reason?: string } {
    if (movements.length < 3) {
      return { score: 70, reason: 'Muy pocos movimientos del mouse' };
    }

    // Calcular variabilidad en movimientos
    const distances = [];
    for (let i = 1; i < movements.length; i++) {
      const dx = movements[i].x - movements[i-1].x;
      const dy = movements[i].y - movements[i-1].y;
      distances.push(Math.sqrt(dx*dx + dy*dy));
    }

    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    const variance = distances.reduce((sum, dist) => sum + Math.pow(dist - avgDistance, 2), 0) / distances.length;

    // Movimientos muy predecibles (baja varianza) sugieren bot
    if (variance < 10) {
      return { score: 60, reason: 'Movimientos del mouse muy predecibles' };
    }

    return { score: 0 };
  }

  private static analyzeTimeOnPage(timeMs: number): { score: number; reason?: string } {
    const timeSeconds = timeMs / 1000;

    if (timeSeconds < 2) {
      return { score: 90, reason: 'Tiempo en página extremadamente corto' };
    }
    if (timeSeconds < 5) {
      return { score: 70, reason: 'Tiempo en página muy corto' };
    }
    if (timeSeconds < 10) {
      return { score: 40, reason: 'Tiempo en página corto' };
    }

    return { score: 0 };
  }

  private static analyzeFormCompletion(timeMs: number, pasteEvents: number): { score: number; reason?: string } {
    const timeSeconds = timeMs / 1000;

    // Formulario completado en menos de 1 segundo
    if (timeSeconds < 1) {
      return { score: 85, reason: 'Formulario completado instantáneamente' };
    }

    // Muchos eventos de pegar
    if (pasteEvents > 3) {
      return { score: 60, reason: 'Múltiples eventos de pegar detectados' };
    }

    return { score: 0 };
  }

  private static analyzeUserAgent(userAgent: string): { score: number; reason?: string } {
    const ua = userAgent.toLowerCase();

    for (const botIndicator of BOT_USER_AGENTS) {
      if (ua.includes(botIndicator)) {
        return { score: 100, reason: `User agent contiene indicador de bot: ${botIndicator}` };
      }
    }

    // User agents muy cortos o genéricos
    if (ua.length < 20) {
      return { score: 50, reason: 'User agent anormalmente corto' };
    }

    return { score: 0 };
  }

  private static detectAutomationTools(userAgent: string, platform: string): { score: number; reason?: string } {
    const ua = userAgent.toLowerCase();

    for (const tool of AUTOMATION_TOOLS) {
      if (ua.includes(tool)) {
        return { score: 100, reason: `Herramienta de automatización detectada: ${tool}` };
      }
    }

    // Verificar propiedades del navegador que indican automatización
    if (typeof window !== 'undefined') {
      // Verificar si hay propiedades de webdriver
      if ((window as any).navigator.webdriver) {
        return { score: 100, reason: 'Propiedad webdriver detectada' };
      }

      // Verificar plugins (bots suelen tener pocos)
      if (navigator.plugins && navigator.plugins.length === 0) {
        return { score: 60, reason: 'No se detectaron plugins del navegador' };
      }
    }

    return { score: 0 };
  }

  private static detectHeadlessBrowser(behavior: UserBehavior): { score: number; reason?: string } {
    if (typeof window === 'undefined') return { score: 0 };

    // Verificar propiedades que indican navegador headless
    const navigator = window.navigator as any;

    if (navigator.webdriver) {
      return { score: 100, reason: 'Navegador headless detectado (webdriver)' };
    }

    // Chrome headless tiene ciertas características
    if (navigator.plugins && navigator.plugins.length === 0) {
      return { score: 70, reason: 'Características de navegador headless detectadas' };
    }

    // Verificar si hay acceso a chrome object (solo en Chrome no-headless)
    if (!(window as any).chrome) {
      return { score: 40, reason: 'Falta objeto chrome (posible headless)' };
    }

    return { score: 0 };
  }

  private static analyzeTimingPatterns(behavior: UserBehavior): { score: number; reason?: string } {
    // Verificar si todos los eventos ocurren en intervalos exactos
    const timestamps = [
      ...behavior.mouseMovements.map(m => m.timestamp),
      ...behavior.keyboardEvents.map(k => k.timestamp),
      ...behavior.scrollEvents.map(s => s.timestamp)
    ].sort((a, b) => a - b);

    if (timestamps.length < 3) return { score: 0 };

    // Calcular intervalos entre eventos
    const intervals = [];
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i-1]);
    }

    // Verificar si los intervalos son muy regulares (patrón de bot)
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;

    // Baja varianza indica timing muy regular (sospechoso)
    if (variance < 10 && avgInterval < 100) {
      return { score: 50, reason: 'Patrones temporales muy regulares detectados' };
    }

    return { score: 0 };
  }

  private static analyzeInteractionQuality(behavior: UserBehavior): { score: number; reason?: string } {
    // Verificar calidad de interacciones humanas

    // Pocos movimientos del mouse pero muchos eventos de teclado
    if (behavior.mouseMovements.length < 5 && behavior.keyboardEvents.length > 20) {
      return { score: 40, reason: 'Desbalance entre movimientos de mouse y teclado' };
    }

    // No hay scroll pero hay interacción con formulario
    if (behavior.scrollEvents.length === 0 && behavior.formCompletionTime > 0) {
      return { score: 30, reason: 'Falta de interacción natural con la página' };
    }

    return { score: 0 };
  }

  private static calculateRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 90) return 'critical';
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  private static getRecommendedAction(score: number, riskLevel: string): 'allow' | 'challenge' | 'block' {
    if (riskLevel === 'critical' || score > 90) return 'block';
    if (riskLevel === 'high' || score > 70) return 'challenge';
    if (riskLevel === 'medium' || score > 40) return 'challenge';
    return 'allow';
  }
}

// Función de conveniencia para análisis rápido
export const analyzeUserForBots = (behavior: UserBehavior) =>
  BotDetectorClient.analyzeBehavior(behavior);

// Hook de React para detección de bots en componentes (client-side only)
export const useBotDetection = () => {
  const analyzeBehavior = (behavior: UserBehavior) => {
    return BotDetectorClient.analyzeBehavior(behavior);
  };

  return { analyzeBehavior };
};