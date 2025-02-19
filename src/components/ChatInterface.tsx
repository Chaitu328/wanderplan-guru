
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  tripPlan: string;
}

export const ChatInterface = ({ tripPlan }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userMessage = newMessage.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const geminiApiKey = localStorage.getItem("GEMINI_API_KEY");
      if (!geminiApiKey) {
        throw new Error("Please set your Gemini API key in settings first");
      }

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + geminiApiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a travel assistant. Based on this trip plan:\n\n${tripPlan}\n\nUser question: ${userMessage}\n\nProvide a helpful response.`
            }]
          }]
        })
      });

      const data = await response.json();
      const assistantMessage = data.candidates[0].content.parts[0].text;
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 shadow-lg bg-white/80 backdrop-blur-sm">
      <h2 className="text-2xl font-semibold mb-4">Ask Questions About Your Trip</h2>
      
      <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-100 ml-auto max-w-[80%]'
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            <ReactMarkdown className="prose prose-sm">
              {message.content}
            </ReactMarkdown>
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-100 p-3 rounded-lg animate-pulse">
            Thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask a question about your trip..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  );
};
