'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { useLanguage } from '../../../contexts/LanguageContext';
import { roomConfig as roomConfigs } from './constants';

export default function OrbisPQ() {
  const { t } = useLanguage();

  // Map cell indices to room configuration
  const cellConfig: Record<number, { 
    name: string;
    shape: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  }> = {
    2: { 
      name: 'onTheWayUp',
      shape: 'h-20 sm:h-20 md:h-24 rounded-lg',
      bgColor: 'bg-gradient-to-b from-door-light to-door-light-bottom',
      borderColor: 'border-door-light-border',
      textColor: 'text-text-primary'
    },
    4: { 
      name: 'walkway',
      shape: 'aspect-[4/5] h-28 sm:h-28 md:h-32 rounded-lg',
      bgColor: 'bg-gradient-to-b from-door-light to-door-light-bottom',
      borderColor: 'border-door-light-border',
      textColor: 'text-text-primary'
    },
    5: { 
      name: 'lounge',
      shape: 'aspect-square h-28 sm:h-28 md:h-32 rounded-full',
      bgColor: 'bg-gradient-to-b from-door-dark to-door-dark-bottom',
      borderColor: 'border-door-dark-border',
      textColor: 'text-altText-primary'
    },
    6: { 
      name: 'storage',
      shape: 'aspect-[4/5] h-28 sm:h-28 md:h-32 rounded-lg',
      bgColor: 'bg-gradient-to-b from-door-light to-door-light-bottom',
      borderColor: 'border-door-light-border',
      textColor: 'text-text-primary'
    },
    7: { 
      name: 'sealed',
      shape: 'aspect-[4/5] h-28 sm:h-28 md:h-32 rounded-lg',
      bgColor: 'bg-gradient-to-b from-door-light to-door-light-bottom',
      borderColor: 'border-door-light-border',
      textColor: 'text-text-primary'
    },
    11: { 
      name: 'garden',
      shape: 'aspect-[1.1] h-32 sm:h-32 md:h-48 rounded-lg',
      bgColor: 'bg-gradient-to-b from-door-light to-door-light-bottom',
      borderColor: 'border-door-light-border',
      textColor: 'text-text-primary'
    },
    16: { 
      name: 'entrance',
      shape: 'aspect-[4/5] h-28 sm:h-28 md:h-32 rounded-lg',
      bgColor: 'bg-gradient-to-b from-door-light to-door-light-bottom',
      borderColor: 'border-door-light-border',
      textColor: 'text-text-primary'
    },
    18: { 
      name: 'lobby',
      shape: 'aspect-[4/5] h-28 sm:h-28 md:h-32 rounded-lg',
      bgColor: 'bg-gradient-to-b from-door-light to-door-light-bottom',
      borderColor: 'border-door-light-border',
      textColor: 'text-text-primary'
    }
  };

  return (
    <main className="min-h-screen p-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center">
          <Link href="/" className="text-blue-500 hover:text-blue-600 mb-4 inline-block text-sm sm:text-base">
            {t('pages.backToHome')}
          </Link>
          <LanguageSwitcher />
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">{t('pages.orbisPQ.title')}</h1>
        
        {/* Grid Container wrapper with padding */}
        <div className="pb-12 sm:pb-16 md:pb-24 mb-8 sm:mb-12 md:mb-16">
          {/* Grid Container */}
          <div className="grid grid-cols-[1fr_2fr_1fr] grid-template-rows-[auto_auto_auto_auto_auto_auto] gap-y-10 w-full min-h-[500px] sm:min-h-[600px] md:min-h-[700px] max-w-md mx-auto">
            {/* Grid Cells */}
            {[...Array(18)].map((_, index) => {
              const cellNumber = index + 1;
              const cell = cellConfig[cellNumber];
              const roomName = cell?.name;
              const roomConfig = roomName ? roomConfigs[roomName] : null;
              const isVisible = !!roomConfig;
              const isGarden = cellNumber === 11;
              
              return (
                <div key={index} className="relative flex items-center justify-center min-h-0">
                  {isVisible && (
                    !isGarden ? (
                      <Link 
                        href={`/party-quest/orbis/rooms/${roomConfig.page}`}
                        className={`group relative overflow-hidden flex items-center justify-center border-2 ${cell.borderColor} ${cell.bgColor} ${cell.shape} inset-0 p-1 sm:p-2 md:p-3
                          hover:brightness-105 hover:shadow-md active:brightness-95 cursor-pointer transition-all duration-200
                        `}
                      >
                        <span className={`${cell.textColor} font-medium min-w-[4rem] text-center z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-200 text-sm sm:text-sm`}>
                          {t(roomConfig.nameKey)}
                        </span>
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-blue-100/90 opacity-0 group-hover:opacity-100 backdrop-blur-[1px] transition-all duration-300 ease-in-out transform group-hover:scale-105 flex flex-col items-center justify-center p-1 shadow-inner">
                          <span className="font-semibold text-[8px] sm:text-[10px] text-blue-700 mb-0.5 drop-shadow-sm">{t('common.recommend')}</span>
                          <div className="text-[7px] sm:text-[8px] text-blue-800 font-medium bg-white/40 px-1.5 py-0.5 rounded-md border border-blue-200/50">
                            <div className="flex items-center gap-0.5">
                              <span className="font-semibold">→</span> {roomConfig.players} player(s)
                            </div>
                            
                            {roomConfig.jobs && (
                              <div className="flex items-center gap-0.5">
                                <span className="font-semibold">→</span> {roomConfig.jobs.map((job, idx) => (
                                  <React.Fragment key={idx}>
                                    {idx > 0 && <span className="mx-0.5">/</span>}
                                    {t(job)}
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                            
                            {roomConfig.types && (
                              <div className="flex items-center gap-0.5 mt-0.5">
                                <span className="font-semibold">→</span> {roomConfig.types.map((type, idx) => (
                                  <React.Fragment key={idx}>
                                    {idx > 0 && <span className="mx-0.5">/</span>}
                                    {t(type)}
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                            
                            {roomConfig.skills && (
                              <div className="flex items-center gap-0.5 mt-0.5">
                                <span className="font-semibold">→</span> {roomConfig.skills.map((skill, idx) => (
                                  <React.Fragment key={idx}>
                                    {idx > 0 && <span className="mx-0.5">/</span>}
                                    {t(skill)}
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <Link 
                        href="/party-quest/orbis/rooms/garden"
                        className={`group relative overflow-hidden flex items-center justify-center border-2 ${cell.borderColor} ${cell.bgColor} ${cell.shape} inset-0 p-1 sm:p-2 md:p-3
                          hover:brightness-105 hover:shadow-md active:brightness-95 cursor-pointer transition-all duration-200
                        `}
                      >
                        <img 
                          src="/images/statue.jpg" 
                          alt="Garden Room"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-blue-100/90 opacity-0 group-hover:opacity-100 backdrop-blur-[1px] transition-all duration-300 ease-in-out transform group-hover:scale-105 flex flex-col items-center justify-center p-1 shadow-inner">
                          <span className="font-semibold text-[8px] sm:text-[10px] text-blue-700 mb-0.5 drop-shadow-sm">{t('common.recommend')}</span>
                          <div className="text-[7px] sm:text-[8px] text-blue-800 font-medium bg-white/40 px-1.5 py-0.5 rounded-md border border-blue-200/50">
                            <div className="flex items-center gap-0.5">
                              <span className="font-semibold">→</span> {roomConfig.players} player(s)
                            </div>
                            
                            {roomConfig.jobs && (
                              <div className="flex items-center gap-0.5">
                                <span className="font-semibold">→</span> {roomConfig.jobs.map((job, idx) => (
                                  <React.Fragment key={idx}>
                                    {idx > 0 && <span className="mx-0.5">/</span>}
                                    {t(job)}
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                            
                            {roomConfig.types && (
                              <div className="flex items-center gap-0.5 mt-0.5">
                                <span className="font-semibold">→</span> {roomConfig.types.map((type, idx) => (
                                  <React.Fragment key={idx}>
                                    {idx > 0 && <span className="mx-0.5">/</span>}
                                    {t(type)}
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                            
                            {roomConfig.skills && (
                              <div className="flex items-center gap-0.5 mt-0.5">
                                <span className="font-semibold">→</span> {roomConfig.skills.map((skill, idx) => (
                                  <React.Fragment key={idx}>
                                    {idx > 0 && <span className="mx-0.5">/</span>}
                                    {t(skill)}
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
} 