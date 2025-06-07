

import React, { useState, useEffect, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage.tsx'; // Added .tsx extension
import Sidebar from './components/Sidebar';
import DownloaderPage from './components/DownloaderPage'; 
import { useLanguage } from './contexts/LanguageContext';
import { User, ChatHistoryItem, ChatMessage, AppView } from './types'; 
import * as storageService from './services/storageService';
import { Language } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'ok' | 'missing'>('checking');
  const { t, language } = useLanguage(); 

  const [chatHistories, setChatHistories] = useState<ChatHistoryItem[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [currentView, setCurrentView] = useState<AppView>('chat'); 

  useEffect(() => {
    if (process.env.API_KEY && process.env.API_KEY !== "YOUR_GEMINI_API_KEY" && process.env.API_KEY.length > 10) {
      setApiKeyStatus('ok');
    } else {
      setApiKeyStatus('missing');
    }
  }, []);

  useEffect(() => {
    if (apiKeyStatus === 'ok' && currentUser) {
      const loadedHistories = storageService.loadChatHistory();
      setChatHistories(loadedHistories);
      if (loadedHistories.length > 0) {
        setActiveChatId(loadedHistories[0].id); 
      } else {
        handleNewChat(); 
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeyStatus, currentUser]); 


  const handleLogin = (username: string) => {
    setCurrentUser({ username });
  };

  // Logout functionality removed as per user request (no button)
  // const handleLogout = () => {
  //   setCurrentUser(null);
  //   setChatHistories([]);
  //   setActiveChatId(null);
  //   setCurrentView('chat'); 
  // };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = useCallback(() => {
    if (!currentUser) return; 
    const newChatId = `chat_${Date.now()}`;
    const newChat: ChatHistoryItem = {
      id: newChatId,
      title: t('defaultChatTitle', new Date().toLocaleString()), 
      messages: [], 
      lastModified: Date.now(),
    };
    const updatedHistories = storageService.addOrUpdateChatSession(newChat);
    setChatHistories(updatedHistories);
    setActiveChatId(newChatId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, t]); 


  const handleSelectChat = (sessionId: string) => {
    const selectedChat = chatHistories.find(ch => ch.id === sessionId);
    if (selectedChat) {
        setActiveChatId(sessionId);
        if (window.innerWidth < 768) { 
          setIsSidebarOpen(false); 
        }
    } else {
        console.error("Selected chat not found in history.");
        if (chatHistories.length > 0) {
            setActiveChatId(chatHistories[0].id);
        } else {
            handleNewChat();
        }
    }
  };

  const handleDeleteChat = (sessionId: string) => {
    const updatedHistories = storageService.deleteChatSession(sessionId);
    setChatHistories(updatedHistories);
    if (activeChatId === sessionId) {
      if (updatedHistories.length > 0) {
        setActiveChatId(updatedHistories[0].id); 
      } else {
        handleNewChat(); 
      }
    }
  };

  const handleSaveChat = (sessionId: string, messages: ChatMessage[]) => {
    if (!sessionId) {
        console.warn("Attempted to save chat with no active session ID.");
        return;
    }
    const currentSession = chatHistories.find(ch => ch.id === sessionId);
    const title = currentSession?.title === t('defaultChatTitle', new Date(currentSession.lastModified).toLocaleString()) || !currentSession?.title
                  ? storageService.generateChatTitle(messages, t('defaultChatTitle', new Date().toLocaleString()))
                  : currentSession.title;

    const sessionToSave: ChatHistoryItem = {
      id: sessionId,
      title: title,
      messages: messages,
      lastModified: Date.now(),
    };
    const updatedHistories = storageService.addOrUpdateChatSession(sessionToSave);
    setChatHistories(updatedHistories);
  };
  
  useEffect(() => {
    if (apiKeyStatus === 'ok' && !currentUser) {
      setCurrentUser({ username: t('defaultUsername') || 'Chat User' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKeyStatus, t]); 


  if (apiKeyStatus === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading API Key status...
      </div>
    );
  }

  if (apiKeyStatus === 'missing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-red-400 p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('errorPrefix')} API Key Issue</h1>
        <p>{t('apiKeyMissing')}</p>
        <p className="mt-2 text-sm text-gray-400">Please ensure the <code>API_KEY</code> is correctly set in <code>index.html</code> or your environment.</p>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const activeChatMessages = chatHistories.find(ch => ch.id === activeChatId)?.messages || [];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {currentView === 'chat' && (
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={handleToggleSidebar} 
          histories={chatHistories}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />
      )}
      <div className={`flex-grow flex flex-col transition-all duration-300 ease-in-out ${currentView === 'chat' && isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        {currentView === 'chat' ? (
          activeChatId ? (
            <ChatPage
              key={activeChatId} 
              user={currentUser}
              // onLogout={handleLogout} // Removed onLogout prop
              chatId={activeChatId}
              initialMessages={activeChatMessages}
              onSaveChat={handleSaveChat}
              isSidebarOpen={isSidebarOpen} 
              toggleSidebar={handleToggleSidebar} 
              setCurrentView={setCurrentView}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">{chatHistories.length > 0 ? t('selectLanguage') : t('noChatsYet')}</p> 
            </div>
          )
        ) : (
          <DownloaderPage setCurrentView={setCurrentView} />
        )}
      </div>
    </div>
  );
};

export default App;