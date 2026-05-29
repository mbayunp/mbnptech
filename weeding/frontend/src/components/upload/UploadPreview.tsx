'use client';

import { X, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadPreviewProps {
  name: string;
  size?: number;
  progress?: number;
  error?: string;
  isSuccess?: boolean;
  onRemove?: () => void;
  imageUrl?: string;
}

export default function UploadPreview({
  name,
  size,
  progress = 0,
  error,
  isSuccess = false,
  onRemove,
  imageUrl,
}: UploadPreviewProps) {
  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="relative p-4 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md flex items-center gap-4 transition-all duration-300">
      {/* Thumbnail or Icon */}
      <div className="w-12 h-12 rounded-lg bg-slate-950 border border-white/5 overflow-hidden flex items-center justify-center flex-shrink-0 relative">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="object-cover w-full h-full" />
        ) : (
          <FileText className="w-6 h-6 text-slate-400" />
        )}
      </div>

      {/* Details & Progress */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-200 truncate mb-0.5">{name}</p>
        
        {size && !error && progress === 0 && (
          <p className="text-[10px] text-slate-400 font-mono">{formatSize(size)}</p>
        )}

        {/* Progress bar */}
        {progress > 0 && progress < 100 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>Mengunggah...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sapphire-500 to-gold-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Success State */}
        {isSuccess && (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 font-mono uppercase">
            <CheckCircle className="w-3.5 h-3.5" /> Berhasil Diunggah
          </span>
        )}

        {/* Error State */}
        {error && (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-400 font-mono">
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </span>
        )}
      </div>

      {/* Actions */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="p-1 rounded-full bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
