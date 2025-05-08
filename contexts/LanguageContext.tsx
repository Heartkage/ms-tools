'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import enMessages from '../messages/en.json';
import zhMessages from '../messages/zh.json';

type Language = 'en' | 'zh';
type Messages = typeof enMessages;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const messages: Record<Language, typeof enMessages> = {
  en: enMessages,
  zh: zhMessages as typeof enMessages
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Function to get user's preferred language
const getUserPreferredLanguage = (): Language => {
  // First check localStorage
  const savedLanguage = localStorage.getItem('language') as Language;
  if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
    return savedLanguage;
  }

  // Then check browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }
  
  // Default to English
  return 'en';
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(getUserPreferredLanguage);

  const t = (key: string, params?: Record<string, string>) => {
    const keys = key.split('.');
    let value: any = messages[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    
    let result = value as string;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        result = result.replace(`{${key}}`, value);
      });
    }
    
    return result;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 