
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TranslationSet, Language, SpeechRecognitionHook } from '../types'; // Import Language from types or constants

// Comment: The following types (SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent)
// are standard Web Speech API types. If 'any' is used here, it's a workaround for environments
// where TypeScript doesn't automatically recognize these DOM types.
// For a more robust setup, ensure your tsconfig.json 'lib' includes 'dom' and/or
// install relevant type definitions like '@types/wicg-speech-api'.

const sttLanguageMap: Partial<Record<Language, string>> = {
  [Language.EN]: 'en-US',
  [Language.ES]: 'es-ES',
  [Language.FR]: 'fr-FR',
  [Language.KM]: 'km-KH', // Khmer language code for STT
};

const SPEECH_PAUSE_DURATION = 1000; // 1 second

const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<keyof TranslationSet | null>(null); 
  const [isSupported, setIsSupported] = useState(false);
  const [speechPaused, setSpeechPaused] = useState(false);
  
  const recognitionRef = useRef<any | null>(null); 
  const speechPauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isListeningRef = useRef(isListening); // To access current listening state in timeouts

  const { language } = useLanguage();

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const clearSpeechPauseTimer = useCallback(() => {
    if (speechPauseTimerRef.current) {
      clearTimeout(speechPauseTimerRef.current);
      speechPauseTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognitionAPI();
    } else {
      setIsSupported(false);
      console.warn("SpeechRecognition API not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      clearSpeechPauseTimer();
    };
  }, [clearSpeechPauseTimer]);

  const startSpeechPauseTimer = useCallback(() => {
    clearSpeechPauseTimer();
    if (isListeningRef.current) { // Only start timer if actually listening
      speechPauseTimerRef.current = setTimeout(() => {
        if (isListeningRef.current) { // Check again before setting, in case stop was called
          setSpeechPaused(true);
        }
      }, SPEECH_PAUSE_DURATION);
    }
  }, [clearSpeechPauseTimer]);

  const handleResult = useCallback((event: any) => { 
    clearSpeechPauseTimer();
    setSpeechPaused(false);

    let finalTranscriptChunk = '';
    let currentInterimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscriptChunk += event.results[i][0].transcript;
      } else {
        currentInterimTranscript += event.results[i][0].transcript;
      }
    }
    if (finalTranscriptChunk) { // Only update transcript if there's final content
        setTranscript(prev => prev + finalTranscriptChunk);
    }
    setInterimTranscript(currentInterimTranscript);
    
    if (isListeningRef.current) { // If still listening, restart pause timer
      startSpeechPauseTimer();
    }
  }, [clearSpeechPauseTimer, startSpeechPauseTimer]);
  
  const handleError = useCallback((event: any) => { 
    console.error('Speech recognition error:', event.error);
    clearSpeechPauseTimer();
    setSpeechPaused(false);

    if (event.error === 'no-speech') {
      setError('sttErrorNoSpeechDetected');
    } else if (event.error === 'audio-capture') {
      setError('sttErrorGeneric'); 
    } else if (event.error === 'not-allowed') {
      setError('sttErrorNoMicPermission');
    } else if (event.error === 'network') {
      setError('sttErrorNetwork');
    } else if (event.error === 'aborted') {
      if(isListeningRef.current) setError('sttErrorAborted'); 
    } else {
      setError('sttErrorGeneric');
    }
    setIsListening(false); // Ensure listening state is false on error
  }, [clearSpeechPauseTimer]); 

  const handleEnd = useCallback(() => {
    // This 'end' event can fire even if stopListening wasn't explicitly called by user,
    // e.g. after a period of silence or API decision.
    // We ensure our state reflects that listening has stopped.
    if (isListeningRef.current) { // If it was listening and ended by itself
      setIsListening(false);
    }
    clearSpeechPauseTimer();
    setSpeechPaused(false);
  }, [clearSpeechPauseTimer]);

  useEffect(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.onresult = handleResult;
    recognitionRef.current.onerror = handleError;
    recognitionRef.current.onend = handleEnd; 
    
    const sttLang = sttLanguageMap[language as Language] || language; 
    recognitionRef.current.lang = sttLang; 
    
    recognitionRef.current.interimResults = true;
    recognitionRef.current.continuous = true; 

  }, [language, handleResult, handleError, handleEnd]);


  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListeningRef.current) return; 
    try {
      setTranscript(''); 
      setInterimTranscript('');
      setError(null);
      clearSpeechPauseTimer();
      setSpeechPaused(false);
      
      const sttLang = sttLanguageMap[language as Language] || language; 
      recognitionRef.current.lang = sttLang; 

      recognitionRef.current.start();
      setIsListening(true);
      startSpeechPauseTimer(); // Start pause timer when listening begins
    } catch (err: any) {
        console.error("Error starting speech recognition:", err);
        if (err.name === 'InvalidStateError') { 
             // Already started
        } else {
            setError('sttErrorGeneric');
        }
        setIsListening(false);
        clearSpeechPauseTimer();
        setSpeechPaused(false);
    }
  }, [language, clearSpeechPauseTimer, startSpeechPauseTimer]); 

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) { 
      recognitionRef.current.stop();
      // onend callback will handle setIsListening(false), clearing timer, and resetting speechPaused
    }
    // If not listening, but we want to ensure states are cleared:
    if (!isListeningRef.current) {
        clearSpeechPauseTimer();
        setSpeechPaused(false);
    }
  }, [clearSpeechPauseTimer]); 

  return { 
    isListening, 
    transcript, 
    interimTranscript, 
    error, 
    isSupported, 
    speechPaused, // Expose speechPaused state
    startListening, 
    stopListening 
  };
};

export default useSpeechRecognition;
