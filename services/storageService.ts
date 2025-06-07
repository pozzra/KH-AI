
import { ChatHistoryItem, ChatMessage } from '../types';
import { 
    CHAT_HISTORY_KEY, 
    USER_MESSAGE_FOR_TITLE_MAX_LENGTH, 
    MAX_TITLE_LENGTH
} from '../constants';

export const loadChatHistory = (): ChatHistoryItem[] => {
  try {
    const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    if (storedHistory) {
      const history = JSON.parse(storedHistory) as ChatHistoryItem[];
      // Sort by lastModified descending (newest first)
      return history.sort((a, b) => b.lastModified - a.lastModified);
    }
  } catch (error) {
    console.error("Error loading chat history from localStorage:", error);
  }
  return [];
};

export const saveChatHistory = (history: ChatHistoryItem[]): void => {
  try {
    // Ensure lastModified is updated for sorting consistency if not already
    const historyToSave = history.map(item => ({...item, lastModified: item.lastModified || Date.now()}));
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(historyToSave));
  } catch (error) {
    console.error("Error saving chat history to localStorage:", error);
  }
};

export const generateChatTitle = (messages: ChatMessage[], defaultTitle: string): string => {
  const firstUserMessage = messages.find(msg => msg.sender === 'user' && msg.text.trim() !== '');
  if (firstUserMessage && firstUserMessage.text) {
    let title = firstUserMessage.text.substring(0, USER_MESSAGE_FOR_TITLE_MAX_LENGTH);
    if (firstUserMessage.text.length > USER_MESSAGE_FOR_TITLE_MAX_LENGTH) {
      title += "...";
    }
    return title.length > MAX_TITLE_LENGTH ? title.substring(0, MAX_TITLE_LENGTH -3) + "..." : title;
  }
  const firstImageMessage = messages.find(msg => msg.sender === 'user' && msg.imageBase64);
  if (firstImageMessage) {
    return `Image: ${new Date(firstImageMessage.timestamp).toLocaleDateString()}`;
  }
  return defaultTitle;
};


export const addOrUpdateChatSession = (session: ChatHistoryItem): ChatHistoryItem[] => {
  let history = loadChatHistory();
  const existingIndex = history.findIndex(item => item.id === session.id);

  if (existingIndex > -1) {
    history[existingIndex] = { ...session, lastModified: Date.now() };
  } else {
    history.unshift({ ...session, lastModified: Date.now() }); // Add new sessions to the top
  }
  
  // Re-sort by lastModified to ensure newest is always first after update/add
  history.sort((a, b) => b.lastModified - a.lastModified);
  saveChatHistory(history);
  return history;
};

export const deleteChatSession = (sessionId: string): ChatHistoryItem[] => {
  let history = loadChatHistory();
  history = history.filter(item => item.id !== sessionId);
  saveChatHistory(history);
  return history;
};

export const getChatSession = (sessionId: string): ChatHistoryItem | undefined => {
  const history = loadChatHistory();
  return history.find(item => item.id === sessionId);
};
