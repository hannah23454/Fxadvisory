'use client';

import React from 'react';
import { useI18n } from "@/components/i18n/i18n"

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
                src="https://b386363e680359b5cc19-97ec1140354919029c7985d2568f0e82.ssl.cf1.rackcdn.com/assets/uploads/post/featured_image/62375/7318baade298246fa6f64effa7208d2c.png"
                alt={t('lending_alt')}
                className="w-full h-auto"
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
                style={{ color: '#BD6908' }}
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
                <button
                  className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-white font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: '#BD6908' }}
                  onClick={() => console.log('Explore more clicked')}
                  aria-label={t('lending_cta')}
                >
                  {t('lending_cta')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessLendingHero;