'use client';

import { useState, useRef, useCallback } from 'react';
import { Loader2, Upload, X, FileIcon } from 'lucide-react';

interface PortalDocumentUploadProps {
  caseId: string;
  onUploadComplete: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PortalDocumentUpload({ caseId, onUploadComplete }: PortalDocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setError('');
    if (f.size > MAX_FILE_SIZE) {
      setError('El archivo excede el limite de 10MB');
      return;
    }
    setFile(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragActive(false), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);
      const res = await fetch(`/api/cases/${caseId}/documents`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Error subiendo documento');
        return;
      }
      setFile(null);
      setDescription('');
      if (inputRef.current) inputRef.current.value = '';
      onUploadComplete();
    } catch {
      setError('Error de conexion');
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-lg bg-red-500/20 border border-red-400/30 p-3 text-sm text-red-200">{error}</div>
      )}

      <div
        className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragActive ? 'border-[#d4a843] bg-white/10' : 'border-white/30 hover:border-white/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileIcon className="h-5 w-5 text-white" />
            <div className="text-left">
              <p className="text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs text-white">{formatFileSize(file.size)}</p>
            </div>
            <button
              type="button"
              className="h-6 w-6 flex items-center justify-center rounded hover:bg-white/10 text-white transition-colors"
              onClick={() => {
                setFile(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="mx-auto mb-2 h-8 w-8 text-white" />
            <p className="text-sm text-white">
              Arrastra un archivo aqui o{' '}
              <button
                type="button"
                className="text-[#d4a843] underline"
                onClick={() => inputRef.current?.click()}
              >
                selecciona
              </button>
            </p>
            <p className="text-xs text-white mt-1">Maximo 10MB</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="doc-description" className="text-sm text-white">Descripcion (opcional)</label>
        <input
          id="doc-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Breve descripcion del documento..."
          disabled={uploading}
          className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-[#d4a843]/60 focus:outline-none focus:ring-2 focus:ring-[#d4a843]/20 disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={!file || uploading}
        className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0a2a6e] transition-all disabled:cursor-not-allowed disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, #d4a843, #c49a30)' }}
      >
        <span className="flex items-center justify-center gap-2">
          {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
          {uploading ? 'Subiendo...' : (
            <><Upload className="h-4 w-4" /> Subir Documento</>
          )}
        </span>
      </button>
    </form>
  );
}
