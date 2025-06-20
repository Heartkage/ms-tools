import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header({ hasBackButton = false }: { hasBackButton?: boolean }) {
  const { t } = useLanguage();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            {hasBackButton ? (
              <Link href="./.." className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:scale-105 transition-all duration-200">
                <svg className="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-white font-medium leading-none pb-0.5">{t('navigation.back')}</span>
              </Link>
            ) : (
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/favicon-192.png" alt="MSTools Logo" className="w-8 h-8 rounded-lg shadow group-hover:scale-105 transition-transform" />
                </div>
                <h1 className="text-xl font-bold text-white group-hover:underline">MSTools</h1>
              </Link>
            )}
          </div>
          {/* Navigation Buttons and Language Switcher */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
} 