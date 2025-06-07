
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as Theme);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="theme-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('themeLabel')}
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={handleChange}
        className="block w-full pl-3 pr-10 py-2 text-base bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md text-gray-900 dark:text-gray-100"
        aria-label={t('themeLabel')}
      >
        <option value={Theme.LIGHT}>{t('themeLight')}</option>
        <option value={Theme.DARK}>{t('themeDark')}</option>
        <option value={Theme.SYSTEM}>{t('themeSystem')}</option>
      </select>
    </div>
  );
};

export default ThemeSelector;
