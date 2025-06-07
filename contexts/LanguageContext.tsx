

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { translations, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, Language } from '../constants';
import { TranslationSet } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof TranslationSet, ...args: (string | number)[]) => string; // Use keyof for type safety
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const storedLang = localStorage.getItem('appLanguage') as Language;
    return SUPPORTED_LANGUAGES.includes(storedLang) ? storedLang : DEFAULT_LANGUAGE;
  });

  const setLanguage = (lang: Language) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('appLanguage', lang);
    }
  };

  const t = useCallback((key: keyof TranslationSet, ...args: (string | number)[]) => {
    const currentTranslationsMap: TranslationSet | undefined = translations[language];
    const defaultTranslationsMap: TranslationSet = translations[DEFAULT_LANGUAGE];
    
    let translationText: string;

    if (currentTranslationsMap && typeof currentTranslationsMap[key] === 'string') {
      translationText = String(currentTranslationsMap[key]); // Explicit conversion
    } else if (defaultTranslationsMap && typeof defaultTranslationsMap[key] === 'string') {
      translationText = String(defaultTranslationsMap[key]); // Explicit conversion
    } else {
      // Fallback to the key itself if no translation found
      translationText = String(key); // `key` is already a string, String(key) is fine and returns primitive string
    }
    
    if (args.length > 0) {
        args.forEach((arg, index) => {
            const placeholder = new RegExp(`\\{${index}\\}`, 'g');
            const replacement = String(arg); // Explicit conversion of arg to string
            translationText = translationText.replace(placeholder, replacement);
        });
    }
    return translationText;
  }, [language]);


  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};