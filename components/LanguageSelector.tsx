
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { SUPPORTED_LANGUAGES, Language } from '../constants';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as Language);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="language-select" className="text-sm font-medium text-gray-300">
        {t('languageLabel')}
      </label>
      <select
        id="language-select"
        value={language}
        onChange={handleChange}
        className="block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md text-gray-100"
        aria-label={t('selectLanguage')}
      >
        {SUPPORTED_LANGUAGES.map(lang => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;