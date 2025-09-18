"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";

interface VoiceInputButtonProps {
  onTranscript: (value: string) => void;
}

export function VoiceInputButton({ onTranscript }: VoiceInputButtonProps) {
  const [listening, setListening] = useState(false);

  const toggleListening = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser");
      return;
    }
    if (listening) {
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.start();
    setListening(true);
  };

  return (
    <Button type="button" size="icon" variant={listening ? "default" : "ghost"} onClick={toggleListening} aria-label="Voice input">
      {listening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
}
