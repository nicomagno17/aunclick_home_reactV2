import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aunclick - Marketplace",
  description: "Tu marketplace de confianza para productos y servicios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="fouc-safe">
      <head>
        {/* SCRIPT SEGURO ANTI-FOUC - Sin problemas de hidratación */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                console.log('🚀 ANTI-FOUC SEGURO INICIADO');
                
                // Solo ejecutar en el cliente
                if (typeof window === 'undefined') return;
                
                var html = document.documentElement;
                
                // 1. Detectar tema del sistema
                var isDarkMode = false;
                try {
                  isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                } catch(e) {
                  isDarkMode = false;
                }
                
                console.log('🌙 Tema detectado:', isDarkMode ? 'oscuro' : 'claro');
                
                // 2. Aplicar tema inmediatamente
                if (isDarkMode) {
                  html.classList.add('dark');
                } else {
                  html.classList.remove('dark');
                }
                
                // 3. Marcar como listo
                html.classList.add('fouc-ready');
                
                console.log('✅ FOUC protegido exitosamente');
                
              })();
            `,
          }}
        />
        
        {/* CSS ANTI-FOUC SEGURO */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Protección inicial suave */
              .fouc-safe {
                background: linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%);
              }
              
              .fouc-safe.dark {
                background: linear-gradient(135deg, #1e293b 0%, #581c87 100%);
              }
              
              /* Solo aplicar transiciones cuando esté listo */
              .fouc-ready * {
                transition: all 0.3s ease-in-out !important;
              }
              
              /* Suavizar cualquier parpadeo */
              @media (prefers-reduced-motion: reduce) {
                .fouc-ready * {
                  transition: none !important;
                }
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}