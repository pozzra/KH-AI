

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, ChatMessage as Message, AppView } from '../types';
import { Chat, Part, Content } from '@google/genai';
import { startChatSession, sendMessageStream } from '../services/geminiService';
import MessageBubble from './MessageBubble.tsx'; 
import LoadingSpinner from './LoadingSpinner';
import LanguageSelector from './LanguageSelector';
// import ThemeSelector from './ThemeSelector'; // Removed ThemeSelector
import CodeSimulationModal from './CodeSimulationModal'; 
import EditUserMessageModal from './EditUserMessageModal'; // Import edit modal
import { useLanguage } from '../contexts/LanguageContext';
import { MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB, ALLOWED_IMAGE_TYPES } from '../constants'; 
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

const convertMessagesToGeminiHistory = (messages: Message[]): Content[] => {
  const history: Content[] = [];
  messages.forEach(msg => {
    if (msg.sender === 'user' || msg.sender === 'ai') {
      const parts: Part[] = [];
      if (msg.text) parts.push({ text: msg.text });
      if (msg.imageBase64 && msg.imageMimeType && msg.sender === 'user') { 
        parts.push({ inlineData: { data: msg.imageBase64, mimeType: msg.imageMimeType } });
      }
      if (parts.length > 0) {
        history.push({ role: msg.sender === 'user' ? 'user' : 'model', parts });
      }
    }
  });
  return history;
};


interface ChatPageProps {
  user: User;
  // onLogout: () => void; // Removed onLogout prop
  chatId: string; 
  initialMessages: Message[];
  onSaveChat: (chatId: string, messages: Message[]) => void;
  isSidebarOpen?: boolean; 
  toggleSidebar?: () => void; 
  setCurrentView: (view: AppView) => void;
}

interface EditingMessageContent {
  id: string;
  text: string;
  imageBase64?: string;
  imageMimeType?: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ 
    user, 
    // onLogout, // Removed onLogout prop
    chatId, 
    initialMessages, 
    onSaveChat,
    isSidebarOpen,
    toggleSidebar,
    setCurrentView,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiChatError, setGeminiChatError] = useState<string | null>(null);
  const [geminiChat, setGeminiChat] = useState<Chat | null>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [activelySpeakingMessageId, setActivelySpeakingMessageId] = useState<string | null>(null);

  // State for code simulation modal
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [currentCodeToSimulate, setCurrentCodeToSimulate] = useState<string | null>(null);

  // State for editing user messages
  const [isEditUserMessageModalOpen, setIsEditUserMessageModalOpen] = useState(false);
  const [editingMessageContent, setEditingMessageContent] = useState<EditingMessageContent | null>(null);


  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); 
  const { t, language } = useLanguage();

  const {
    isListening,
    transcript,
    interimTranscript,
    error: sttError,
    isSupported: sttIsSupported,
    speechPaused, 
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const {
    isSpeaking: ttsIsSpeakingGlobal, 
    error: ttsError,
    isSupported: ttsIsSupported,
    speak: ttsSpeak,
    cancel: ttsCancel,
  } = useSpeechSynthesis();

  const initializeCurrentChat = useCallback(async (messagesToInitWith: Message[]) => {
    setIsLoading(true);
    setGeminiChatError(null);
    let currentMessages = [...messagesToInitWith]; 

    try {
      const geminiHistory = convertMessagesToGeminiHistory(messagesToInitWith);
      const activeLanguageInstruction = t('aiResponseLanguageInstruction');
      const chat = startChatSession(geminiHistory, activeLanguageInstruction);
      setGeminiChat(chat);

      if (messagesToInitWith.length === 0 && !currentMessages.some(m => m.sender === 'system')) {
        const systemGreetingText = t('systemGreeting');
        const systemMessage: Message = {
          id: `system_${Date.now()}`,
          text: systemGreetingText,
          sender: 'system',
          timestamp: Date.now()
        };
        currentMessages = [systemMessage, ...currentMessages];
         setMessages(currentMessages); // Update state if greeting is added
         // Auto-speak system greeting - REMOVED TO PREVENT "not-allowed" error
        // if (ttsIsSupported && systemGreetingText) {
        //   ttsSpeak(systemGreetingText, language, {
        //     onStart: () => setActivelySpeakingMessageId(systemMessage.id),
        //     onEnd: () => { if (activelySpeakingMessageId === systemMessage.id) setActivelySpeakingMessageId(null); },
        //     onError: () => { if (activelySpeakingMessageId === systemMessage.id) setActivelySpeakingMessageId(null); }
        //   });
        // }
      } else if (messagesToInitWith.length > 0 && messages !== messagesToInitWith) {
        // If messagesToInitWith is different from current state (e.g. after edit)
        setMessages(messagesToInitWith);
      }
      
    } catch (e: any) {
      console.error("Failed to initialize chat session:", e);
      const errorMessage = t('failedToInitSession') + (e.message ? `: ${e.message}` : '');
      setGeminiChatError(errorMessage);
      const errorMsg: Message = {
        id: `error_${Date.now()}`,
        text: errorMessage,
        sender: 'error',
        timestamp: Date.now()
      };
      if (!currentMessages.some(m => m.id === errorMsg.id)) {
        currentMessages = [...currentMessages, errorMsg];
      }
       setMessages(currentMessages);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, language]); // Removed tts dependencies


  useEffect(() => {
    // This effect runs when chatId changes or initializeCurrentChat function identity changes (due to language change)
    // It should initialize based on `initialMessages` prop from App.tsx when chat switches.
    initializeCurrentChat(initialMessages);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, initializeCurrentChat]); // initialMessages is stable per chatId from App.tsx.

   useEffect(() => {
    if (ttsIsSpeakingGlobal && !activelySpeakingMessageId) {
       // This case seems unlikely unless speech started without setting activelySpeakingMessageId
    } else if (!ttsIsSpeakingGlobal && activelySpeakingMessageId) {
      setActivelySpeakingMessageId(null); 
    }
  }, [ttsIsSpeakingGlobal, activelySpeakingMessageId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      if (ttsIsSpeakingGlobal) {
        ttsCancel();
        setActivelySpeakingMessageId(null);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreviewUrl, ttsCancel]);

  useEffect(() => {
    if (transcript) {
      setCurrentInput(prev => (prev ? prev + ' ' : '') + transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; 
      if (scrollHeight > maxHeight) {
        textareaRef.current.style.height = `${maxHeight}px`;
        textareaRef.current.style.overflowY = 'auto';
      } else {
        textareaRef.current.style.height = `${scrollHeight}px`;
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  }, [currentInput]);

  const debouncedSaveChat = useRef(
    debounce((newMessages: Message[]) => {
        onSaveChat(chatId, newMessages);
    }, 1000)
  ).current;

  useEffect(() => {
    if (messages.length > 0 && chatId) { 
      const isOnlySystemGreeting = messages.length === 1 && messages[0].sender === 'system' && messages[0].text === t('systemGreeting');
      // Check if messages actually changed from initialMessages or if it's not just the greeting
      const messagesChangedFromInitial = JSON.stringify(messages) !== JSON.stringify(initialMessages);

      if ((!isOnlySystemGreeting || initialMessages.length > 0) && (messagesChangedFromInitial || messages.length > initialMessages.length || (initialMessages.length === 0 && messages.length > 1) )) { 
         debouncedSaveChat(messages);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, chatId, onSaveChat, t]); // Removed initialMessages, was causing too frequent saves

  const handleImageUploadClick = () => {
    setFileError(null); 
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError(null);
    setImagePreviewUrl(null); 
    setSelectedFile(null);

    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setFileError(t('invalidImageTypeError'));
        return;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setFileError(t('imageTooLargeError', MAX_IMAGE_SIZE_MB.toString()));
        return;
      }
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreviewUrl(preview);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const sendAIMessage = async (chatInstance: Chat, messageToSend: Message, currentMessageHistory: Message[]) => {
    setIsLoading(true);
    setGeminiChatError(null);
    
    let aiResponseText = '';
    let aiMessageId = '';
    let finalAiMessages = [...currentMessageHistory]; // Start with the history that includes the user message

    try {
        const parts: Part[] = [];
        if (messageToSend.text) parts.push({ text: messageToSend.text });
        if (messageToSend.imageBase64 && messageToSend.imageMimeType) {
            parts.push({
            inlineData: { data: messageToSend.imageBase64, mimeType: messageToSend.imageMimeType },
            });
        }
        
        if (parts.length === 0) throw new Error("No content to send.");

        const messageContentForAPI: string | Part[] = parts.length === 1 && parts[0].text && !messageToSend.imageBase64 
                                                        ? parts[0].text 
                                                        : parts;

        const stream = await sendMessageStream(chatInstance, messageContentForAPI);

        for await (const chunk of stream) {
            const chunkText = chunk.text; 
            aiResponseText += chunkText;
            if (!aiMessageId) {
            aiMessageId = `ai_${Date.now()}`;
            const newAiMessage: Message = { id: aiMessageId, text: aiResponseText, sender: 'ai', timestamp: Date.now() };
            finalAiMessages = [...finalAiMessages, newAiMessage];
            setMessages(finalAiMessages);
            } else {
            finalAiMessages = finalAiMessages.map(msg =>
                msg.id === aiMessageId ? { ...msg, text: aiResponseText, timestamp: Date.now() } : msg
                );
            setMessages(finalAiMessages);
            }
        }
        if (!aiResponseText && !aiMessageId && currentMessageHistory.some(m => m.id === messageToSend.id)) { 
            const emptyResponseMsg: Message = {
                id: `ai_empty_${Date.now()}`,
                text: "[AI returned an empty response]",
                sender: 'ai',
                timestamp: Date.now()
            };
            finalAiMessages = [...finalAiMessages, emptyResponseMsg];
            setMessages(finalAiMessages);
        }
        
        // Auto-speak AI response if feature is enabled - DISABLED BY USER REQUEST
        // if (aiResponseText && ttsIsSupported) {
        //    ttsSpeak(aiResponseText, language, {
        //     onStart: () => setActivelySpeakingMessageId(aiMessageId || `ai_temp_${Date.now()}`),
        //     onEnd: () => { if (activelySpeakingMessageId === (aiMessageId || `ai_temp_${Date.now()}`)) setActivelySpeakingMessageId(null); },
        //     onError: () => { if (activelySpeakingMessageId === (aiMessageId || `ai_temp_${Date.now()}`)) setActivelySpeakingMessageId(null); }
        //   });
        // }


    } catch (err: any) {
        console.error("Error sending message or processing stream:", err);
        const errorMessageText = err.message || t('failedToSendMessage');
        setGeminiChatError(errorMessageText);
        const errorMsg : Message = { id: `error_${Date.now()}`, text: `${t('errorPrefix')} ${errorMessageText}`, sender: 'error', timestamp: Date.now() };
        // Ensure user message is part of the final error display if it wasn't already
        let messagesWithError = currentMessageHistory;
        if (!messagesWithError.find(m => m.id === messageToSend.id)) {
            messagesWithError = [...messagesWithError, messageToSend];
        }
        setMessages([...messagesWithError, errorMsg]);
    } finally {
        setIsLoading(false);
    }
  };


  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); 
    if (isListening) stopListening(); 
    if (ttsIsSpeakingGlobal) {
      ttsCancel(); 
      setActivelySpeakingMessageId(null);
    }
    
    const textInput = currentInput.trim();
    if (!textInput && !selectedFile) return;
    if (!geminiChat || isLoading) return;

    // setIsLoading(true); // Moved to sendAIMessage
    // setGeminiChatError(null); // Moved to sendAIMessage
    setFileError(null);

    let imageBase64Data: string | undefined = undefined;
    let imageMimeTypeData: string | undefined = undefined;
    let imageWasPartOfMessage = false;
    
    if (selectedFile) {
      try {
        imageBase64Data = await fileToBase64(selectedFile);
        imageMimeTypeData = selectedFile.type;
        imageWasPartOfMessage = true;
      } catch (err) {
        console.error("Error converting file to base64:", err);
        const fileProcessingError = "Failed to process image.";
        setGeminiChatError(fileProcessingError); 
        setFileError(fileProcessingError);
        setIsLoading(false);
        return;
      }
    }
    
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: textInput,
      sender: 'user',
      timestamp: Date.now(),
      ...(imageBase64Data && imageMimeTypeData && { imageBase64: imageBase64Data, imageMimeType: imageMimeTypeData }),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    setCurrentInput('');
    if (imageWasPartOfMessage) {
        clearSelectedFile(); 
    }
    
    await sendAIMessage(geminiChat, userMessage, updatedMessages);
  };

  const handleMicButtonClick = () => {
    if (!sttIsSupported) {
      setGeminiChatError(t('sttUnsupported'));
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      if (ttsIsSpeakingGlobal) {
         ttsCancel(); 
         setActivelySpeakingMessageId(null);
      }
      setCurrentInput(''); 
      startListening();
    }
  };

  const handleSpeakIconClick = (messageId: string, text: string) => {
    if (!ttsIsSupported) return;

    if (ttsIsSpeakingGlobal && activelySpeakingMessageId === messageId) {
        ttsCancel();
        setActivelySpeakingMessageId(null);
    } else {
        if (ttsIsSpeakingGlobal) ttsCancel(); 
        ttsSpeak(text, language, {
            onStart: () => setActivelySpeakingMessageId(messageId),
            onEnd: () => { if (activelySpeakingMessageId === messageId) setActivelySpeakingMessageId(null); },
            onError: () => { if (activelySpeakingMessageId === messageId) setActivelySpeakingMessageId(null); }
        });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 

      const canSubmit = !(
        isLoading ||
        !geminiChat ||
        (isListening && (!speechPaused || !currentInput.trim())) ||
        (!isListening && !currentInput.trim() && !selectedFile)
      );

      if (canSubmit) {
        handleSendMessage();
      }
    }
  };
  
  const handleRunCode = (code: string) => {
    setCurrentCodeToSimulate(code);
    setIsCodeModalOpen(true);
  };

  const handleCloseCodeModal = () => {
    setIsCodeModalOpen(false);
    setCurrentCodeToSimulate(null);
  };

  const handleEditMessageClick = (messageId: string, currentText: string, imageBase64?: string, imageMimeType?: string) => {
    setEditingMessageContent({ id: messageId, text: currentText, imageBase64, imageMimeType });
    setIsEditUserMessageModalOpen(true);
  };

  const handleCloseEditUserMessageModal = () => {
    setIsEditUserMessageModalOpen(false);
    setEditingMessageContent(null);
  };

  const handleSaveEditedUserMessage = async (newText: string) => {
    if (!editingMessageContent) return;

    const { id: editedMessageId, imageBase64: originalImageBase64, imageMimeType: originalImageMimeType } = editingMessageContent;
    
    const editMsgIndex = messages.findIndex(msg => msg.id === editedMessageId);
    if (editMsgIndex === -1) {
        console.error("Original message to edit not found");
        handleCloseEditUserMessageModal();
        return;
    }

    const historyPrefixMessages = messages.slice(0, editMsgIndex);
    
    const editedUserMessageObject: Message = {
      ...messages[editMsgIndex], // Retain original sender, timestamp (or update), etc.
      text: newText,
      id: `user_edited_${Date.now()}`, // New ID for React key and to signify it's a new interaction point
      timestamp: Date.now(), // Update timestamp
      imageBase64: originalImageBase64, // Preserve original image
      imageMimeType: originalImageMimeType,
    };

    const newMessagesStateAfterEdit = [...historyPrefixMessages, editedUserMessageObject];
    setMessages(newMessagesStateAfterEdit);
    
    setIsLoading(true);
    setGeminiChatError(null);

    try {
        const geminiHistoryForResend = convertMessagesToGeminiHistory(historyPrefixMessages);
        const activeLanguageInstruction = t('aiResponseLanguageInstruction');
        const newChatInstance = startChatSession(geminiHistoryForResend, activeLanguageInstruction);
        setGeminiChat(newChatInstance); // Update the chat instance

        await sendAIMessage(newChatInstance, editedUserMessageObject, newMessagesStateAfterEdit);

    } catch (e: any) {
        console.error("Error re-initializing chat or sending edited message:", e);
        setGeminiChatError(t('failedToSendMessage') + (e.message ? `: ${e.message}` : ''));
        // Optionally, revert messages or add an error message
        setIsLoading(false);
    }
    
    handleCloseEditUserMessageModal();
  };


  const SttErrorDisplay = sttError ? t(sttError) : null;
  const TtsErrorDisplay = ttsError ? t(ttsError) : null;

  return (
    <div className="flex flex-col h-full w-full bg-gray-800 shadow-xl text-gray-100">
      <header className="flex items-center justify-between p-4 border-b border-gray-700 shrink-0 flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="p-1 text-gray-400 hover:text-sky-400"
              aria-label={isSidebarOpen ? t('sidebarToggleClose') : t('sidebarToggleOpen')}
            >
              {isSidebarOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          )}
          <h1 className="text-xl font-semibold text-sky-400 truncate">{t('appTitleBrand')}</h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setCurrentView('downloader')}
            className="p-2 text-gray-400 hover:text-sky-400 transition-colors"
            aria-label={t('switchToDownloaderViewLabel')}
            title={t('switchToDownloaderViewLabel')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
          <LanguageSelector />
          {/* Logout button removed */}
        </div>
      </header>

      <main className="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-700">
        {!sttIsSupported && (
            <div className="p-2 text-yellow-400 text-sm text-center bg-yellow-900 bg-opacity-50 rounded-md">{t('sttUnsupported')}</div>
        )}
        {!ttsIsSupported && (
            <div className="p-2 text-yellow-400 text-sm text-center bg-yellow-900 bg-opacity-50 rounded-md">{t('ttsUnsupported')}</div>
        )}
        {messages.map(msg => (
          <MessageBubble 
            key={msg.id} 
            message={msg}
            onSpeakIconClick={handleSpeakIconClick}
            onRunCodeClick={handleRunCode}
            onEditMessageClick={handleEditMessageClick}
            activelySpeakingMessageId={activelySpeakingMessageId}
            ttsIsSpeakingGlobal={ttsIsSpeakingGlobal}
            ttsIsSupported={ttsIsSupported}
            currentLanguage={language}
            t={t}
          />
        ))}
        {isLoading && messages[messages.length -1]?.sender === 'user' && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-gray-600 text-gray-300 px-4 py-2 rounded-lg max-w-xs lg:max-w-md">
              <LoadingSpinner />
              <span>{t('aiTyping')}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

       {(geminiChatError || SttErrorDisplay || TtsErrorDisplay) && (
        <div className="p-2 border-t border-gray-700 text-red-400 text-sm text-center space-y-1 bg-gray-800 shrink-0">
          {geminiChatError && !messages.some(m => m.sender === 'error' && m.text.includes(geminiChatError)) && <p>{geminiChatError}</p>}
          {SttErrorDisplay && <p>{SttErrorDisplay}</p>}
          {TtsErrorDisplay && <p>{TtsErrorDisplay}</p>}
        </div>
      )}

      {imagePreviewUrl && (
        <div className="p-2 border-t border-gray-700 bg-gray-800 shrink-0">
          <div className="flex items-center space-x-2 p-2 bg-gray-600 rounded-md">
            <img src={imagePreviewUrl} alt={t('imagePreviewAlt')} className="h-16 w-16 object-cover rounded-md" />
            <div className="text-sm text-gray-300 overflow-hidden whitespace-nowrap overflow-ellipsis flex-grow">
              {selectedFile?.name}
            </div>
            <button
              onClick={clearSelectedFile}
              aria-label={t('clearSelectedImageButtonLabel')}
              className="p-1 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {fileError && ( 
        <div className="p-2 text-red-400 text-xs text-center bg-gray-800 border-t border-gray-700 pt-0 shrink-0">
          {fileError}
        </div>
      )}

      {isListening && (
        <div className="p-2 text-sky-300 text-sm text-center bg-gray-700 border-t border-gray-600 shrink-0">
          {interimTranscript ? <em>{interimTranscript}</em> : t('listeningStatus')}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 flex items-start space-x-3 bg-gray-800 shrink-0">
        <button 
          type="button"
          onClick={handleImageUploadClick}
          aria-label={t('uploadImageButtonLabel')}
          className="p-2 text-gray-400 hover:text-sky-400 transition-colors mt-[5px]"
          disabled={isLoading || !geminiChat || isListening}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
          </svg>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          onChange={handleFileChange}
          className="hidden"
          id="imageUpload"
          aria-hidden="true"
        />
        
        <button 
            type="button"
            onClick={handleMicButtonClick}
            aria-label={isListening ? t('stopRecordingButtonLabel') : t('recordMessageButtonLabel')}
            className={`p-2 transition-colors mt-[5px] ${ 
                isListening ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-sky-400'
            }`}
            disabled={isLoading || !geminiChat || !sttIsSupported}
        >
            {isListening ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 18.75a6.75 6.75 0 006.75-6.75v-3.5a.75.75 0 00-1.5 0v3.5a5.25 5.25 0 11-10.5 0v-3.5a.75.75 0 00-1.5 0v3.5A6.75 6.75 0 0012 18.75z" />
                    <path d="M8.625 9.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75H9A.75.75 0 009 11.25H8.625v-1.5zM15 11.25h.375a.75.75 0 00.75-.75v-1.5a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75zM.75 12a11.25 11.25 0 0011.25 11.25A11.25 11.25 0 0023.25 12 .75.75 0 0022.5 12h-3a.75.75 0 00-.75.75 7.5 7.5 0 01-15 0A.75.75 0 004.5 12h-3a.75.75 0 00-.75.75z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 00.75-.75v-3.75a.75.75 0 00-1.5 0v3.75a.75.75 0 00.75.75zM19.5 12a7.5 7.5 0 11-15 0m15 0v.004c0 .323-.01.642-.027.955a13.43 13.43 0 01-.735 3.093m1.066-6.076a13.51 13.51 0 01-1.019 3.033m1.019-3.033A13.44 13.44 0 0019.5 12c0-2.09-.48-4.045-1.333-5.757m1.333 5.757a13.51 13.51 0 01-1.019 3.033M3.75 12A7.5 7.5 0 1118.75 12M3.75 12h.004c.009 0 .018 0 .026-.002a13.43 13.43 0 01.735-3.093M3.723 8.95A13.51 13.51 0 014.742 5.917m-1.02 3.033A13.44 13.44 0 003.75 12c0 2.09.48 4.045 1.333 5.757m-1.333-5.757a13.51 13.51 0 011.019-3.033" />
                </svg>
            )}
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={currentInput}
          onChange={(e) => {
              if(!isListening) setCurrentInput(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? t('listeningStatus') : t('sendMessagePlaceholder')}
          className="flex-grow px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow resize-none overflow-y-hidden box-border"
          style={{minHeight: '46px'}} 
          disabled={isLoading || !geminiChat || (isListening && !speechPaused)} 
        />
        <button
          type="submit"
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end" 
          disabled={
            isLoading ||
            !geminiChat ||
            (isListening && (!speechPaused || !currentInput.trim())) ||
            (!isListening && !currentInput.trim() && !selectedFile)
          }
        >
          {isLoading ? <LoadingSpinner size="sm" /> : t('sendMessageButton')}
        </button>
      </form>
      
      <CodeSimulationModal
        isOpen={isCodeModalOpen}
        onClose={handleCloseCodeModal}
        codeToSimulate={currentCodeToSimulate}
        t={t}
      />
      <EditUserMessageModal
        isOpen={isEditUserMessageModalOpen}
        onClose={handleCloseEditUserMessageModal}
        initialText={editingMessageContent?.text || ""}
        onSave={handleSaveEditedUserMessage}
        t={t}
      />
    </div>
  );
};

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), waitFor);
  };
}

export default ChatPage;
