import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Mic, Send, Sparkles, X, MessageSquare, AlertCircle } from 'lucide-react';
import { API_URL } from '../../config/api';
import Swal from 'sweetalert2';

// Import modular subcomponents
import JarvisHeader from './JarvisHeader';
import JarvisMessages from './JarvisMessages';
import JarvisVoice from './JarvisVoice';
import JarvisQuickActions from './JarvisQuickActions';

interface Message {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: Date;
}

interface ToastNotification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
}

export const JarvisWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [textFallback, setTextFallback] = useState(false);
  const [fallbackInput, setFallbackInput] = useState('');
  const [intercomMode, setIntercomMode] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const currentPath = window.location.pathname;

  // Clean up speech APIs on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  // Autoscroll message viewport
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, status, transcript]);

  // Periodic Contextual Toasts Scheduler
  useEffect(() => {
    const triggerContextToast = () => {
      if (isOpen && !isMinimized) return; // Don't disrupt if active window is open

      let toastMessage = 'Sistem Satelit MBNP Tech siap membantu.';
      let type: 'info' | 'warning' | 'success' = 'info';

      if (currentPath.includes('/finance')) {
        toastMessage = 'Jarvis: Pengeluaran makan Anda naik minggu ini. Cek rincian budget Anda.';
        type = 'warning';
      } else if (currentPath.includes('/spiritual')) {
        toastMessage = 'Jarvis: Waktu sholat Ashar sudah masuk untuk wilayah Garut.';
        type = 'success';
      } else if (currentPath.includes('/habits')) {
        toastMessage = 'Jarvis: Kebiasaan Lari Anda tersisa 2 target minggu ini.';
        type = 'info';
      } else if (currentPath.includes('/wedding')) {
        toastMessage = 'Jarvis: Peringatan budget catering terdeteksi aman.';
        type = 'success';
      } else {
        toastMessage = 'Jarvis: Pomodoro produktif disarankan. Selesaikan task To-Do Anda.';
        type = 'info';
      }

      const newToast = { id: String(Date.now()), message: toastMessage, type };
      setToasts(prev => [...prev, newToast]);

      // Auto dismiss after 6 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 6000);
    };

    // Trigger initial toast after 10s, then periodically every 90s
    const timer = setTimeout(triggerContextToast, 10000);
    const interval = setInterval(triggerContextToast, 90000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen, isMinimized, currentPath]);

  const toggleWidget = () => {
    if (isOpen) {
      // Clean up active tasks when closing
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.abort();
      setStatus('idle');
      setTranscript('');
      setTextFallback(false);
      setIntercomMode(false);
    }
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const startListening = () => {
    if (status === 'thinking' || status === 'listening') return;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      Swal.fire({
        icon: 'warning',
        title: 'Speech Recognition Tidak Didukung',
        text: 'Browser Anda tidak mendukung Web Speech API. Mengalihkan ke mode input teks.',
        confirmButtonColor: '#06B6D4',
        customClass: { popup: 'rounded-[2rem]' }
      });
      setTextFallback(true);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = 'id-ID';
      rec.continuous = false;
      rec.interimResults = true;

      rec.onstart = () => {
        setStatus('listening');
        setTranscript('Mendengarkan...');
        transcriptRef.current = '';
      };

      rec.onresult = (event: any) => {
        let currentResult = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentResult += event.results[i][0].transcript;
        }
        setTranscript(currentResult);
        transcriptRef.current = currentResult;
      };

      rec.onerror = (e: any) => {
        console.error("Speech Recognition Error:", e);
        if (e.error === 'not-allowed') {
          setTranscript('Akses mikrofon ditolak.');
        } else {
          setTranscript('Gagal mengenali suara.');
        }
        setStatus('idle');
        setIntercomMode(false); // Stop intercom loop on error
      };

      rec.onend = () => {
        const finalQuestion = transcriptRef.current.trim();
        if (!finalQuestion || finalQuestion === 'Mendengarkan...') {
          setTranscript('Tidak ada suara terdeteksi...');
          setStatus('idle');
          setIntercomMode(false); // Stop intercom if user goes silent
          setTimeout(() => setTranscript(''), 2000);
        } else {
          setStatus('thinking');
          askJarvis(finalQuestion);
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error("Failed to start SpeechRecognition:", err);
      setStatus('idle');
      setIntercomMode(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setStatus('idle');
    setTranscript('');
    setIntercomMode(false);
  };

  const askJarvis = async (question: string) => {
    // Add user message to history
    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setTranscript('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/jarvis/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question })
      });

      const result = await res.json();
      if (result.success && result.answer) {
        // Add Jarvis response to history
        const jarvisMsg: Message = {
          id: String(Date.now() + 1),
          sender: 'jarvis',
          text: result.answer,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, jarvisMsg]);
        speak(result.answer);
      } else {
        speak("Maaf A Bayu, saya mengalami kendala menghubungkan ke database.");
      }
    } catch (err) {
      console.error("Jarvis API Error:", err);
      speak("Sistem backend Jarvis sedang offline.");
    }
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) {
      setStatus('idle');
      return;
    }

    window.speechSynthesis.cancel();
    setStatus('speaking');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
    if (idVoice) utterance.voice = idVoice;

    utterance.onend = () => {
      setStatus('idle');
      // Continuous voice loop hook
      if (intercomMode) {
        setTimeout(() => {
          startListening();
        }, 500);
      }
    };

    utterance.onerror = (e) => {
      console.error("TTS Error:", e);
      setStatus('idle');
      setIntercomMode(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fallbackInput.trim()) return;
    const question = fallbackInput;
    setFallbackInput('');
    setStatus('thinking');
    askJarvis(question);
  };

  const handleQuickActionSelect = (actionText: string) => {
    setStatus('thinking');
    askJarvis(actionText);
  };

  const toggleIntercom = () => {
    const nextMode = !intercomMode;
    setIntercomMode(nextMode);
    if (nextMode) {
      startListening();
    } else {
      if (status === 'listening') stopListening();
      if (status === 'speaking') stopSpeaking();
    }
  };

  const toggleMic = () => {
    if (status === 'idle') startListening();
    else if (status === 'listening') stopListening();
    else if (status === 'speaking') stopSpeaking();
  };

  // Drag configuration properties
  const dragProps = {
    drag: true,
    dragMomentum: false,
    dragConstraints: {
      left: -window.innerWidth + 400,
      right: 0,
      top: -window.innerHeight + 550,
      bottom: 0
    }
  };

  return (
    <>
      {/* 1. FLOATING TOAST NOTIFICATION CONTAINER */}
      <div className="fixed bottom-24 right-6 z-55 flex flex-col gap-3 pointer-events-none items-end max-w-sm">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className="pointer-events-auto flex items-start gap-3 bg-[#0B0F19]/90 border border-cyan-500/20 backdrop-blur-xl rounded-[1.5rem] p-4 shadow-xl select-none font-mono text-[10px] w-76 leading-relaxed relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-500 to-indigo-500" />
              <div className="w-8 h-8 rounded-lg bg-cyan-950/50 flex items-center justify-center text-cyan-400 shrink-0">
                <Bot size={15} className="animate-pulse" />
              </div>
              <div className="flex-1 pr-2">
                <p className="font-extrabold text-cyan-300 tracking-wider">JARVIS ALERT</p>
                <p className="text-slate-300 font-bold mt-0.5 leading-normal">{t.message}</p>
              </div>
              <button
                onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
                className="text-slate-500 hover:text-slate-300 self-start p-0.5"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 2. CORE WIDGET VIEWPORT */}
      <AnimatePresence mode="wait">
        {!isOpen ? (
          // ==========================================
          // closed FAB: Floating Arc Reactor Orb
          // ==========================================
          <motion.button
            key="jarvis-fab"
            onClick={toggleWidget}
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white flex items-center justify-center shadow-[0_8px_35px_rgba(6,182,212,0.45)] border border-cyan-500/30 hover:border-cyan-400 focus:outline-none transition-all group"
            title="Open Jarvis OS"
          >
            {/* Layered glows & aura rotations */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/25 blur-[14px] opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <span className="absolute inset-0 rounded-full border-2 border-cyan-500/40 animate-ping pointer-events-none duration-[2s]" />

            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="absolute inset-2.5 rounded-full border border-cyan-500/40 border-dashed pointer-events-none"
            />

            <Bot className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.85)] animate-pulse" />
          </motion.button>
        ) : (
          // ==========================================
          // open HUD: Voice Call & Message Panel
          // ==========================================
          <motion.div
            key="jarvis-panel"
            {...dragProps}
            initial={{ scale: 0.7, opacity: 0, y: 100 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              width: isMinimized ? 300 : isExpanded ? 540 : 380,
              height: isMinimized ? 72 : isExpanded ? 680 : 540
            }}
            exit={{ scale: 0.7, opacity: 0, y: 100 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="fixed bottom-6 right-6 z-50 rounded-[2.5rem] bg-[#030712]/92 backdrop-blur-xl border border-cyan-500/25 shadow-[0_0_50px_rgba(6,182,212,0.18)] flex flex-col overflow-hidden text-slate-100 font-mono select-none"
          >
            {/* Header Component */}
            <JarvisHeader
              status={status}
              isMinimized={isMinimized}
              isExpanded={isExpanded}
              onToggleMinimize={() => setIsMinimized(!isMinimized)}
              onToggleExpand={() => setIsExpanded(!isExpanded)}
              onClose={toggleWidget}
              pathname={currentPath}
            />

            {/* Display Body only if NOT minimized */}
            {!isMinimized && (
              <>
                {textFallback ? (
                  // Chat Mode
                  <JarvisMessages
                    messages={messages}
                    status={status}
                    transcript={transcript}
                    chatEndRef={chatEndRef}
                  />
                ) : (
                  // Voice HUD Mode
                  <JarvisVoice
                    status={status}
                    transcript={transcript}
                    intercomMode={intercomMode}
                    onToggleIntercom={toggleIntercom}
                    onToggleMic={toggleMic}
                    onToggleKeyboard={() => setTextFallback(true)}
                    onCancelSpeech={stopSpeaking}
                  />
                )}

                {/* Quick Actions pills */}
                <JarvisQuickActions
                  pathname={currentPath}
                  onActionSelect={handleQuickActionSelect}
                />

                {/* Chat Keyboard Input Footer (Only visible in Keyboard Mode) */}
                {textFallback && (
                  <footer className="relative z-10 p-5 border-t border-cyan-500/10 bg-slate-950/60 flex flex-col gap-4">
                    <form onSubmit={handleTextSubmit} className="flex items-center gap-2.5 w-full">
                      <input
                        type="text"
                        value={fallbackInput}
                        onChange={(e) => setFallbackInput(e.target.value)}
                        placeholder="Ketik pesan untuk Jarvis..."
                        className="flex-1 bg-[#030712] border border-cyan-500/20 rounded-xl px-4 py-2.5 text-xs text-cyan-100 outline-none placeholder:text-cyan-800/60 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="w-10 h-10 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-cyan-500/15 active:scale-95 shrink-0"
                        title="Send"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTextFallback(false);
                          if (recognitionRef.current) recognitionRef.current.abort();
                          if (window.speechSynthesis) window.speechSynthesis.cancel();
                          setStatus('idle');
                        }}
                        className="w-10 h-10 bg-slate-900 border border-cyan-500/20 text-cyan-400 hover:bg-slate-800 rounded-xl flex items-center justify-center transition-all shrink-0"
                        title="Voice Mode"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    </form>
                  </footer>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JarvisWidget;
