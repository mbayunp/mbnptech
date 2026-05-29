'use client';

import { useState, useRef, DragEvent } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import api, { getAssetUrl } from '../../services/api';

interface GalleryItemInput {
  id?: string;
  imageUrl: string;
  sortOrder?: number;
}

interface GalleryUploaderProps {
  values: GalleryItemInput[];
  onChange: (items: GalleryItemInput[]) => void;
  label?: string;
  className?: string;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  error?: string;
}

export default function GalleryUploader({
  values = [],
  onChange,
  label = 'Galeri Foto Pernikahan',
  className = '',
}: GalleryUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side validations
  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Hanya file gambar JPG, JPEG, PNG, dan WEBP yang didukung';
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'Ukuran gambar melebihi batas maksimal 5MB';
    }
    return null;
  };

  const uploadFiles = async (files: FileList) => {
    setGlobalError(null);
    const validFiles: File[] = [];

    // Filter valid files first
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const errorMsg = validateFile(file);
      if (errorMsg) {
        setGlobalError(errorMsg);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Track upload progress for these files
    const newUploading: UploadingFile[] = validFiles.map(f => ({
      id: Math.random().toString(36).substring(2, 9),
      name: f.name,
      progress: 1,
    }));
    
    setUploadingFiles(prev => [...prev, ...newUploading]);

    // Upload each file
    const uploadPromises = validFiles.map(async (file, index) => {
      const uploadId = newUploading[index].id;
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await api.post('/uploads/galleries', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadingFiles(prev =>
              prev.map(item =>
                item.id === uploadId ? { ...item, progress: percentCompleted } : item
              )
            );
          },
        });

        const uploadedUrl = response.data.data.url;
        
        // Remove from uploading list
        setUploadingFiles(prev => prev.filter(item => item.id !== uploadId));
        
        // Return URL to append to the gallery list
        return uploadedUrl;
      } catch (err: any) {
        console.error('Gagal mengunggah gambar:', err);
        const errMsg = err.response?.data?.message || 'Gagal unggah';
        setUploadingFiles(prev =>
          prev.map(item =>
            item.id === uploadId ? { ...item, error: errMsg, progress: 0 } : item
          )
        );
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUrls = results.filter(Boolean) as string[];

    if (successfulUrls.length > 0) {
      const newItems: GalleryItemInput[] = successfulUrls.map((url, idx) => ({
        imageUrl: url,
        sortOrder: values.length + idx,
      }));
      onChange([...values, ...newItems]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFiles(files);
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
    if (files && files.length > 0) {
      uploadFiles(files);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...values];
    updated.splice(index, 1);
    // Reset sort orders
    const resetSorted = updated.map((item, idx) => ({
      ...item,
      sortOrder: idx,
    }));
    onChange(resetSorted);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === values.length - 1) return;

    const updated = [...values];
    const swapTarget = direction === 'left' ? index - 1 : index + 1;
    
    // Swap items
    const temp = updated[index];
    updated[index] = updated[swapTarget];
    updated[swapTarget] = temp;

    // Reset sortOrder fields to match array index
    const resetSorted = updated.map((item, idx) => ({
      ...item,
      sortOrder: idx,
    }));
    
    onChange(resetSorted);
  };

  const removeUploading = (id: string) => {
    setUploadingFiles(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] block text-gold-400">
          {label}
        </span>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerSelect}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] ${
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
          multiple
          className="hidden"
        />
        <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
        <p className="text-xs text-slate-300 font-medium">
          Tarik & lepas file foto, atau <span className="text-gold-400 font-semibold">pilih file</span>
        </p>
        <p className="text-[9px] text-slate-500 mt-1 font-mono uppercase">
          JPEG, PNG, WEBP hingga 5MB (Bisa pilih banyak sekaligus)
        </p>
      </div>

      {globalError && (
        <p className="text-xs text-rose-450 font-medium bg-rose-950/20 border border-rose-500/20 px-4 py-2 rounded-xl">
          {globalError}
        </p>
      )}

      {/* Grid of existing gallery items & uploading queues */}
      {(values.length > 0 || uploadingFiles.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          
          {/* Active gallery items */}
          {values.map((item, index) => (
            <div 
              key={item.id || index}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-lg hover:border-gold-500/30 transition-all duration-300"
            >
              <img 
                src={getAssetUrl(item.imageUrl)} 
                alt={`Gallery ${index}`} 
                className="object-cover w-full h-full"
              />
              
              {/* Overlay controls on hover */}
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 z-10">
                {/* Top Action (Delete) */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white cursor-pointer transition-colors shadow-md"
                    title="Hapus foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Actions (Reorder) */}
                <div className="flex justify-between gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'left')}
                    className={`p-1.5 rounded-lg bg-slate-850 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-white/5 ${
                      index === 0 ? 'opacity-30 pointer-events-none' : ''
                    }`}
                    title="Geser Kiri"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[10px] text-slate-400 font-mono self-center">
                    {index + 1}
                  </span>

                  <button
                    type="button"
                    disabled={index === values.length - 1}
                    onClick={() => handleMove(index, 'right')}
                    className={`p-1.5 rounded-lg bg-slate-850 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-white/5 ${
                      index === values.length - 1 ? 'opacity-30 pointer-events-none' : ''
                    }`}
                    title="Geser Kanan"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Uploading queue previews */}
          {uploadingFiles.map(file => (
            <div 
              key={file.id}
              className="relative aspect-[3/4] rounded-2xl border border-dashed border-white/10 bg-slate-900/60 backdrop-blur-md p-4 flex flex-col items-center justify-center text-center gap-2"
            >
              {file.error ? (
                <>
                  <p className="text-[10px] text-rose-400 font-medium px-2 leading-relaxed truncate max-w-full">
                    {file.name}
                  </p>
                  <p className="text-[9px] text-rose-500 font-mono px-2 leading-tight">
                    {file.error}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeUploading(file.id)}
                    className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer mt-2"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <ImageIcon className="w-6 h-6 text-slate-500 animate-pulse" />
                  <p className="text-[10px] text-slate-400 truncate max-w-full px-2">{file.name}</p>
                  
                  {/* Progress Ring or Bar */}
                  <div className="w-full px-4 mt-2">
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-sapphire-500 to-gold-500 transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono mt-1 block">
                      {file.progress}%
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
