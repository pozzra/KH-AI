
import React, { useState, useEffect, useRef } from 'react';
import { TranslationSet } from '../types';

interface EditUserMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  onSave: (newText: string) => void;
  t: (key: keyof TranslationSet, ...args: (string | number)[]) => string;
}

const EditUserMessageModal: React.FC<EditUserMessageModalProps> = ({
  isOpen,
  onClose,
  initialText,
  onSave,
  t,
}) => {
  const [editText, setEditText] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setEditText(initialText);
      // Focus the textarea and select its content when modal opens
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.select();
      }, 100); // Small delay to ensure modal is rendered
    }
  }, [isOpen, initialText]);
  
  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 200; // Max height for textarea
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      if (scrollHeight > maxHeight) {
        textareaRef.current.style.overflowY = 'auto';
      } else {
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  }, [editText]);


  const handleSave = () => {
    if (editText.trim()) {
      onSave(editText.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-message-title"
    >
      <div
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg sm:max-w-lg m-4 sm:m-0 text-gray-200 transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="edit-user-message-title" className="text-xl font-semibold text-sky-400">
            {t('editUserMessageModalTitle')}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-full"
            aria-label={t('closeModalButtonLabel')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          rows={3} // Initial rows, will auto-adjust
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
          placeholder={t('sendMessagePlaceholder')}
        />
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors"
          >
            {t('cancelButton')} 
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors"
            disabled={!editText.trim()}
          >
            {t('saveChangesButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserMessageModal;