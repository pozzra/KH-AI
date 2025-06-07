
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-sky-400 mb-8">{t('loginTitle')}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              {t('usernameLabel')}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-gray-100"
              placeholder="E.g., Ada Lovelace"
              required
            />
          </div>
          {/* Dummy password field for UI consistency, not used for auth */}
          <div>
             <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              {t('passwordLabel')}
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-gray-100"
              placeholder="************"
              defaultValue="dummyPassword" 
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-500 transition-colors duration-150"
          >
            {t('loginButton')}
          </button>
        </form>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <LanguageSelector />
        </div>
      </div>
       <footer className="mt-12 text-center text-gray-400 text-sm">
        {t('appPoweredBy')}
      </footer>
    </div>
  );
};

export default LoginPage;