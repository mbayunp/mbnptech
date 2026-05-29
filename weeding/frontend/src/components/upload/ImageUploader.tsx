'use client';

import { useState, useRef, DragEvent } from 'react';
import { UploadCloud, Image as ImageIcon, RefreshCw, Trash } from 'lucide-react';
import api, { getAssetUrl } from '../../services/api';
import UploadPreview from './UploadPreview';

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  type?: 'covers' | 'galleries' | 'profiles';
  label?: string;
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  type = 'covers',
  label = 'Unggah Gambar',
  className = '',
}: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side validations
  const validateFile = (file: File): boolean => {
    setError(null);
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Hanya file gambar JPG, JPEG, PNG, dan WEBP yang didukung');
      return false;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Ukuran gambar melebihi batas maksimal 5MB');
      return false;
    }
    return true;
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setProgress(1);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(`/uploads/${type}`, formData, {
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
      console.error('Gagal mengunggah gambar:', err);
      const errMsg = err.response?.data?.message || 'Gagal mengunggah gambar ke server';
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
    onChange(null);
    setLocalFile(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getPreviewUrl = () => {
    if (localFile) {
      return URL.createObjectURL(localFile);
    }
    if (value) {
      return getAssetUrl(value);
    }
    return '';
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
            accept="image/*"
            className="hidden"
          />
          <UploadCloud className="w-8 h-8 text-slate-400 mb-2 group-hover:text-gold-400 animate-pulse-subtle" />
          <p className="text-xs text-slate-300 font-medium">
            Tarik & lepas gambar, atau <span className="text-gold-400 font-semibold">pilih file</span>
          </p>
          <p className="text-[9px] text-slate-500 mt-1 font-mono uppercase">
            JPEG, PNG, WEBP hingga 5MB
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Active Preview */}
          <UploadPreview
            name={localFile ? localFile.name : value ? value.split('/').pop() || 'Gambar' : 'Mengunggah...'}
            size={localFile?.size}
            progress={progress}
            error={error || undefined}
            isSuccess={!!value && !isUploading && !error}
            onRemove={handleRemove}
            imageUrl={getPreviewUrl()}
          />
          
          {/* Action to Replace */}
          {value && !isUploading && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={triggerSelect}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold-500/40 text-[10px] font-bold text-slate-300 hover:text-gold-200 transition-colors uppercase cursor-pointer"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <RefreshCw className="w-3.5 h-3.5" /> Ganti Gambar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
