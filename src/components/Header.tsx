'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleLanguage = (newLanguage: 'en' | 'es') => {
    setLanguage(newLanguage);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            ✨ {t('header.title')}
          </h1>
          
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 transition-all duration-200 border border-pink-200"
            >
              <span className="text-lg">{language === 'en' ? '🇺🇸' : '🇪🇸'}</span>
              <span className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'EN' : 'ES'}
              </span>
              <svg 
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <button
                  onClick={() => toggleLanguage('en')}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 rounded-t-lg ${
                    language === 'en' ? 'bg-pink-50 text-pink-700' : 'text-gray-700'
                  }`}
                >
                  <span>🇺🇸</span>
                  <span className="text-sm">{t('language.english')}</span>
                </button>
                <button
                  onClick={() => toggleLanguage('es')}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 rounded-b-lg ${
                    language === 'es' ? 'bg-pink-50 text-pink-700' : 'text-gray-700'
                  }`}
                >
                  <span>🇪🇸</span>
                  <span className="text-sm">{t('language.spanish')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}