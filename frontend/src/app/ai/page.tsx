"use client";

import { useState, useCallback } from "react";
import { Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ChatWindow } from "@/components/ai/ChatWindow";
import { ChatInput } from "@/components/ai/ChatInput";
import { Button } from "@/components/ui/button";
import { queryAI } from "@/services/ai";
import { uid } from "@/lib/utils";
import type { ChatMessage } from "@/types";

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = useCallback(
    async (text: string) => {
      if (isLoading) return;

      // Add user message immediately
      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };

      // Add a loading placeholder for the AI response
      const loadingMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMsg, loadingMsg]);
      setIsLoading(true);

      try {
        const history = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await queryAI({
          question: text,
          history,
        });

        // Replace loading placeholder with real response
        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingMsg.id
              ? { ...m, content: response.answer, isLoading: false }
              : m,
          ),
        );
      } catch (err) {
        const errorText =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";

        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingMsg.id
              ? { ...m, content: `Error: ${errorText}`, isLoading: false }
              : m,
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  const handleClear = () => setMessages([]);

  return (
    <ProtectedRoute>
      <AppShell title="AI Assistant">
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                AI Assistant
              </h2>
              <p className="text-muted-foreground text-sm mt-0.5">
                Ask natural-language questions about your inventory.
              </p>
            </div>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleClear}>
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Clear chat
              </Button>
            )}
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col rounded-lg border overflow-hidden bg-card min-h-0">
            <ChatWindow messages={messages} />
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
