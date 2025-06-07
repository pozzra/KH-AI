
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import { DOWNLOADER_SIMULATION_DURATION, PLACEHOLDER_VIDEO_URL, PLACEHOLDER_VIDEO_POSTER_URL } from '../constants';

interface DownloaderPageProps {
  setCurrentView: (view: AppView) => void;
}

const DownloaderPage: React.FC<DownloaderPageProps> = ({ setCurrentView }) => {
  const { t } = useLanguage();
  const [videoUrl, setVideoUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [isVideoSaved, setIsVideoSaved] = useState(false);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|tiktok\.com|facebook\.com)\/.+/i.test(url);
    } catch (_) {
      return false;
    }
  };

  const handleDownload = () => {
    if (!videoUrl.trim()) {
      setStatusMessage(t('invalidUrlStatus'));
      setShowExplanation(false);
      setShowVideoPlayer(false);
      return;
    }
    if (!isValidUrl(videoUrl)) {
      setStatusMessage(t('downloadFailedStatus', videoUrl));
      setShowExplanation(false);
      setShowVideoPlayer(false);
      return;
    }

    setIsSimulating(true);
    setStatusMessage(t('simulatingDownloadStatus', videoUrl));
    setShowExplanation(false);
    setShowVideoPlayer(false);
    setIsVideoSaved(false);

    setTimeout(() => {
      setIsSimulating(false);
      const success = Math.random() > 0.1; // 90% chance of "success"
      if (success) {
        setStatusMessage(t('downloadCompleteStatus', videoUrl));
        setShowVideoPlayer(true);
      } else {
        setStatusMessage(t('downloadFailedStatus', videoUrl));
        setShowVideoPlayer(false);
      }
      setShowExplanation(true); // Show explanation after simulation
    }, DOWNLOADER_SIMULATION_DURATION);
  };

  const handleSaveVideo = () => {
    setIsVideoSaved(true);
    console.log("Simulated: Video saved! URL:", PLACEHOLDER_VIDEO_URL);
    // In a real app, this would trigger a download or save to a user's library
  };

  // Reset video player when URL input changes
  useEffect(() => {
    setShowVideoPlayer(false);
    setIsVideoSaved(false);
    if(videoUrl === '') setStatusMessage('');
  }, [videoUrl]);


  return (
    <div className="flex flex-col h-full w-full bg-gray-800 dark:bg-gray-900 shadow-xl text-gray-100 dark:text-gray-100">
      <header className="flex items-center justify-between p-4 border-b border-gray-700 dark:border-gray-700 shrink-0">
        <h1 className="text-xl font-semibold text-sky-400 dark:text-sky-400">{t('videoDownloaderTitle')}</h1>
        <button
          onClick={() => setCurrentView('chat')}
          className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors"
        >
          {t('backToChatButton')}
        </button>
      </header>

      <main className="flex-grow p-6 space-y-6 overflow-y-auto flex flex-col items-center">
        <div className="w-full max-w-2xl bg-gray-700 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
              {t('videoUrlInputLabel')}
            </label>
            <input
              type="url"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder={t('videoUrlInputPlaceholder')}
              className="w-full px-4 py-3 bg-gray-600 dark:bg-gray-700 border border-gray-500 dark:border-gray-600 rounded-md text-gray-100 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              disabled={isSimulating}
            />
          </div>

          <button
            onClick={handleDownload}
            disabled={isSimulating}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSimulating ? (
              <LoadingSpinner size="sm" color="text-white" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            )}
            <span>{t('startDownloadButton')}</span>
          </button>

          {statusMessage && (
            <div className={`mt-6 p-4 rounded-md text-sm ${
              statusMessage.includes(t('downloadCompleteStatus','').split(':')[0]) ? 'bg-green-700 dark:bg-green-800 bg-opacity-30 dark:bg-opacity-40 text-green-300 dark:text-green-300' 
              : statusMessage.includes(t('downloadFailedStatus','').split(':')[0]) || statusMessage.includes(t('invalidUrlStatus','').split(':')[0]) ? 'bg-red-700 dark:bg-red-800 bg-opacity-30 dark:bg-opacity-40 text-red-300 dark:text-red-300' 
              : 'bg-sky-700 dark:bg-sky-800 bg-opacity-30 dark:bg-opacity-40 text-sky-300 dark:text-sky-300'
            }`}>
              <p>{statusMessage}</p>
            </div>
          )}

          {showVideoPlayer && (
            <div className="mt-6 p-4 bg-gray-600 dark:bg-gray-700 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-sky-300 dark:text-sky-400 mb-3">{t('videoPlayerTitle')}</h3>
              <video
                key={PLACEHOLDER_VIDEO_URL} // Add key to force re-render if URL changes, though it's constant here
                className="w-full rounded-md"
                controls
                poster={PLACEHOLDER_VIDEO_POSTER_URL}
                preload="metadata" // preload metadata for poster and duration
              >
                <source src={PLACEHOLDER_VIDEO_URL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button
                onClick={handleSaveVideo}
                disabled={isVideoSaved}
                className="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isVideoSaved ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('videoSavedFeedback')}</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    <span>{t('saveVideoButtonLabel')}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        

        {showExplanation && (
          <div className="w-full max-w-2xl mt-6 p-4 bg-yellow-700 dark:bg-yellow-800 bg-opacity-40 text-yellow-200 dark:text-yellow-300 rounded-lg text-sm shadow">
            <p className="font-semibold mb-1">Important Note:</p>
            <p>{t('downloaderExplanation')}</p>
          </div>
        )}
        
        <div className="mt-8 flex space-x-6 items-center">
            <span className="text-gray-400 dark:text-gray-500 text-sm">Supports (Simulated):</span>
            <svg aria-label={t('youtubeIconLabel')} className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
            <svg aria-label={t('tiktokIconLabel')} className="w-7 h-7 text-gray-200 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.47.03-4.8-.73-6.56-2.34-1.45-1.34-2.2-3.14-2.26-5.05-.02-1.36-.01-2.73 0-4.09.01-1.09.36-2.15 1.02-3.02 1.11-1.52 2.82-2.34 4.64-2.37.01-.01.01-.01.02-.01.08-.01.16-.01.24-.02.01-3.69.01-7.38.01-11.07Zm3.23 12.33c.32.01.63-.04.93-.11.27-.06.53-.17.78-.29.3-.13.58-.29.81-.49.19-.17.33-.39.49-.59v-3.14c-.28.16-.58.29-.89.39-.32.09-.64.15-.98.17-.01 0-.01.01-.02.01-.19.01-.39.01-.58.01h-.03c-.36.01-.72.01-1.08.01-.01 1.44-.01 2.89-.01 4.33.01.03.01.06.01.09.09.03.19.03.29.03.11.01.21.01.32.01.19.01.39.01.58.01Z"></path></svg>
            <svg aria-label={t('facebookIconLabel')} className="w-7 h-7 text-blue-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z"></path></svg>
        </div>

      </main>
    </div>
  );
};

export default DownloaderPage;