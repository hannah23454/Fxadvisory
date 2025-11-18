'use client';

import React from 'react';
import { useI18n } from "@/components/i18n/i18n"

export default function HowWeWork() {
  const { t } = useI18n()
  
  const steps = [
    {
      number: "1",
      title: t('step_1_title'),
      description: t('step_1_desc'),
    },
    {
      number: "2",
      title: t('step_2_title'),
      description: t('step_2_desc'),
    },
    {
      number: "3",
      title: t('step_3_title'),
      description: t('step_3_desc'),
    },
    {
      number: "4",
      title: t('step_4_title'),
      description: t('step_4_desc'),
    },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
            style={{ color: '#12261F' }}
          >
            {t('how_we_work_title')}
          </h2>
          <p 
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#4A5A55' }}
          >
            {t('how_we_work_desc')}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 relative">
          {/* Connection Lines for Desktop */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5" 
               style={{ 
                 background: 'linear-gradient(to right, transparent 10%, #BD6908 20%, #BD6908 80%, transparent 90%)',
                 zIndex: 0
               }}>
          </div>

          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="relative group"
            >
              <div 
                className="relative bg-white rounded-xl md:rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 z-10 h-full flex flex-col overflow-hidden"
                style={{ borderColor: '#DCE5E1' }}
              >
                {/* Number Badge */}
                <div 
                  className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full text-white font-bold mb-4 text-lg md:text-xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: '#BD6908' }}
                >
                  {step.number}
                </div>

                {/* Title */}
                <h3 
                  className="text-xl md:text-2xl font-bold mb-2 md:mb-3"
                  style={{ color: '#12261F' }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p 
                  className="text-sm md:text-base leading-relaxed grow"
                  style={{ color: '#4A5A55' }}
                >
                  {step.description}
                </p>

                {/* Decorative Corner */}
                <div 
                  className="absolute -top-1 -right-1 w-14 h-14 md:w-16 md:h-16 rounded-tr-xl md:rounded-tr-2xl rounded-bl-full opacity-5 transition-opacity duration-300 group-hover:opacity-10"
                  style={{ backgroundColor: '#BD6908' }}
                ></div>
              </div>

              {/* Arrow for Mobile */}
              {idx < steps.length - 1 && (
                <div className="flex justify-center my-3 md:my-4 lg:hidden">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ color: '#BD6908' }}
                  >
                    <path 
                      d="M12 5v14m0 0l-7-7m7 7l7-7" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}