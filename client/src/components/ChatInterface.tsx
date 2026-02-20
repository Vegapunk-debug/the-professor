"use client";

import React, { useState } from 'react';
import axios from 'axios';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { text: "Hello! I am The Professor. How can I help?", sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { text: userText, sender: "user" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5001/api/chat', { prompt: userText });
      setMessages(prev => [...prev, { text: res.data.response, sender: "ai" }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Error connecting to server.", sender: "ai" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 bg-gray-50 text-gray-900 font-sans">
      
      <h1 className="text-2xl font-bold mb-4 border-b pb-4 text-center">
        The Professor
      </h1>
      
      <div className="flex-1 overflow-y-auto bg-white border rounded-xl p-4 shadow-sm mb-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-2xl max-w-[80%] ${
              msg.sender === "user" 
                ? "bg-blue-600 text-white rounded-br-none" 
                : "bg-gray-100 text-gray-800 rounded-bl-none border"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm italic ml-2">Thinking...</div>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border rounded-xl p-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          placeholder="Type your message..."
          disabled={loading}
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          disabled={loading}
        >
          Send
        </button>
      </form>
      
    </div>
  );
}