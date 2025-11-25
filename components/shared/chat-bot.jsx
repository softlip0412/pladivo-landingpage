"use client";

import { BotMessageSquareIcon, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";
import viLocale from "date-fns/locale/vi";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Xin chào! Hôm nay tôi có thể giúp gì cho bạn?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [threadId, setThreadId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: text, threadId }),
      });
      const data = await res?.json();
      setThreadId(data?.threadId);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: data?.reply,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover p>
      <PopoverTrigger className="fixed bottom-4 right-4 bg-sky-600 z-[100] w-16 h-16 rounded-full flex items-center justify-center select-none cursor-pointer">
        <BotMessageSquareIcon className="text-white w-8 h-8" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="top"
        className="p-0 bg-transparent border-none outline-none shadow-none w-max h-max"
      >
        <div className="w-[360px] max-w-md h-[450px] max-h-screen md:max-h-[600px] flex flex-col bg-card rounded-2xl shadow-2xl overflow-hidden border border-border">
          <div className="bg-gradient-to-r from-sky-600 to-sky-400 px-6 py-4">
            <h1 className="text-xl font-bold text-primary-foreground">
              Trợ Lý Ảo
            </h1>
            <p className="text-sm text-primary-foreground/80">
              Luôn ở đây để giúp đỡ
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-card to-secondary/10">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 max-w-xs">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border bg-card p-4">
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Chatbot;

const ChatInput = ({ onSendMessage, disabled = false }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập tin nhắn..."
        disabled={disabled}
        className="flex-1 px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
      />
      <Button
        type="submit"
        disabled={disabled || !input.trim()}
        size="icon"
        className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};

function ChatMessage({ message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-sky-500 text-primary-foreground rounded-br-none"
            : "bg-muted text-muted-foreground rounded-bl-none"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <span
          className={`text-xs mt-1 block opacity-70  ${
            isUser ? "text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          {formatDistanceToNow(message.timestamp, {
            addSuffix: true,
            locale: viLocale,
          })}
        </span>
      </div>
    </div>
  );
}
