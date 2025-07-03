'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import Header from '../../../components/Header';

export default function RJPartyQuest() {
  const { t, tHtml } = useLanguage();
  const [activeStage, setActiveStage] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(55);
  const [isDragging, setIsDragging] = useState(false);
  const [isDomReady, setIsDomReady] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);

  const stages = [1, 2, 3, 4, 5, 6, 7];

  const handlePrevStage = () => {
    if (activeStage > 1) {
      setActiveStage(activeStage - 1);
    }
  };

  const handleNextStage = () => {
    if (activeStage < stages.length) {
      setActiveStage(activeStage + 1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current || !knobRef.current) return;

    const offset = knobRef.current.clientWidth / 2;
    const rect = scrollContainerRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + offset);
    const progress = Math.max(0, Math.min(100, (x / (rect.width - offset)) * 100));
    setScrollProgress(progress);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current || !knobRef.current) return;

    const offset = knobRef.current.clientWidth / 2;
    const rect = scrollContainerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - (rect.left + offset);
    const progress = Math.max(0, Math.min(100, (x / (rect.width - offset)) * 100));
    setScrollProgress(progress);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Calculate the maximum scroll distance
  const getMaxScrollDistance = () => {
    if (!scrollContainerRef.current || !knobRef.current) return 0;
    const containerWidth = scrollContainerRef.current.clientWidth;
    const containerHeight = scrollContainerRef.current.clientHeight;
    const knobWidth = knobRef.current.clientWidth;
    
    // Image dimensions: 5517 x 701
    const imageAspectRatio = 5517 / 701; // ~7.87:1 (very wide)
    
    // When image is scaled to fit container height, its width becomes:
    const scaledImageWidth = containerHeight * imageAspectRatio;
    
    // Maximum scroll distance is the difference between scaled image width and container width
    const maxScroll = Math.max(0, scaledImageWidth - containerWidth - knobWidth);
    return maxScroll;
  };

  // Calculate transform value based on progress
  const getTransformValue = () => {
    const maxScroll = getMaxScrollDistance();
    return (scrollProgress / 100) * maxScroll;
  };

  const getMappedProgress = () => {
    const el = knobRef.current;
    if (!el || !el.parentElement) {
      return 0;
    }

    const elementWidth = el.offsetWidth;
    const parentWidth = el.parentElement.offsetWidth;

    const percent = (elementWidth / parentWidth) * 100;
    return (percent / 2) + (scrollProgress / 100) * (100-percent);
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging]);

  // Set scroll position to middle when entering stage 1
  useEffect(() => {
    if (activeStage === 1) {
      // Use a small timeout to ensure DOM elements are ready
      const timer = setTimeout(() => {
        if (knobRef.current && knobRef.current.parentElement) {
          setScrollProgress(55); // Set to 55% (middle)
          setIsDomReady(true); // Force re-render
        }
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [activeStage]);

  // Reset DOM ready state when switching stages
  useEffect(() => {
    setIsDomReady(false);
  }, [activeStage]);

  const renderStageContent = () => {
    switch (activeStage) {
      case 1:
        return (
          <div className="bg-gradient-to-b from-rj-background-dark via-rj-background-light to-rj-background-dark rounded-lg border-rj-background-border border-4 h-[40vh] relative">
            <div className="w-full h-full relative flex flex-col">
              <div 
                ref={scrollContainerRef}
                className="w-full h-[80%] overflow-hidden relative"
              >
                <div className="h-full flex items-center justify-start">
                  <img
                    src="/images/party-quest/rj/stage1.jpg"
                    alt={t('pages.rjPQ.stages.stage1.title')}
                    className="h-full w-auto rounded-lg shadow-lg pointer-events-none"
                    style={{ 
                      minHeight: '100%',
                      maxWidth: 'none',
                      transform: `translateX(-${getTransformValue()}px)`
                    }}
                  />
                </div>
                {/* Custom scrollbar indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-800/30 backdrop-blur-sm">
                  <div 
                    ref={knobRef}
                    className={`absolute top-0 w-12 h-6 bg-white rounded-full shadow-xl transform -translate-y-1/2 cursor-pointer hover:shadow-2xl transition-all duration-200 border-2 border-gray-200 flex items-center justify-center`}
                    style={{ 
                      left: `${getMappedProgress()}%`,
                      transform: `translateX(-50%) translateY(-50%)`,
                      transition: isDragging ? 'none' : 'all 0.2s ease'
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                  >
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full px-4 flex-grow flex flex-col justify-evenly">
                  <div className="items-start text-altText-primary text-xs sm:text-sm">
                    <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.objective`)} />
                    <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.hiddenObjective`)} />
                  </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-gradient-to-b from-rj-background-dark via-rj-background-light to-rj-background-dark rounded-lg border-rj-background-border border-4 h-[40vh] relative">
            <div className="w-full h-full p-4 sm:p-8 relative">
              <div className="absolute inset-0 bg-black rounded-lg flex flex-col items-center justify-between pb-5">
                <div className="text-altText-primary text-sm mt-4 mb-4 px-[10%]">
                  <div dangerouslySetInnerHTML={tHtml('pages.rjPQ.stages.stage2.tip')} />
                </div>
                <div className="w-[30%] sm:w-[15%] aspect-square rounded-full bg-white/10 border-2 border-white/15 flex items-center justify-center">
                  <div className="text-xs sm:text-sm text-altText-primary text-center px-3 py-3">
                    <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.objective`)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-gradient-to-b from-rj-background-dark via-rj-background-light to-rj-background-dark rounded-lg border-rj-background-border border-4 relative">
            <div className="flex flex-col h-full">
              <div className="w-full pt-4 px-4">
                {/* Platform */}
                <div className="h-full flex flex-col justify-center bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg shadow-2xl border-2 border-gray-500">
                  {/* Beakers */}
                  <div className="flex justify-evenly py-8">
                    {[1, 3, 7].map((fillLevel, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="relative">
                          {/* Main beaker body */}
                          <div className="w-20 h-32 bg-gradient-to-b from-blue-400/20 to-blue-600/20 rounded-b-2xl border-2 border-blue-300 relative overflow-hidden">
                            {/* Liquid inside */}
                            <div 
                              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-400 to-blue-300"
                              style={{ height: `${(fillLevel / 7) * 95}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center items-center w-24 h-6 bg-gray-400 rounded-full mt-3 shadow-lg">
                          <p className="text-altText-primary text-xs sm:text-sm">{fillLevel}/7</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full p-4">
                <div className="h-full flex flex-col justify-center text-altText-primary text-xs sm:text-sm">
                  <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.objective`)} />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-gradient-to-b from-rj-background-dark via-rj-background-light to-rj-background-dark rounded-lg border-rj-background-border border-4 relative">
            <div className="w-full h-full relative">
              <div className="w-full flex flex-row space-x-2 px-2 pt-4">
                {/* Left Section - Room 1 */}
                <div className="flex flex-col w-1/4 bg-gray-800 border-2 border-gray-600 rounded-lg shadow-lg relative">
                  {/* Room Name Header */}
                  <div className="bg-gray-700 text-white text-xxs sm:text-xs font-bold text-center py-1 rounded-t-lg border-b border-gray-600">
                    Dark Lab 1 - Hidden Street
                  </div>
                  {/* Room Content */}
                  <div className="basis-[100%] flex flex-col justify-center px-2 py-10">
                    <div className="text-white text-xxs sm:text-xs md:text-sm font-semibold">
                      <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.leftObjective`)} />
                      <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.leftTip`)} />
                    </div>
                  </div>
                </div>
                
                {/* Middle Section - Room 2 */}
                <div className="flex flex-col w-2/4 bg-blue-100 border-2 border-blue-400 rounded-lg shadow-lg relative">
                  {/* Room Name Header */}
                  <div className="bg-blue-200 text-blue-800 text-xxs sm:text-xs font-bold text-center py-1 rounded-t-lg border-b border-blue-400">
                    Special Lab
                  </div>
                  {/* Room Content */}
                  <div className="basis-[100%] flex flex-col justify-center px-2 py-10">
                    <div className="text-blue-800 text-xxs sm:text-xm md:text-sm font-semibold text-center">
                      <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.middleObjective`)} />
                      <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.middleTip`)} />
                    </div>
                  </div>
                </div>
                
                {/* Right Section - Room 3 */}
                <div className="flex flex-col w-1/4 bg-gray-800 border-2 border-gray-600 rounded-lg shadow-lg relative">
                  {/* Room Name Header */}
                  <div className="bg-gray-700 text-white text-xxs sm:text-xs font-bold text-center py-1 rounded-t-lg border-b border-gray-600">
                    Dark Lab 2 - Hidden Street
                  </div>
                  {/* Room Content */}
                  <div className="basis-[100%] flex flex-col justify-center px-2 py-10">
                    <div className="text-white text-xxs sm:text-xm md:text-sm font-semibold">
                      <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.rightObjective`)} />
                      <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.rightTip`)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full p-4">
                <div className="h-full flex flex-col justify-center text-altText-primary text-xs sm:text-sm items-start">
                  <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.hiddenObjective`)} />
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="bg-gradient-to-b from-rj-background-dark via-rj-background-light to-rj-background-dark rounded-lg border-rj-background-border border-4 relative">
            <div className="w-full h-full relative mb-5">
              <div className="w-full flex items-center justify-center p-4">
                <img
                  src="/images/party-quest/rj/stage5.jpg"
                  alt={t('pages.rjPQ.stages.stage5.title')}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              </div>

              <div className="w-full">
                <div className="h-full flex flex-col justify-center space-y-2 text-altText-primary text-xs sm:text-sm items-start px-4">
                  <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.objective`)} />
                  <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.tip`)} />
                  <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.hiddenObjective`)} />
                </div>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="bg-gradient-to-b from-rj-background-dark via-rj-background-light to-rj-background-dark rounded-lg border-rj-background-border border-4 relative">
            <div className="w-full h-full relative">
              <div className="w-full flex flex-row justify-evenly items-center p-4 pt-8">
                {[101, 102, 103, 104].map((unitNumber) => (
                  <div key={unitNumber} className="flex flex-col items-center">
                    {/* Door */}
                    <div className="w-20 h-32 bg-gradient-to-b from-gray-700 to-gray-800 border-2 border-gray-600 rounded-t-lg shadow-lg relative">
                      {/* Door handle */}
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-8 bg-yellow-400 rounded-full shadow-md"></div>
                      {/* Door panel */}
                      <div className="absolute inset-2 bg-gradient-to-b from-gray-600 to-gray-700 rounded-t-sm"></div>
                    </div>
                    {/* Door label */}
                    <div className="mt-2 text-center">
                      <div className="text-altText-primary text-xxs sm:text-xs font-semibold">
                        Lab - Unit {unitNumber}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full p-4">
                <div className="h-full flex flex-col justify-center space-y-2 text-altText-primary text-xs sm:text-sm items-start">
                  <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.objective`)} />
                  <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.warning`)} />
                  <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.tip`)} />
                  <a href="../rjtool" className="text-blue-500 underline" dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.link`)} />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gradient-to-b from-rj-background-dark via-rj-background-light to-rj-background-dark rounded-lg border-rj-background-border border-4 relative">
            <div className="w-full h-full p-4 sm:p-8 relative">
              <div className="text-xs sm:text-sm text-altText-primary space-y-2">
                <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.objective`)} />
                <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.hiddenObjective`)} />
                <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.warning`)} />
                <div dangerouslySetInnerHTML={tHtml(`pages.rjPQ.stages.stage${activeStage}.bonus`)} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="">
      <div className="max-w-4xl mx-auto">
        <Header />

        {/* Invisible Navigation Areas */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left half - Previous Stage */}
          <div 
            className="absolute left-0 top-0 w-1/2 h-full pointer-events-auto cursor-pointer"
            onClick={handlePrevStage}
            style={{ 
              cursor: activeStage === 1 ? 'default' : 'pointer',
              opacity: 0, // Invisible but clickable
              zIndex: 10
            }}
          />
          
          {/* Right half - Next Stage */}
          <div 
            className="absolute right-0 top-0 w-1/2 h-full pointer-events-auto cursor-pointer"
            onClick={handleNextStage}
            style={{ 
              cursor: activeStage === stages.length ? 'default' : 'pointer',
              opacity: 0, // Invisible but clickable
              zIndex: 10
            }}
          />
        </div>

        {/* Visual Hints for Navigation */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left side hint - hidden on small screens */}
          {activeStage > 1 && (
            <div className="absolute left-0 top-0 w-1/4 h-full bg-gradient-to-r from-black/30 via-black/10 to-transparent flex items-center justify-center hidden xl:flex">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-white/80 text-2xl font-bold animate-pulse">‹</div>
                <div className="text-white/60 text-xs font-semibold bg-black/40 px-2 py-1 rounded-full">
                  {t('pages.rjPQ.previous')}
                </div>
              </div>
            </div>
          )}
          
          {/* Right side hint - hidden on small screens */}
          {activeStage < stages.length && (
            <div className="absolute right-0 top-0 w-1/4 h-full bg-gradient-to-l from-black/30 via-black/10 to-transparent flex items-center justify-center hidden xl:flex">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-white/80 text-2xl font-bold animate-pulse">›</div>
                <div className="text-white/60 text-xs font-semibold bg-black/40 px-2 py-1 rounded-full">
                  {t('pages.rjPQ.next')}
                </div>
              </div>
            </div>
          )}

          {/* Bottom hints for small screens */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-4 xl:hidden">
            {activeStage > 1 ? (
              <div className="flex items-center space-x-2 bg-black/40 px-3 py-2 rounded-full">
                <div className="text-white/80 text-lg font-bold animate-pulse">‹</div>
                <div className="text-white/70 text-sm font-semibold">{t('pages.rjPQ.previous')}</div>
              </div>
            ) : (
              <div className="w-24"></div> // Placeholder to maintain spacing
            )}
            
            {activeStage < stages.length ? (
              <div className="flex items-center space-x-2 bg-black/40 px-3 py-2 rounded-full">
                <div className="text-white/70 text-sm font-semibold">{t('pages.rjPQ.next')}</div>
                <div className="text-white/80 text-lg font-bold animate-pulse">›</div>
              </div>
            ) : (
              <div className="w-24"></div> // Placeholder to maintain spacing
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 mt-24 px-1">
          {t('pages.rjPQ.title')}
        </h1>

        {/* Stage Numbers Navigation */}
        <div className="flex justify-center items-center mb-6 px-1" style={{ position: 'relative', zIndex: 10 }}>
          <div className="flex space-x-1 max-w-full overflow-hidden">
            {stages.map((stage) => (
              <div key={stage} className="flex flex-col items-center min-w-0 flex-1">
                <button
                  onClick={() => setActiveStage(stage)}
                  className={`w-full h-16 px-1 py-1 rounded-md flex flex-col items-center justify-start transition-colors text-xs ${
                    activeStage === stage
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span className="font-bold mt-1">{stage}</span>
                  <span className="text-mini sm:text-xxs mt-1 w-full text-center leading-tight">
                    {t(`pages.rjPQ.stages.stage${stage}.title`)}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stage Content */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {renderStageContent()}
        </div>
      </div>
    </div>
  );
}