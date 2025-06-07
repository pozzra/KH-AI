
import React, { useState } from 'react';
import { ChatMessage, Language, TranslationSet } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
  onSpeakIconClick?: (messageId: string, text: string) => void;
  onRunCodeClick?: (code: string) => void; 
  onEditMessageClick?: (messageId: string, currentText: string, imageBase64?: string, imageMimeType?: string) => void; // New prop for editing
  activelySpeakingMessageId?: string | null;
  ttsIsSpeakingGlobal?: boolean;
  ttsIsSupported?: boolean;
  currentLanguage?: Language;
  t?: (key: keyof TranslationSet, ...args: (string | number)[]) => string;
}

const extractFirstCodeBlock = (text: string): string | null => {
  const match = text.match(/```(?:[\w#+-.]*\n)?([\s\S]*?)```/);
  return match ? match[1].trim() : null;
};


const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onSpeakIconClick,
  onRunCodeClick,
  onEditMessageClick,
  activelySpeakingMessageId,
  ttsIsSpeakingGlobal,
  ttsIsSupported,
  t
}) => {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';
  const isSystem = message.sender === 'system';
  const isError = message.sender === 'error';

  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);

  const bubbleClasses = () => {
    if (isUser) return 'bg-sky-600 text-white self-end rounded-l-lg rounded-br-lg';
    if (isAI) return 'bg-gray-600 text-gray-200 self-start rounded-r-lg rounded-bl-lg';
    if (isSystem) return 'bg-transparent text-center text-gray-400 text-xs italic self-center w-full my-2';
    if (isError) return 'bg-red-700 bg-opacity-30 text-red-300 self-start rounded-lg border border-red-500';
    return 'bg-gray-600 text-gray-100 self-start';
  };

  const containerClasses = () => {
    if (isUser) return 'flex justify-end';
    if (isAI || isError) return 'flex justify-start';
    if (isSystem) return 'flex justify-center';
    return 'flex';
  };
  
  const formatText = (text: string) => {
    if (isAI || isSystem) {
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Inline code
        text = text.replace(/`([^`\n]+?)`/g, '<code class="bg-gray-800 px-1 py-0.5 rounded text-sm text-yellow-400">$1</code>');
        // Multiline code blocks
        text = text.replace(/```(?:[\w#+-.]*\n)?([\s\S]*?)```/g, (_match, codeContent) => {
            const escapedCode = codeContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            return `<pre class="bg-gray-900 p-2 my-1 rounded text-sm overflow-x-auto whitespace-pre-wrap"><code class="text-gray-300">${escapedCode}</code></pre>`;
        });
    }
    return { __html: text.replace(/\n/g, '<br />') };
  };

  const handleCopyClick = () => {
    if (!message.text || !navigator.clipboard) return;
    navigator.clipboard.writeText(message.text)
      .then(() => {
        setShowCopiedFeedback(true);
        setTimeout(() => setShowCopiedFeedback(false), 2000);
      })
      .catch(err => console.error("Failed to copy text: ", err));
  };

  const hasImage = message.imageBase64 && message.imageMimeType;
  const isThisMessageSpeaking = ttsIsSpeakingGlobal && activelySpeakingMessageId === message.id;
  
  const firstCodeBlock = isAI ? extractFirstCodeBlock(message.text) : null;

  return (
    <div className={`w-full ${containerClasses()}`}>
      <div 
        className={`px-4 py-3 max-w-xs lg:max-w-md xl:max-w-lg break-words shadow-md relative group ${bubbleClasses()} ${hasImage && isUser ? 'space-y-2' : ''}`}
      >
        {hasImage && isUser && (
          <img 
            src={`data:${message.imageMimeType};base64,${message.imageBase64}`} 
            alt="User upload"
            className="max-w-full h-auto rounded-md object-contain max-h-64"
          />
        )}
        { (message.text || isSystem || isError || (isAI && !message.text)) && (
           <div dangerouslySetInnerHTML={formatText(message.text)} />
        )}

        {isUser && t && onEditMessageClick && (
          <button
            onClick={() => onEditMessageClick(message.id, message.text, message.imageBase64, message.imageMimeType)}
            aria-label={t('editButtonLabel')}
            title={t('editButtonLabel')}
            className={`absolute -top-3 -left-3 p-1.5 rounded-full bg-gray-600 hover:bg-sky-500 text-gray-300 hover:text-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </button>
        )}

        {isAI && message.text && t && (
          <div className="absolute -top-3 -right-3 flex space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            {ttsIsSupported && onSpeakIconClick && (
              <button
                onClick={() => onSpeakIconClick(message.id, message.text)}
                aria-label={isThisMessageSpeaking ? t('stopSpeakingAiMessageLabel') : t('speakAiMessageLabel')}
                title={isThisMessageSpeaking ? t('stopSpeakingAiMessageLabel') : t('speakAiMessageLabel')}
                className={`p-1.5 rounded-full bg-gray-500 hover:bg-sky-500 text-gray-300 hover:text-white transition-all
                            ${isThisMessageSpeaking ? 'text-sky-400' : 'text-gray-300'}`}
              >
                {isThisMessageSpeaking ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.25-1.5a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                    <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                  </svg>
                )}
              </button>
            )}
             <button
                onClick={handleCopyClick}
                aria-label={t('copyButtonLabel')}
                title={t('copyButtonLabel')}
                className="p-1.5 rounded-full bg-gray-500 hover:bg-sky-500 text-gray-300 hover:text-white transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.042c0 .995-.805 1.8-1.8 1.8H9.75a1.8 1.8 0 01-1.8-1.8V6.138c0-.213.029-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
              </button>
          </div>
        )}
         {isAI && showCopiedFeedback && t && (
            <div className="absolute -bottom-5 right-0 text-xs text-sky-300 bg-gray-500 px-1.5 py-0.5 rounded-md shadow-lg">
                {t('copiedFeedbackText')}
            </div>
        )}


        {isAI && firstCodeBlock && t && onRunCodeClick && (
          <div className="mt-2 text-right">
            <button
              onClick={() => onRunCodeClick(firstCodeBlock)}
              className="px-3 py-1 text-xs font-medium text-sky-300 bg-gray-500 hover:bg-sky-700 hover:text-sky-100 rounded-md transition-colors border border-sky-700 hover:border-sky-600"
              title={t('runCodeButtonLabel')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline-block mr-1 align-text-bottom">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              {t('runCodeButtonLabel')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;