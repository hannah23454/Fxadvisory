'use client';

import React from 'react';
import { useI18n } from "@/components/i18n/i18n"
import Link from 'next/link'

const BusinessLendingHero: React.FC = () => {
  const { t } = useI18n()

  return (
    <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#DCE5E1' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Section */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="w-full max-w-sm sm:max-w-md">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&h=500&fit=crop"
                alt={t('lending_alt')}
                className="w-full h-auto rounded-xl shadow-lg"
                loading="lazy"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <div className="space-y-4 sm:space-y-5">
              {/* Tag */}
              <div className="inline-block">
                <span 
                  className="text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full"
                  style={{ 
                    backgroundColor: 'rgba(18, 38, 31, 0.08)',
                    color: '#12261F'
                  }}
                >
                  {t('lending_badge')}
                </span>
              </div>

              {/* Heading */}
              <h1 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
                style={{ color: '#2D6A4F' }}
              >
                {t('lending_title')}
              </h1>

              {/* Description */}
              <p 
                className="text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
                style={{ color: '#12261F', opacity: 0.85 }}
              >
                {t('lending_desc')}
              </p>

              {/* CTA Button */}
              <div className="pt-2 sm:pt-4">
                <Link
                  href="/contact"
                  className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-white font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: '#2D6A4F' }}
                  aria-label={t('lending_cta')}
                >
                  {t('lending_cta')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessLendingHero;