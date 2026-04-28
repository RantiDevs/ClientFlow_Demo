import React, { useCallback, useState } from 'react';
import { Upload, X, File as FileIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';

interface FileUploaderProps {
  onFileSelect: (file: File, previewUrl: string) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export function FileUploader({ 
  onFileSelect, 
  accept = "image/*,.pdf", 
  maxSizeMB = 5,
  className 
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setError(null);
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onFileSelect(file, result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer",
          isDragging ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:bg-slate-50",
          error ? "border-red-500 bg-red-50" : ""
        )}
      >
        <input
          type="file"
          className="hidden"
          id="file-upload"
          accept={accept}
          onChange={handleFileInput}
        />
        <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full">
          <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-500">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
          <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or PDF (max {maxSizeMB}MB)</p>
        </label>
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}

interface FilePreviewProps {
  file: File;
  previewUrl: string;
  onRemove: () => void;
}

export function FilePreview({ file, previewUrl, onRemove }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/');

  return (
    <div className="flex items-center p-3 bg-white border border-slate-200 rounded-lg shadow-sm mt-3 relative group">
      <div className="h-10 w-10 flex-shrink-0 rounded bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
        {isImage ? (
          <img src={previewUrl} alt="preview" className="h-full w-full object-cover" />
        ) : (
          <FileIcon className="h-5 w-5 text-slate-500" />
        )}
      </div>
      <div className="ml-3 flex-1 overflow-hidden">
        <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
        <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-red-500"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
