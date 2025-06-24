'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { copyToClipboard } from '../../../lib/utils/clipboard';
import Header from '../../../components/Header';

type StageDescription = {
  objective?: string;
  tips?: string;
  warning?: string;
};

type StageDescriptions = {
  [key: number]: StageDescription;
};

const stageDescriptions: StageDescriptions = {
  1: {
    objective: "pages.ludibriumPQ.detailed.stages.objective1",
    warning: "pages.ludibriumPQ.detailed.stages.warning1"
  },
  2: {
    objective: "pages.ludibriumPQ.detailed.stages.objective2",
    tips: "pages.ludibriumPQ.detailed.stages.tips2"
  },
  3: {
    objective: "pages.ludibriumPQ.detailed.stages.objective3"
  },
  4: {
    objective: "pages.ludibriumPQ.detailed.stages.objective4",
    tips: "pages.ludibriumPQ.detailed.stages.tips4"
  },
  5: {
    objective: "pages.ludibriumPQ.detailed.stages.objective5",
    tips: "pages.ludibriumPQ.detailed.stages.tips5",
    warning: "pages.ludibriumPQ.detailed.stages.warning5"
  },
  6: {
    objective: "pages.ludibriumPQ.detailed.stages.objective6",
    tips: "pages.ludibriumPQ.detailed.stages.tips6"
  },
  7: {
    objective: "pages.ludibriumPQ.detailed.stages.objective7",
    warning: "pages.ludibriumPQ.detailed.stages.warning7"
  },
  8: {
    objective: "pages.ludibriumPQ.detailed.stages.objective8",
    tips: "pages.ludibriumPQ.detailed.stages.tips8"
  },
  9: {
    objective: "pages.ludibriumPQ.detailed.stages.objective9"
  }
};

const GMS_SEQUENCE = [1, 2, 5, 6, 7, 9, 10, 11, 12];
const DOWNWARD_SEQUENCE = [1, 5, 9, 2, 6, 10, 7, 11, 12];
const JMS_SEQUENCE = [1, 5, 9, 10, 6, 11, 2, 7, 12];
const ANIMATION_INTERVAL = 300;

type SequenceType = 'GMS' | 'Downward' | 'JMS';
type SpeedMultiplier = 0.5 | 1 | 2;

type LineBlock = {
  height: string;
  width: string;
  gradient: string;
};

const lineBlocks: LineBlock[] = [
  { height: 'h-[5vh]', width: 'w-[10rem]', gradient: 'bg-gradient-to-r from-ludibrium-pillar-tertiary via-ludibrium-pillar-black to-ludibrium-pillar-tertiary' },
  { height: 'h-[5vh]', width: 'w-[9rem]', gradient: 'bg-gradient-to-r from-ludibrium-pillar-quaternary via-ludibrium-pillar-black to-ludibrium-pillar-quaternary' },
  { height: 'h-[5vh]', width: 'w-[10rem]', gradient: 'bg-gradient-to-r from-ludibrium-pillar-primary via-ludibrium-pillar-black to-ludibrium-pillar-primary' },
  { height: 'h-[5vh]', width: 'w-[8rem]', gradient: 'bg-gradient-to-r from-ludibrium-pillar-primary via-ludibrium-pillar-black to-ludibrium-pillar-primary' },
  { height: 'h-[5vh]', width: 'w-[12rem]', gradient: 'bg-gradient-to-r from-ludibrium-pillar-secondary via-ludibrium-pillar-black to-ludibrium-pillar-secondary' },
  { height: 'h-[5vh]', width: 'w-[10rem]', gradient: 'bg-gradient-to-r from-ludibrium-pillar-secondary via-ludibrium-pillar-black to-ludibrium-pillar-secondary' },
  { height: 'h-[5vh]', width: 'w-[9rem]', gradient: 'bg-gradient-to-r from-ludibrium-pillar-quaternary via-ludibrium-pillar-black to-ludibrium-pillar-quaternary' },
  { height: 'h-[5vh]', width: 'w-[11rem]', gradient: 'bg-gradient-to-r from-ludibrium-pillar-tertiary via-ludibrium-pillar-black to-ludibrium-pillar-tertiary' },
];

const generateCombinations = (arr: number[], size: number): number[][] => {
  const result: number[][] = [];
  
  const combine = (current: number[], start: number) => {
    if (current.length === size) {
      result.push([...current]);
      return;
    }
    
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      combine(current, i + 1);
      current.pop();
    }
  };
  
  combine([], 0);
  return result;
};

type HighlightedBox = {
  boxNumber: number;
  playerIndex: number;
};

export default function LudibriumPQ() {
  const { t } = useLanguage();
  const [copySuccess, setCopySuccess] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingRef = useRef(false);
  const hideNavTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [highlightedBoxes, setHighlightedBoxes] = useState<HighlightedBox[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sequenceType, setSequenceType] = useState<SequenceType>('Downward');
  const [speedMultiplier, setSpeedMultiplier] = useState<SpeedMultiplier>(1);

  const sequence = useMemo(() => {
    switch (sequenceType) {
      case 'GMS':
        return GMS_SEQUENCE;
      case 'Downward':
        return DOWNWARD_SEQUENCE;
      case 'JMS':
        return JMS_SEQUENCE;
    }
  }, [sequenceType]);

  const allCombinations = useMemo(() => generateCombinations(sequence, 4), [sequence]);

  // Reset current index when sequence changes
  useEffect(() => {
    setCurrentIndex(0);
    // Initialize with first combination, assigning players 0-3 to the boxes
    setHighlightedBoxes(allCombinations[0].map((boxNumber, index) => ({
      boxNumber,
      playerIndex: index
    })));
  }, [allCombinations]);

  useEffect(() => {
    const animateSequence = () => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % allCombinations.length;
        setHighlightedBoxes(allCombinations[newIndex].map((boxNumber, index) => ({
          boxNumber,
          playerIndex: index
        })));
        return newIndex;
      });
    };

    const interval = setInterval(animateSequence, ANIMATION_INTERVAL / speedMultiplier);
    return () => clearInterval(interval);
  }, [allCombinations, speedMultiplier]);

  const handleCopy = async () => {
    const textToCopy = "133 221 333 123 111";
    try {
      await copyToClipboard(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Skip scroll handling if we're programmatically scrolling
      if (isScrollingRef.current) return;

      const simpleSection = document.getElementById('simple-section');
      const detailedSection = document.getElementById('detailed-section');
      const navPanel = document.getElementById('ludibrium-nav');
      
      if (simpleSection && detailedSection && navPanel) {
        const simpleRect = simpleSection.getBoundingClientRect();
        const detailedRect = detailedSection.getBoundingClientRect();
        const navRect = navPanel.getBoundingClientRect();
        
        // Check if nav panel is overlapping with detailed section
        const isOverlapping = !(
          navRect.right < detailedRect.left || 
          navRect.left > detailedRect.right || 
          navRect.bottom < detailedRect.top || 
          navRect.top > detailedRect.bottom
        );

        setShowNav(simpleRect.bottom <= 0);

        // Clear any existing timeout
        if (hideNavTimeoutRef.current) {
          clearTimeout(hideNavTimeoutRef.current);
        }

        // Only set timeout to hide nav if it's overlapping with detailed section
        if (isOverlapping) {
          hideNavTimeoutRef.current = setTimeout(() => {
            setShowNav(false);
          }, 1000);
        }

        // Find the section that's currently in view
        for (let i = 0; i < sectionsRef.current.length; i++) {
          const section = sectionsRef.current[i];
          if (section) {
            const line = document.getElementById(`line-${(i+1)}`)
            const rect = section.getBoundingClientRect();
            if (line) {
              const lineRect = line.getBoundingClientRect();
              if (lineRect.top >= 0) {
                setActiveSection(i + 1);
                break;
              }
            } else if (rect.bottom > 0) {
              setActiveSection(i + 1);
              break;
            } 
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideNavTimeoutRef.current) {
        clearTimeout(hideNavTimeoutRef.current);
      }
    };
  }, []);

  const isBoxHighlighted = (number: number) => {
    return highlightedBoxes.some(box => box.boxNumber === number);
  };

  const getBoxPlayerIndex = (number: number) => {
    const box = highlightedBoxes.find(box => box.boxNumber === number);
    return box?.playerIndex ?? -1;
  };

  const scrollToSection = (index: number) => {
    const section = sectionsRef.current[index];
    if (section) {
      isScrollingRef.current = true;
      setActiveSection(index + 1);
      
      const offset = 70;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
      });

      // Reset the scrolling flag after the animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000); // Assuming smooth scroll takes about 1 second
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 mb-4">
      <div className="max-w-4xl mx-auto">
        <Header />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 mt-16">{t('pages.ludibriumPQ.title')}</h1>

        {/* Simple Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-altText-primary mb-4">{t('pages.ludibriumPQ.simple.title')}</h2>
          <div id="simple-section" className="relative rounded-lg border border-room-border p-4 mb-8 overflow-hidden">
            {/* Background decor */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-5 left-[10%] w-8 h-8 rounded-full bg-decor"></div>
              <div className="absolute top-20 right-[15%] w-6 h-6 rounded-full bg-decor"></div>
              <div className="absolute bottom-40 left-[25%] w-4 h-4 rounded-full bg-decor"></div>
              <div className="absolute bottom-30 right-[35%] w-5 h-5 rounded-full bg-decor"></div>
            </div>
            
            {/* Skybox */}
            <div className="absolute inset-0 bg-gradient-to-r from-ludibrium-background-dark via-ludibrium-background-light to-ludibrium-background-dark pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between bg-ludibrium-background-red rounded-lg p-4">
                <div className="font-mono text-sm sm:text-lg text-ludibrium-text-primary">133 221 333 123 111</div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 py-2 rounded-lg transition-colors duration-200 ${
                    copySuccess 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {copySuccess ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xxs sm:text-sm font-semibold">{t('pages.ludibriumPQ.simple.copied')}</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002-2h2a2 2 0 002 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      <span className="text-xxs sm:text-sm font-semibold">{t('pages.ludibriumPQ.simple.copy')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div 
          id="ludibrium-nav"
          className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 ${
            showNav ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
          }`}
        >
          <div className="bg-gray-800 rounded-lg p-2 space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((stage) => (
              <button
                key={stage}
                onClick={() => scrollToSection(stage - 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                  activeSection === stage
                    ? 'bg-ludibrium-background-dark text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Section */}
        <div className="max-w-2xl mx-auto mt-20">
          <h2 className="text-lg sm:text-xl font-semibold text-altText-primary mb-4">{t('pages.ludibriumPQ.detailed.title')}</h2>
          <div id="detailed-section" className="relative rounded-lg border border-room-border p-4 overflow-hidden">
            {/* Background decor */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-5 left-[10%] w-8 h-8 rounded-full bg-decor"></div>
              <div className="absolute top-20 right-[15%] w-6 h-6 rounded-full bg-decor"></div>
              <div className="absolute bottom-40 left-[25%] w-4 h-4 rounded-full bg-decor"></div>
              <div className="absolute bottom-30 right-[35%] w-5 h-5 rounded-full bg-decor"></div>
            </div>
            
            {/* Skybox */}
            <div className="absolute inset-0 bg-gradient-to-r from-ludibrium-background-dark via-ludibrium-background-light to-ludibrium-background-dark pointer-events-none"></div>

            <div className="relative z-10">
              {/* Stage Blocks */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((stage, index) => (
                <div
                  key={stage}
                  ref={(el) => {
                    sectionsRef.current[index] = el;
                  }}
                  className="relative"
                >
                  <div className="bg-ludibrium-background-red rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-ludibrium-text-primary mb-4">
                      {t('pages.ludibriumPQ.detailed.stage', { stage: stage.toString() })}
                    </h3>
                    <div className="space-y-4">
                      {stageDescriptions[stage]?.objective && (
                        <div>
                          <p className="text-ludibrium-text-primary">
                            {t(`pages.ludibriumPQ.detailed.stages.objective${stage}`)}
                          </p>
                        </div>
                      )}
                      
                      {stageDescriptions[stage]?.tips && (
                        <div>
                          <div className="h-1 bg-ludibrium-background-dark my-4"></div>
                          <p className="text-ludibrium-text-secondary">
                            {t(`pages.ludibriumPQ.detailed.stages.tips${stage}`)}
                          </p>
                        </div>
                      )}
                      
                      {stageDescriptions[stage]?.warning && (
                        <div>
                          <div className="h-1 bg-ludibrium-background-dark my-4"></div>
                          <p className="text-status-warning">
                            {t(`pages.ludibriumPQ.detailed.stages.warning${stage}`)}
                          </p>
                        </div>
                      )}

                      {stage === 8 && (
                        <>
                          <div className="h-1 bg-ludibrium-background-dark my-4"></div>
                          <div className="flex justify-center gap-4 mb-4">
                            <button
                              onClick={() => setSequenceType('GMS')}
                              className={`px-2 py-2 rounded-lg transition-colors duration-200 ${
                                sequenceType === 'GMS'
                                  ? 'bg-ludibrium-background-pink text-ludibrium-text-white border-2 border-ludibrium-background-border'
                                  : 'bg-yellow-700 text-ludibrium-text-white border-2 border-ludibrium-background-border hover:bg-yellow-800'
                              }`}
                            >
                              GMS
                            </button>
                            <button
                              onClick={() => setSequenceType('Downward')}
                              className={`px-2 py-2 rounded-lg transition-colors duration-200 ${
                                sequenceType === 'Downward'
                                  ? 'bg-ludibrium-background-pink text-ludibrium-text-white border-2 border-ludibrium-background-border'
                                  : 'bg-yellow-700 text-ludibrium-text-white border-2 border-ludibrium-background-border hover:bg-yellow-800'
                              }`}
                            >
                              Downward
                            </button>
                            <button
                              onClick={() => setSequenceType('JMS')}
                              className={`px-2 py-2 rounded-lg transition-colors duration-200 ${
                                sequenceType === 'JMS'
                                  ? 'bg-ludibrium-background-pink text-ludibrium-text-white border-2 border-ludibrium-background-border'
                                  : 'bg-yellow-700 text-ludibrium-text-white border-2 border-ludibrium-background-border hover:bg-yellow-800'
                              }`}
                            >
                              JMS
                            </button>
                          </div>
                          <div className="flex justify-center gap-2 mb-4">
                            <button
                              onClick={() => setSpeedMultiplier(0.5)}
                              className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
                                speedMultiplier === 0.5
                                  ? 'bg-ludibrium-background-pink text-ludibrium-text-white border-2 border-ludibrium-background-border'
                                  : 'bg-yellow-700 text-ludibrium-text-white border-2 border-ludibrium-background-border hover:bg-yellow-800'
                              }`}
                            >
                              x0.5
                            </button>
                            <button
                              onClick={() => setSpeedMultiplier(1)}
                              className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
                                speedMultiplier === 1
                                  ? 'bg-ludibrium-background-pink text-ludibrium-text-white border-2 border-ludibrium-background-border'
                                  : 'bg-yellow-700 text-ludibrium-text-white border-2 border-ludibrium-background-border hover:bg-yellow-800'
                              }`}
                            >
                              x1
                            </button>
                            <button
                              onClick={() => setSpeedMultiplier(2)}
                              className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
                                speedMultiplier === 2
                                  ? 'bg-ludibrium-background-pink text-ludibrium-text-white border-2 border-ludibrium-background-border'
                                  : 'bg-yellow-700 text-ludibrium-text-white border-2 border-ludibrium-background-border hover:bg-yellow-800'
                              }`}
                            >
                              x2
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-2 max-w-[200px] mx-auto">
                            {/* First row */}
                            <div className="relative">
                              <div className="bg-ludibrium-background-pink border border-ludibrium-background-border rounded-lg aspect-square flex items-center justify-center text-ludibrium-text-white">1</div>
                              {isBoxHighlighted(1) && (
                                <div className={`absolute inset-0 border-4 rounded-lg z-10 ${
                                  getBoxPlayerIndex(1) === 0 ? 'border-ludibrium-player-1' :
                                  getBoxPlayerIndex(1) === 1 ? 'border-ludibrium-player-2' :
                                  getBoxPlayerIndex(1) === 2 ? 'border-ludibrium-player-3' :
                                  'border-ludibrium-player-4'
                                }`}></div>
                              )}
                            </div>
                            <div className="relative">
                              <div className="bg-ludibrium-background-pink border border-ludibrium-background-border rounded-lg aspect-square flex items-center justify-center text-ludibrium-text-white">2</div>
                              {isBoxHighlighted(2) && (
                                <div className={`absolute inset-0 border-4 rounded-lg z-10 ${
                                  getBoxPlayerIndex(2) === 0 ? 'border-ludibrium-player-1' :
                                  getBoxPlayerIndex(2) === 1 ? 'border-ludibrium-player-2' :
                                  getBoxPlayerIndex(2) === 2 ? 'border-ludibrium-player-3' :
                                  'border-ludibrium-player-4'
                                }`}></div>
                              )}
                            </div>
                            <div className="bg-ludibrium-background-dark/10 rounded-lg aspect-square"></div>
                            <div className="bg-ludibrium-background-dark/10 rounded-lg aspect-square"></div>
                            
                            {/* Second row */}
                            <div className="relative">
                              <div className="bg-ludibrium-background-pink border border-ludibrium-background-border rounded-lg aspect-square flex items-center justify-center text-ludibrium-text-white">3</div>
                              {isBoxHighlighted(5) && (
                                <div className={`absolute inset-0 border-4 rounded-lg z-10 ${
                                  getBoxPlayerIndex(5) === 0 ? 'border-ludibrium-player-1' :
                                  getBoxPlayerIndex(5) === 1 ? 'border-ludibrium-player-2' :
                                  getBoxPlayerIndex(5) === 2 ? 'border-ludibrium-player-3' :
                                  'border-ludibrium-player-4'
                                }`}></div>
                              )}
                            </div>
                            <div className="relative">
                              <div className="bg-ludibrium-background-pink border border-ludibrium-background-border rounded-lg aspect-square flex items-center justify-center text-ludibrium-text-white">4</div>
                              {isBoxHighlighted(6) && (
                                <div className={`absolute inset-0 border-4 rounded-lg z-10 ${
                                  getBoxPlayerIndex(6) === 0 ? 'border-ludibrium-player-1' :
                                  getBoxPlayerIndex(6) === 1 ? 'border-ludibrium-player-2' :
                                  getBoxPlayerIndex(6) === 2 ? 'border-ludibrium-player-3' :
                                  'border-ludibrium-player-4'
                                }`}></div>
                              )}
                            </div>
                            <div className="relative">
                              <div className="bg-ludibrium-background-pink border border-ludibrium-background-border rounded-lg aspect-square flex items-center justify-center text-ludibrium-text-white">5</div>
                              {isBoxHighlighted(7) && (
                                <div className={`absolute inset-0 border-4 rounded-lg z-10 ${
                                  getBoxPlayerIndex(7) === 0 ? 'border-ludibrium-player-1' :
                                  getBoxPlayerIndex(7) === 1 ? 'border-ludibrium-player-2' :
                                  getBoxPlayerIndex(7) === 2 ? 'border-ludibrium-player-3' :
                                  'border-ludibrium-player-4'
                                }`}></div>
                              )}
                            </div>
                            <div className="bg-ludibrium-background-dark/10 rounded-lg aspect-square"></div>
                            
                            {/* Third row */}
                            <div className="relative">
                              <div className="bg-ludibrium-background-pink border border-ludibrium-background-border rounded-lg aspect-square flex items-center justify-center text-ludibrium-text-white">6</div>
                              {isBoxHighlighted(9) && (
                                <div className={`absolute inset-0 border-4 rounded-lg z-10 ${
                                  getBoxPlayerIndex(9) === 0 ? 'border-ludibrium-player-1' :
                                  getBoxPlayerIndex(9) === 1 ? 'border-ludibrium-player-2' :
                                  getBoxPlayerIndex(9) === 2 ? 'border-ludibrium-player-3' :
                                  'border-ludibrium-player-4'
                                }`}></div>
                              )}
                            </div>
                            <div className="relative">
                              <div className="bg-ludibrium-background-pink border border-ludibrium-background-border rounded-lg aspect-square flex items-center justify-center text-ludibrium-text-white">7</div>
                              {isBoxHighlighted(10) && (
                                <div className={`absolute inset-0 border-4 rounded-lg z-10 ${
                                  getBoxPlayerIndex(10) === 0 ? 'border-ludibrium-player-1' :
                                  getBoxPlayerIndex(10) === 1 ? 'border-ludibrium-player-2' :
                                  getBoxPlayerIndex(10) === 2 ? 'border-ludibrium-player-3' :
                                  'border-ludibrium-player-4'
                                }`}></div>
                              )}
                            </div>
                            <div className="relative">
                              <div className="bg-ludibrium-background-pink border border-ludibrium-background-border rounded-lg aspect-square flex items-center justify-center text-ludibrium-text-white">8</div>
                              {isBoxHighlighted(11) && (
                                <div className={`absolute inset-0 border-4 rounded-lg z-10 ${
                                  getBoxPlayerIndex(11) === 0 ? 'border-ludibrium-player-1' :
                                  getBoxPlayerIndex(11) === 1 ? 'border-ludibrium-player-2' :
                                  getBoxPlayerIndex(11) === 2 ? 'border-ludibrium-player-3' :
                                  'border-ludibrium-player-4'
                                }`}></div>
                              )}
                            </div>
                            <div className="relative">
                              <div className="bg-ludibrium-background-pink border border-ludibrium-background-border rounded-lg aspect-square flex items-center justify-center text-ludibrium-text-white">9</div>
                              {isBoxHighlighted(12) && (
                                <div className={`absolute inset-0 border-4 rounded-lg z-10 ${
                                  getBoxPlayerIndex(12) === 0 ? 'border-ludibrium-player-1' :
                                  getBoxPlayerIndex(12) === 1 ? 'border-ludibrium-player-2' :
                                  getBoxPlayerIndex(12) === 2 ? 'border-ludibrium-player-3' :
                                  'border-ludibrium-player-4'
                                }`}></div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {index < 8 && (
                    <div id={`line-${stage}`} className="relative left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                      {lineBlocks.map((block, blockIndex) => (
                        <div
                          key={blockIndex}
                          className={`${block.height} ${block.width} ${block.gradient} border-2 border-black/10`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-[40vh]"></div>
      </div>
    </main>
  );
}