'use client';

import { useLanguage } from '../../../../../../../contexts/LanguageContext';
import Link from 'next/link';

export default function DarkRoom() {
  const { t } = useLanguage();
  // Platform types: 0 = hidden, 1 = gray, 2 = special

  const leftPlatformTypes = [
    [0, 0, 2, 1, 0, 0],
    [0, 1, 0, 1, 1, 1],
    [1, 0, 1, 1, 1, 1],
    [2, 1, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 2],
    [0, 1, 2, 1, 1, 0],
    [2, 1, 0, 0, 0, 0]
  ];

  const rightPlatformTypes = [
    [0, 0, 0, 1, 2, 0],
    [2, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 1, 0],
    [0, 0, 1, 2, 1, 0],
    [2, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 2],
    [0, 1, 1, 0, 0, 0]
  ];

  const getPlatformStyle = (type: number) => {
    switch (type) {
      case 0:
        return 'invisible';
      case 1:
        return 'bg-gray-800';
      case 2:
        return 'bg-white/90';
      default:
        return 'invisible';
    }
  };

  return (
    <div className="flex flex-col bg-black p-8 rounded-lg">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-altText-primary">{t('pages.orbisPQ.rooms.lounge.room304')}</h1>
        <h3 className="text-altText-secondary text-sm font-semibold mt-2">{t('pages.orbisPQ.rooms.lounge.collectPieces')}</h3>
      </div>
      <div className="flex w-full justify-center items-end h-[calc(100%-4rem)] max-w-3xl mx-auto">
        {/* Left Section - 6x9 Platform */}
        <div className="w-1/3 overflow-hidden pb-4 sm:pb-10">
          <div className="grid grid-cols-6 gap-y-0 sm:gap-y-2">
            {leftPlatformTypes.map((row, rowIndex) => (
              row.map((type, colIndex) => (
                <div
                  key={`left-${rowIndex}-${colIndex}`}
                  className={`w-[4vw] h-3 sm:h-4 rounded-sm ${getPlatformStyle(type)}`}
                />
              ))
            ))}
          </div>
        </div>

        {/* Middle Section - Exit */}
        <div className="w-1/3 flex justify-center">
          <Link
            href="../"
            className="block w-12 h-12 sm:w-24 sm:h-24 bg-gradient-to-b from-door-dark to-door-dark-bottom rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:ring-2 hover:ring-altText-tertiary"
          >
            <span className="text-altText-primary font-semibold">{t('pages.orbisPQ.rooms.common.exit')}</span>
          </Link>
        </div>

        {/* Right Section - 6x7 Platform */}
        <div className="w-1/3 overflow-hidden pb-4 sm:pb-10">
          <div className="grid grid-cols-6 gap-y-0 sm:gap-y-2">
            {rightPlatformTypes.map((row, rowIndex) => (
              row.map((type, colIndex) => (
                <div
                  key={`right-${rowIndex}-${colIndex}`}
                  className={`w-[4vw] h-3 sm:h-4 rounded-sm ${getPlatformStyle(type)}`}
                />
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 