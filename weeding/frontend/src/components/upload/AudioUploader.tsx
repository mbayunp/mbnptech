'use client';

import { useState, useRef, DragEvent } from 'react';
import { UploadCloud, Music, Volume2, VolumeX, Play, Pause, RefreshCw, Trash2 } from 'lucide-react';
import api, { getAssetUrl } from '../../services/api';
import UploadPreview from './UploadPreview';

interface AudioUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  className?: string;
}

export default function AudioUploader({
  value,
  onChange,
  label = 'Unggah Musik Latar (MP3)',
  className = '',
}: AudioUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Audio preview playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side validation
  const validateFile = (file: File): boolean => {
    setError(null);
    const isMp3 = file.name.toLowerCase().endsWith('.mp3') || file.type === 'audio/mpeg' || file.type === 'audio/mp3';
    if (!isMp3) {
      setError('Hanya file audio berformat MP3 (.mp3) yang diperbolehkan');
      return false;
    }
    const maxSize = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSize) {
      setError('Ukuran file audio melebihi batas maksimal 15MB');
      return false;
    }
    return true;
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setProgress(1);

    // Stop current playing audio
    stopPreview();

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/uploads/music', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
        },
      });

      const uploadedUrl = response.data.data.url;
      onChange(uploadedUrl);
      setLocalFile(file);
    } catch (err: any) {
      console.error('Gagal mengunggah file audio:', err);
      const errMsg = err.response?.data?.message || 'Gagal mengunggah file audio ke server';
      setError(errMsg);
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (validateFile(file)) {
        uploadFile(file);
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (validateFile(file)) {
        uploadFile(file);
      }
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    stopPreview();
    onChange(null);
    setLocalFile(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Playback handlers
  const getAudioUrl = () => {
    if (localFile) {
      return URL.createObjectURL(localFile);
    }
    if (value) {
      return getAssetUrl(value);
    }
    return '';
  };

  const togglePreview = () => {
    if (!audioPlayerRef.current) {
      const url = getAudioUrl();
      if (!url) return;
      const audio = new Audio(url);
      audio.addEventListener('ended', () => setIsPlaying(false));
      audioPlayerRef.current = audio;
    }

    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error('Audio play error:', err);
          setError('Autoplay diblokir oleh browser. Silakan coba lagi.');
        });
    }
  };

  const stopPreview = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    setIsPlaying(false);
  };

  const showPreview = !!value || !!localFile || isUploading;

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] block text-gold-400">
          {label}
        </span>
      )}

      {/* Drag & Drop Zone */}
      {!showPreview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerSelect}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] ${
            isDragOver
              ? 'border-gold-500 bg-gold-500/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
              : 'border-white/10 hover:border-gold-500/30 bg-slate-900/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".mp3,audio/mpeg"
            className="hidden"
          />
          <UploadCloud className="w-8 h-8 text-slate-400 mb-2 group-hover:text-gold-400 animate-pulse-subtle" />
          <p className="text-xs text-slate-300 font-medium">
            Tarik & lepas file audio, atau <span className="text-gold-400 font-semibold">pilih file</span>
          </p>
          <p className="text-[9px] text-slate-500 mt-1 font-mono uppercase">
            Format MP3 hingga 15MB
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Active Preview */}
          <UploadPreview
            name={localFile ? localFile.name : value ? value.split('/').pop() || 'Musik Latar' : 'Mengunggah...'}
            size={localFile?.size}
            progress={progress}
            error={error || undefined}
            isSuccess={!!value && !isUploading && !error}
            onRemove={handleRemove}
          />

          {/* Interactive Player Controls */}
          {value && !isUploading && (
            <div className="flex flex-wrap gap-2 items-center">
              {/* Play/Pause Button */}
              <button
                type="button"
                onClick={togglePreview}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-premium cursor-pointer border ${
                  isPlaying
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-gold-500/10 border-gold-500/20 text-gold-300 hover:border-gold-500/40'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Jeda Putar
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Dengar Audio
                  </>
                )}
              </button>

              {/* Replace Button */}
              <button
                type="button"
                onClick={triggerSelect}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 hover:border-gold-500/40 text-[10px] font-bold text-slate-300 hover:text-gold-200 transition-colors uppercase cursor-pointer"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".mp3,audio/mpeg"
                  className="hidden"
                />
                <RefreshCw className="w-3.5 h-3.5" /> Ganti Audio
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
