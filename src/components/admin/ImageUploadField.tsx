import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Link, Check, AlertCircle } from 'lucide-react';
import { convertImageFileToBase64 } from '../../services/cmsStore';

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (dataUrlOrUrl: string) => void;
  aspectHint?: string;
  placeholder?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  aspectHint = 'Recommended ratio: 16:9 (Landscape) or 4:3',
  placeholder = 'https://example.com/image.jpg',
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WebP).');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const dataUrl = await convertImageFileToBase64(file);
      onChange(dataUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const applyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setError(null);
    }
  };

  const clearImage = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">{label}</label>
        <div className="flex items-center gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              mode === 'upload' ? 'bg-[#0C1B2A] text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload File
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              mode === 'url' ? 'bg-[#0C1B2A] text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Web URL
          </button>
        </div>
      </div>

      {/* Preview if image exists */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
          <img
            src={value}
            alt="Preview"
            className="w-full max-h-56 object-cover object-center"
            onError={() => setError('Unable to render image. Check link or file.')}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 text-xs font-semibold hover:bg-white flex items-center gap-1.5 shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              Change Photo
            </button>
            <button
              type="button"
              onClick={clearImage}
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 flex items-center gap-1.5 shadow-sm"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
          <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-xs">
            {value.startsWith('data:') ? 'Uploaded Image' : 'External Image'}
          </span>
        </div>
      ) : (
        <>
          {mode === 'upload' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#E59A1E] bg-[#FFFBF0]'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/70 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-600">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-700">
                    <span className="text-[#B8780E]">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-[11px] text-slate-400">PNG, JPG, WebP (auto-optimized)</p>
                  <p className="text-[10px] text-slate-400 italic">{aspectHint}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#E59A1E]"
                />
              </div>
              <button
                type="button"
                onClick={applyUrl}
                className="px-4 py-2 rounded-xl bg-[#0C1B2A] hover:bg-[#162E4A] text-white text-xs font-semibold transition-colors shrink-0 flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply</span>
              </button>
            </div>
          )}
        </>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
