
import React, { useState } from 'react';
import { ChatHistoryItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void; // Kept for the internal "X" close button on mobile
  histories: ChatHistoryItem[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  histories,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}) => {
  const { t } = useLanguage();
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null); // Stores ID of chat to delete

  const handleDeleteClick = (e: React.MouseEvent, chatId: string, chatTitle: string) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    setShowConfirmDelete(chatId);
  };

  const confirmDelete = () => {
    if (showConfirmDelete) {
      onDeleteChat(showConfirmDelete);
      setShowConfirmDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };
  
  const getChatTitle = (chat: ChatHistoryItem) => {
    return chat.title || t('defaultChatTitle', new Date(chat.lastModified).toLocaleString());
  };


  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
            className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
            onClick={toggleSidebar} // Allows closing by clicking overlay
            aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 shadow-lg z-40 flex flex-col transition-transform duration-300 ease-in-out w-64 text-gray-100
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label={t('chatHistoryTitle')}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-sky-400">{t('chatHistoryTitle')}</h2>
          <button
            onClick={toggleSidebar} // This button is for mobile, to close the sidebar from within
            className="p-1 text-gray-400 hover:text-white md:hidden" 
            aria-label={t('sidebarToggleClose')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => {
            onNewChat();
            if (window.innerWidth < 768) toggleSidebar(); // Close sidebar on mobile after new chat
          }}
          className="m-3 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md transition-colors text-sm flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>{t('newChatButton')}</span>
        </button>

        <nav className="flex-grow overflow-y-auto p-3 space-y-1">
          {histories.length === 0 && (
            <p className="text-gray-400 text-sm text-center px-2 py-4">{t('noChatsYet')}</p>
          )}
          {histories.map(chat => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)} // App.tsx handles closing sidebar on mobile here
              onKeyDown={(e) => e.key === 'Enter' && onSelectChat(chat.id)}
              role="button"
              tabIndex={0}
              aria-current={chat.id === activeChatId ? 'page' : undefined}
              className={`group flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors text-sm
                                ${chat.id === activeChatId 
                                    ? 'bg-sky-700 text-white font-semibold' 
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-gray-100'}`}
            >
              <span className="truncate flex-grow pr-2">{getChatTitle(chat)}</span>
              <button
                onClick={(e) => handleDeleteClick(e, chat.id, getChatTitle(chat))}
                aria-label={`${t('deleteChatButtonLabel')} ${getChatTitle(chat)}`}
                className={`p-1 rounded opacity-60 group-hover:opacity-100 transition-opacity 
                                  ${chat.id === activeChatId 
                                    ? 'text-sky-200 hover:text-white hover:bg-sky-600' 
                                    : 'text-gray-400 hover:text-red-400 hover:bg-gray-600'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.032 3.223.094M7.5 3.75l.75 1.5h7.5l.75-1.5M21 9.75H3" />
                </svg>
              </button>
            </div>
          ))}
        </nav>
      </div>

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm sm:max-w-sm m-4 sm:m-0">
            <h3 className="text-lg font-semibold text-sky-400 mb-4">{t('confirmDeleteChatTitle')}</h3>
            <p className="text-gray-300 mb-6 text-sm">
              {t('confirmDeleteChatMessage', getChatTitle(histories.find(h=>h.id === showConfirmDelete)!) || 'this chat')}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                {t('cancelButton')}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                {t('deleteButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;