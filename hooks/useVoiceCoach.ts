import { useState, useEffect, useRef, useCallback } from "react";


interface UseVoiceCoachReturn {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

export function useVoiceCoach(): UseVoiceCoachReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  // Check support on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
        };

        rec.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + " ";
          }
          setTranscript(currentTranscript.trim());
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }
    
    // Stop speaking if speaking
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.error("Failed to stop speech recognition:", e);
    }
  }, [isSupported]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.warn("Speech synthesis not supported in this environment.");
      return;
    }

    // Cancel current active speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Auto-detect a suitable English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith("en-US") || v.lang.startsWith("en")
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    speak,
    stopSpeaking,
  };
}
export default useVoiceCoach;
