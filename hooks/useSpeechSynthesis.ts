
import { useState, useEffect, useCallback, useRef } from 'react';
import { TranslationSet, Language } from '../types'; // Import TranslationSet and Language

interface SpeechSynthesisUtteranceCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (errorType: string) => void;
}

interface SpeechSynthesisHook {
  isSpeaking: boolean;
  error: keyof TranslationSet | null; 
  isSupported: boolean;
  speak: (text: string, lang: string, callbacks?: SpeechSynthesisUtteranceCallbacks) => void;
  cancel: () => void;
}

// Map application language codes to specific IETF language tags for TTS
const ttsLanguageMap: Partial<Record<Language, string>> = {
  [Language.EN]: 'en-US',
  [Language.ES]: 'es-ES',
  [Language.FR]: 'fr-FR',
  [Language.KM]: 'km-KH', // Khmer (Cambodia)
};

const useSpeechSynthesis = (): SpeechSynthesisHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<keyof TranslationSet | null>(null); 
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
      setIsSupported(true);
      if (!utteranceRef.current) {
        utteranceRef.current = new SpeechSynthesisUtterance();
      }
    } else {
      setIsSupported(false);
      console.warn("SpeechSynthesis API not supported in this browser.");
    }
    
    return () => {
      if (isSupported && window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  const speak = useCallback((text: string, appLang: string, callbacks?: SpeechSynthesisUtteranceCallbacks) => {
    if (!isSupported || !utteranceRef.current || !text.trim()) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    setError(null);
    const currentUtterance = utteranceRef.current;
    currentUtterance.text = text;

    const mappedLang = ttsLanguageMap[appLang as Language] || appLang;
    currentUtterance.lang = mappedLang;

    const voices = window.speechSynthesis.getVoices();
    const voiceForLang = voices.find(voice => voice.lang === mappedLang || voice.lang.startsWith(mappedLang.split('-')[0]) || voice.lang.startsWith(appLang));
    
    if (voiceForLang) {
      currentUtterance.voice = voiceForLang;
    } else {
        const defaultVoice = voices.find(voice => voice.default);
        if(defaultVoice) currentUtterance.voice = defaultVoice;
    }

    currentUtterance.onstart = () => {
      setIsSpeaking(true);
      callbacks?.onStart?.();
    };
    currentUtterance.onend = () => {
      setIsSpeaking(false);
      callbacks?.onEnd?.();
    };
    currentUtterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      const errorType = event.error;

      // Only log to console if it's not an expected interruption/cancellation.
      if (errorType !== 'interrupted' && errorType !== 'canceled') {
        console.error('Speech synthesis error:', errorType, event);
      }

      // Set UI error state.
      // Do not set error for 'interrupted' or 'canceled'.
      // 'not-allowed' is a significant issue and should set an error.
      // Any other error type is also a generic UI error.
      if (errorType !== 'interrupted' && errorType !== 'canceled') {
        // For 'not-allowed' or any other actual error
        setError('ttsErrorGeneric');
      }
      // If errorType is 'interrupted' or 'canceled', setError is not called.

      setIsSpeaking(false);
      callbacks?.onError?.(errorType); // Notify ChatPage regardless.
    };
    
    const speakNow = () => {
      try {
        window.speechSynthesis.speak(currentUtterance);
      } catch (e) {
        console.error("Error directly calling speak:", e);
        setError('ttsErrorGeneric');
        setIsSpeaking(false);
        callbacks?.onError?.('speak-error');
      }
    };

    if (voices.length > 0) {
      speakNow();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        const updatedVoiceForLang = updatedVoices.find(voice => voice.lang === mappedLang || voice.lang.startsWith(mappedLang.split('-')[0]) || voice.lang.startsWith(appLang));
        if (updatedVoiceForLang) {
            currentUtterance.voice = updatedVoiceForLang;
        } else {
            const defaultVoice = updatedVoices.find(voice => voice.default);
            if(defaultVoice) currentUtterance.voice = defaultVoice;
        }
        speakNow();
        window.speechSynthesis.onvoiceschanged = null; 
      };
    }

  }, [isSupported]); 

  const cancel = useCallback(() => {
    if (isSupported && window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
      // onend callback should fire and set isSpeaking to false
      // and also call the utterance-specific onEnd if provided.
    }
  }, [isSupported]);

  useEffect(() => {
    if (isSupported) {
        const loadVoices = () => {
             window.speechSynthesis.getVoices(); 
        };
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
        loadVoices(); // Initial attempt to load voices
    }
  }, [isSupported]);


  return { isSpeaking, error, isSupported, speak, cancel };
};

export default useSpeechSynthesis;
