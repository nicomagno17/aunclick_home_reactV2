'use client'

import { useState, useEffect } from 'react'
import { BannerInfo } from '@/types/product'

interface StoreBannersProps {
  banner1: string | BannerInfo
  banner2: string | BannerInfo
  storeName: string
}

// Función helper para normalizar banners
const normalizeBanner = (banner: string | BannerInfo): BannerInfo => {
  if (typeof banner === 'string') {
    return { imagen: banner }
  }
  return banner
}

export function StoreBanners({ banner1, banner2, storeName }: StoreBannersProps) {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isForward, setIsForward] = useState(true)

  // Normalizar banners a BannerInfo
  const normalizedBanner1 = normalizeBanner(banner1)
  const normalizedBanner2 = normalizeBanner(banner2)
  const banners = [normalizedBanner1, normalizedBanner2]

  // Carrusel automático solo en móvil (ping-pong)
  useEffect(() => {
    const checkMobile = () => window.innerWidth < 768

    if (!checkMobile()) return

    const interval = setInterval(() => {
      setCurrentBanner(prev => {
        if (isForward) {
          if (prev >= banners.length - 1) {
            setIsForward(false)
            return prev - 1
          }
          return prev + 1
        } else {
          if (prev <= 0) {
            setIsForward(true)
            return prev + 1
          }
          return prev - 1
        }
      })
    }, 7000) // Cada 7 segundos

    return () => clearInterval(interval)
  }, [isForward, banners.length])

  // Componente para mostrar precios
  const PriceDisplay = ({ banner }: { banner: BannerInfo }) => {
    if (!banner.precioActual && !banner.precioAnterior) return null

    return (
      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-yellow-400/50">
        <div className="flex flex-col gap-1 items-end">
          {banner.precioActual && (
            <div className="flex items-baseline gap-2">
              <span className="text-yellow-400 font-bold text-xl md:text-2xl">
                ${banner.precioActual.toLocaleString('es-CL')}
              </span>
            </div>
          )}
          {banner.precioAnterior && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 line-through text-sm md:text-base">
                ${banner.precioAnterior.toLocaleString('es-CL')}
              </span>
              {banner.precioActual && banner.precioAnterior > banner.precioActual && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  {Math.round(((banner.precioAnterior - banner.precioActual) / banner.precioAnterior) * 100)}% OFF
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Móvil: Carrusel de 1 imagen */}
      <div className="w-full md:hidden px-2">
        <div className="relative w-full h-[200px] rounded-lg shadow-lg overflow-hidden">
          <img
            src={banners[currentBanner].imagen}
            alt={`${storeName} - Banner ${currentBanner + 1}`}
            className="w-full h-full object-fill transition-opacity duration-500"
          />

          {/* Precios opcionales */}
          <PriceDisplay banner={banners[currentBanner]} />

          {/* Indicadores */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentBanner
                    ? 'bg-yellow-400 w-6'
                    : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: 2 banners lado a lado */}
      <div className="hidden md:grid w-full grid-cols-2 gap-4 px-4">
        {/* Banner 1 */}
        <div className="relative w-full h-[250px] lg:h-[300px] rounded-lg shadow-lg overflow-hidden">
          <img
            src={normalizedBanner1.imagen}
            alt={`${storeName} - Banner 1`}
            className="w-full h-full object-fill hover:scale-105 transition-transform duration-500"
          />

          {/* Precios opcionales */}
          <PriceDisplay banner={normalizedBanner1} />
        </div>

        {/* Banner 2 */}
        <div className="relative w-full h-[250px] lg:h-[300px] rounded-lg shadow-lg overflow-hidden">
          <img
            src={normalizedBanner2.imagen}
            alt={`${storeName} - Banner 2`}
            className="w-full h-full object-fill hover:scale-105 transition-transform duration-500"
          />

          {/* Precios opcionales */}
          <PriceDisplay banner={normalizedBanner2} />
        </div>
      </div>
    </>
  )
}
