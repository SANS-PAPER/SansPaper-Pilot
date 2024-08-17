"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa'; 
import { getOpenAIResponse } from '@/app/api/openAiService';
import './style.css'; 
import Breadcrumb from '../Breadcrumbs/Breadcrumb';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const Support = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]); 
  const [isTyping, setIsTyping] = useState(false);
  const [inputHeight, setInputHeight] = useState(40); 
  const flatListRef = useRef<HTMLDivElement>(null);

  const handlePress = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages([...messages, newMessage]);
    setInput('');
    setInputHeight(40); 
    setIsTyping(true);

    try {
      const apiMessages: Message[] = [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...messages,
        newMessage,
      ];
      const responseContent = await getOpenAIResponse(apiMessages);
      const responseMessage: Message = { role: 'assistant', content: responseContent };
      setMessages([...messages, newMessage, responseMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollTop = flatListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleContentSizeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputHeight(event.target.scrollHeight);
  };

  const renderItem = (item: Message, index: number) => (
    <div
      className={`message-container ${
        item.role === 'user' ? 'user-container' : 'ai-container'
      } ${index === messages.length - 1 ? 'last-message' : ''}`}
      key={index}
    >
      <p className={item.role === 'user' ? 'message-text-user' : 'message-text-ai'}>
        {item.content}
      </p>
    </div>
  );

  return (
    <div className="container">
        <Breadcrumb pageName="Support" />
     <div className="chat-container" ref={flatListRef}>
      {[...messages, isTyping ? { role: 'assistant', content: 'Typing...' } : null]
        .filter((item): item is Message => item !== null)
        .map(renderItem)}
    </div>
      <div className="input-container">
        <textarea
          className="input"
          style={{ height: inputHeight }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          onInput={handleContentSizeChange}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handlePress()}
        />
        <FaPaperPlane  size={22} onClick={handlePress} className="send-icon" />
      </div>
    </div>
  );
};

export default Support;
