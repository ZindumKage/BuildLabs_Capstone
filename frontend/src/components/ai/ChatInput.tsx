"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Listen for suggestion events from ChatWindow
  useEffect(() => {
    const handler = (e: Event) => {
      const suggestion = (e as CustomEvent<string>).detail;
      setValue(suggestion);
      textareaRef.current?.focus();
    };
    window.addEventListener("suggestion", handler);
    return () => window.removeEventListener("suggestion", handler);
  }, []);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-card p-4">
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your inventory... (Enter to send)"
          rows={2}
          className="resize-none"
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          size="icon"
          className="shrink-0 h-[60px] w-10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">
        Shift+Enter for new line · Enter to send
      </p>
    </div>
  );
}
