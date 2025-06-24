'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import Header from '../../../components/Header';

export default function RJPartyQuest() {
  const { t, tHtml } = useLanguage();
  const [activeStage, setActiveStage] = useState(1);

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

  const renderStageContent = () => {
    switch (activeStage) {
      case 2:
        return (
          <>
            
            <div className="absolute inset-0 bg-black rounded-lg flex flex-col items-center justify-between pb-5">
              <div className="text-altText-primary text-sm mt-4 mb-4 px-[10%]">
                <div dangerouslySetInnerHTML={tHtml('pages.rjPQ.stages.stage2.tip')} />
              </div>
              <div className="w-[30%] sm:w-[15%] aspect-square rounded-full bg-white/10 flex items-center justify-center">
                <div className="text-xxs sm:text-sm text-altText-primary text-center px-3 py-3">
                  {t(`pages.rjPQ.stages.stage${activeStage}.objective`)}
                </div>
              </div>
            </div>
          </>
        );
      default:
        return (
          <div className="text-2xl text-altText-primary">
            {t(`pages.rjPQ.stages.stage${activeStage}.content`)}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 mt-16">
          {t('pages.rjPQ.title')}
        </h1>

        {/* Stage Navigation */}
        <div className="flex justify-between items-center mb-6 px-4">
          <button
            onClick={handlePrevStage}
            disabled={activeStage === 1}
            className={`min-w-12 w-12 h-12 rounded-full flex items-center justify-center transition-colors mr-4 ${
              activeStage === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            ←
          </button>

          {stages.map((stage) => (
            <div key={stage} className="flex flex-col items-center">
              <button
                onClick={() => setActiveStage(stage)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm ${
                  activeStage === stage
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {stage}
              </button>
              <span className="text-xxs sm:text-sm text-gray-300 mt-1 text-center">
                {t(`pages.rjPQ.stages.stage${stage}.title`)}
              </span>
            </div>
          ))}

          <button
            onClick={handleNextStage}
            disabled={activeStage === stages.length}
            className={`min-w-12 w-12 h-12 rounded-full flex items-center justify-center transition-colors ml-4 ${
              activeStage === stages.length
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            →
          </button>
        </div>

        {/* Stage Content */}
        <div className="bg-gradient-to-b from-rj-background-dark via-rj-background-light to-rj-background-dark rounded-lg border-rj-background-border border-4 p-6 min-h-[50vh] flex flex-col items-center justify-center relative">
          {renderStageContent()}
        </div>
      </div>
    </div>
  );
}