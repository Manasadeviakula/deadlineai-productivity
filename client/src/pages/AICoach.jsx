import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { LuBot, LuSend, LuMic, LuMicOff, LuUser, LuSparkles } from 'react-icons/lu';
import { motion } from 'framer-motion';

export const AICoach = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your AI Productivity Mentor. Feel free to ask me anything — like 'I have 3 assignments tomorrow', 'I feel tired', or 'What should I do next?'"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: query });
      if (res.data.success) {
        setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "I'm here for you! Break down your immediate priority into a 25-minute sprint to build momentum." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceAssistant = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice speech recognition is not supported in this browser version. You can type your command below!");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
    }
  };

  const quickPrompts = [
    "I have 3 assignments due tomorrow.",
    "I feel overwhelmed and tired.",
    "What task should I execute next?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-4xl mx-auto glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
      
      {/* Coach Header */}
      <div className="p-4 sm:p-6 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl gradient-btn flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/30">
            <LuBot />
          </div>
          <div>
            <h2 className="font-bold text-base gradient-text">Gemini AI Coach & Voice Assistant</h2>
            <p className="text-xs text-slate-400">Empathic productivity mentor</p>
          </div>
        </div>

        <button
          onClick={toggleVoiceAssistant}
          className={`p-3 rounded-2xl border transition-all ${
            isListening 
              ? 'bg-rose-600 text-white border-rose-500 animate-pulse' 
              : 'bg-slate-800 text-indigo-400 border-slate-700 hover:bg-slate-700'
          }`}
          title="Voice Assistant"
        >
          {isListening ? <LuMicOff className="text-xl" /> : <LuMic className="text-xl" />}
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950/40">
        {messages.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${
              m.sender === 'user' ? 'bg-indigo-600 text-white' : 'gradient-btn text-white'
            }`}>
              {m.sender === 'user' ? <LuUser /> : <LuBot />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
              m.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 p-2">
            <LuSparkles className="animate-spin text-lg" /> AI Coach is formulating response...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Starter Chips */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] uppercase font-semibold text-slate-500 shrink-0">Try Asking:</span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-indigo-900/50 text-slate-300 hover:text-indigo-200 text-xs shrink-0 border border-slate-700"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
        <input
          type="text"
          placeholder={isListening ? "Listening to your voice..." : "Ask your AI Coach for guidance or say commands..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-3 rounded-2xl gradient-btn text-white disabled:opacity-50"
        >
          <LuSend className="text-lg" />
        </button>
      </form>
    </div>
  );
};
