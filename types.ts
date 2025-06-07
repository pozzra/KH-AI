

import { Language } from './constants'; // Keep this if constants.ts is the primary definition

// Re-export Language enum if it's primarily defined in constants.ts
// Or define it here if this is meant to be the source of truth for Language type.
// For now, assuming constants.ts has the enum and we are just ensuring it's available.
export { Language } from './constants';


export interface User {
  username: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system' | 'error';
  timestamp: number;
  imageBase64?: string; // For user-uploaded images
  imageMimeType?: string; // MIME type of the user-uploaded image
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastModified: number;
  // Pinned or favorite status could be added later
  // pinned?: boolean; 
}

export type AppView = 'chat' | 'downloader';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export interface TranslationSet {
  loginTitle: string;
  usernameLabel: string;
  passwordLabel: string; 
  loginButton: string;
  logoutButton: string;
  sendMessagePlaceholder: string;
  sendMessageButton: string;
  chatWithAI: string; 
  appTitleBrand: string; 
  apiKeyMissing: string;
  errorPrefix: string;
  systemGreeting: string;
  languageLabel: string;
  selectLanguage: string;
  aiTyping: string;
  failedToInitSession: string;
  failedToSendMessage: string;
  geminiServiceUnavailable: string;
  defaultUsername: string;

  // Image upload translations
  uploadImageButtonLabel: string;
  imagePreviewAlt: string;
  clearSelectedImageButtonLabel: string;
  imageTooLargeError: string; // Parameter: {0} = maxSize
  invalidImageTypeError: string;
  generatingImagePreview: string;
  imageSentWithName: string; // Parameter: {0} = filename

  // STT (Speech-to-Text) translations
  recordMessageButtonLabel: string;
  stopRecordingButtonLabel: string;
  listeningStatus: string;
  sttErrorNoMicPermission: string;
  sttErrorNoSpeechDetected: string;
  sttErrorNetwork: string;
  sttErrorAborted: string;
  sttErrorGeneric: string;
  sttUnsupported: string;
  interimTranscriptPlaceholder: string;

  // TTS (Text-to-Speech) translations
  ttsErrorGeneric: string;
  ttsUnsupported: string;
  speakAiMessageLabel: string; 
  stopSpeakingAiMessageLabel: string; 

  // Chat History / Sidebar translations
  chatHistoryTitle: string;
  newChatButton: string;
  deleteChatButtonLabel: string; // Aria-label for delete icon
  confirmDeleteChatTitle: string;
  confirmDeleteChatMessage: string; // Parameter: {0} = chat title
  cancelButton: string;
  deleteButton: string;
  loadChatError: string;
  noChatsYet: string;
  sidebarToggleOpen: string; // Aria-label
  sidebarToggleClose: string; // Aria-label
  defaultChatTitle: string; // Fallback title for new chats

  // AI Response Language Instruction
  aiResponseLanguageInstruction: string;

  // Video Downloader Translations
  videoDownloaderTitle: string;
  videoUrlInputLabel: string;
  videoUrlInputPlaceholder: string;
  startDownloadButton: string;
  simulatingDownloadStatus: string; // Parameter: {0} = URL
  downloadCompleteStatus: string; // Parameter: {0} = URL
  downloadFailedStatus: string; // Parameter: {0} = URL
  invalidUrlStatus: string;
  downloaderExplanation: string;
  backToChatButton: string;
  switchToDownloaderViewLabel: string;
  youtubeIconLabel: string;
  tiktokIconLabel: string;
  facebookIconLabel: string;
  videoPlayerTitle: string; // New
  saveVideoButtonLabel: string; // New
  videoSavedFeedback: string; // New


  // Footer branding
  appPoweredBy: string;

  // Code Runner Feature
  runCodeButtonLabel: string;
  codeSimulationModalTitle: string;
  simulatingExecutionText: string;
  codeOutputSimulatedPlaceholder: string;
  closeModalButtonLabel: string;

  // Edit User Message Feature
  editButtonLabel: string;
  editUserMessageModalTitle: string;
  saveChangesButton: string;
  cancelEditButton: string; // Can reuse 'cancelButton' if generic enough
  codeEditableInModalHint: string; // For CodeSimulationModal

  // Copy to Clipboard Feature
  copyButtonLabel: string;
  copiedFeedbackText: string;

  // Theme Selection translations
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
}

export interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: keyof TranslationSet | null; 
  isSupported: boolean;
  speechPaused: boolean; 
  startListening: () => void;
  stopListening: () => void;
}

export type Translations = Record<Language, TranslationSet>;