import React from 'react';
import { motion, Variants } from 'framer-motion';
import JarvisTyping from './JarvisTyping';
import { Bot } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: Date;
}

interface JarvisMessagesProps {
  messages: Message[];
  status: 'idle' | 'listening' | 'thinking' | 'speaking';
  transcript: string;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export const JarvisMessages: React.FC<JarvisMessagesProps> = ({
  messages,
  status,
  transcript,
  chatEndRef
}) => {
  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const bubbleVariants: Variants = {
    initial: { opacity: 0, y: 12, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 18 }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/10 scrollbar-track-transparent">
      {messages.length === 0 && !transcript ? (
        // Empty state instruction
        <div className="h-full flex flex-col items-center justify-center text-center p-4">
          <Bot className="w-10 h-10 text-cyan-500/30 animate-pulse mb-3" />
          <p className="text-xs font-bold text-cyan-500/50 uppercase tracking-widest leading-relaxed">
            Sistem Siap<br />
            <span className="text-[10px] text-slate-500 lowercase font-medium tracking-normal">
              Bicaralah atau gunakan keyboard untuk berinteraksi dengan Jarvis.
            </span>
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <motion.div
                key={msg.id}
                variants={bubbleVariants}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-[2rem] rounded-tr-none shadow-[0_4px_15px_rgba(37,99,235,0.25)] select-text'
                      : 'bg-slate-900/60 dark:bg-slate-950/45 border border-cyan-500/10 text-cyan-100 rounded-[2rem] rounded-tl-none shadow-[0_4px_15px_rgba(6,182,212,0.03)] select-text'
                  }`}
                >
                  <p className="whitespace-pre-line font-mono">{msg.text}</p>
                  
                  {/* Timestamp */}
                  <span className={`text-[8px] font-bold mt-1.5 block opacity-50 font-sans ${isUser ? 'text-right text-blue-200' : 'text-cyan-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Real-time speech recognition transcript preview */}
          {status === 'listening' && transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full justify-end"
            >
              <div className="max-w-[80%] bg-rose-500/10 border border-rose-500/20 text-rose-350 dark:text-rose-300 px-4 py-3 rounded-[2rem] rounded-tr-none text-xs font-mono italic animate-pulse">
                {transcript}
              </div>
            </motion.div>
          )}

          {/* Thinking visual feedback (Staggered Dots) */}
          {status === 'thinking' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full justify-start"
            >
              <JarvisTyping />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Auto scroll anchor */}
      <div ref={chatEndRef} />
    </div>
  );
};

export default JarvisMessages;
