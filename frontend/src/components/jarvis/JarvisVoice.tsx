import React from 'react';
import { motion } from 'framer-motion';
import JarvisWaveform from './JarvisWaveform';
import { Mic, MicOff, Keyboard, VolumeX, Loader2, Volume2 } from 'lucide-react';

interface JarvisVoiceProps {
  status: 'idle' | 'listening' | 'thinking' | 'speaking';
  transcript: string;
  intercomMode: boolean;
  onToggleIntercom: () => void;
  onToggleMic: () => void;
  onToggleKeyboard: () => void;
  onCancelSpeech: () => void;
}

export const JarvisVoice: React.FC<JarvisVoiceProps> = ({
  status,
  transcript,
  intercomMode,
  onToggleIntercom,
  onToggleMic,
  onToggleKeyboard,
  onCancelSpeech
}) => {
  return (
    <div className="flex-grow flex flex-col justify-between p-6">
      
      {/* 1. Canvas Waveform Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <JarvisWaveform status={status} />

        {/* Status text banner */}
        <div className="text-center">
          <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${
            status === 'listening' ? 'text-rose-500 animate-pulse' :
            status === 'thinking' ? 'text-indigo-400' :
            status === 'speaking' ? 'text-cyan-400' : 'text-cyan-500/50'
          }`}>
            {status === 'listening' ? '• listening' :
             status === 'thinking' ? '• indexing brain' :
             status === 'speaking' ? '• speaking' : '• standby'}
          </span>
        </div>
      </div>

      {/* 2. Audio Transcript Subtitle Display */}
      <div className="w-full px-4 py-3 min-h-[64px] flex items-center justify-center bg-slate-950/40 rounded-2xl border border-cyan-500/5 mb-6 text-center select-text">
        <p className="text-[11px] text-cyan-300/80 leading-relaxed font-mono line-clamp-3">
          {status === 'listening' && transcript ? transcript : 
           status === 'speaking' && transcript ? transcript :
           status === 'thinking' ? 'Mengakses satelit database MBNP...' :
           'Sistem siap. Aktifkan mikrofon atau Intercom Mode untuk berbicara...'}
        </p>
      </div>

      {/* 3. Voice Call Controls */}
      <div className="flex flex-col gap-4 border-t border-cyan-500/10 pt-4 bg-slate-950/20 rounded-2xl p-3">
        <div className="flex items-center justify-between gap-3">
          {/* Keyboard fall-back toggle */}
          <button
            type="button"
            onClick={onToggleKeyboard}
            className="w-10 h-10 bg-slate-900/80 border border-white/[0.04] rounded-xl flex items-center justify-center text-cyan-400 hover:bg-slate-800 hover:text-cyan-300 hover:scale-105 active:scale-95 transition-all shrink-0"
            title="Switch to Keyboard Mode"
          >
            <Keyboard className="w-4.5 h-4.5" />
          </button>

          {/* Main Action Microphone Call Button */}
          <button
            type="button"
            onClick={onToggleMic}
            className={`flex-grow h-11 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-lg ${
              status === 'listening' ? 'bg-rose-600 hover:bg-rose-505 text-white shadow-rose-500/20' :
              status === 'speaking' ? 'bg-cyan-600 hover:bg-cyan-555 text-white shadow-cyan-500/20' :
              status === 'thinking' ? 'bg-indigo-950/40 text-indigo-400/50 cursor-not-allowed border border-indigo-500/10' :
              'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-cyan-500/25'
            }`}
            disabled={status === 'thinking'}
          >
            {status === 'listening' ? (
              <>
                <MicOff className="w-3.5 h-3.5 animate-pulse" />
                <span>Selesai Bicara</span>
              </>
            ) : status === 'speaking' ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Hentikan Suara</span>
              </>
            ) : status === 'thinking' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Berpikir...</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Mulai Bicara</span>
              </>
            )}
          </button>

          {/* Continuous Intercom Mode Toggle */}
          <button
            type="button"
            onClick={onToggleIntercom}
            className={`w-10 h-10 border rounded-xl flex flex-col items-center justify-center transition-all shrink-0 hover:scale-105 active:scale-95 ${
              intercomMode
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                : 'bg-slate-900/80 border-white/[0.04] text-slate-400 hover:bg-slate-800'
            }`}
            title="Intercom Hands-free Mode (Auto listen after speaking)"
          >
            {intercomMode ? (
              <Volume2 className="w-4.5 h-4.5 animate-pulse" />
            ) : (
              <VolumeX className="w-4.5 h-4.5" />
            )}
            <span className="text-[6px] font-black uppercase mt-0.5 tracking-wider">LOOP</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default JarvisVoice;
