'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FileUploadProps {
  onUpload: (url: string) => void;
  folder?: string;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  disabled?: boolean;
}

export function FileUpload({ 
  onUpload, 
  folder = 'maids-for-care', 
  accept = 'image/*',
  maxSize = 5,
  multiple = false,
  disabled = false
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      console.log(`Uploading file: ${file.name} (${file.size} bytes)`);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Upload successful:', data.url);
        onUpload(data.url);
      } else {
        console.error('Upload failed:', data);
        const errorMsg = data.details || data.error || 'Upload failed';
        
        // Show more specific error messages
        if (errorMsg.includes('R2 storage is not properly configured')) {
          alert('Storage service is not configured. Please contact support.');
        } else if (errorMsg.includes('SSL') || errorMsg.includes('handshake')) {
          alert('Connection error. Please try again or contact support.');
        } else if (errorMsg.includes('credentials')) {
          alert('Authentication error. Please contact support.');
        } else {
          alert(errorMsg);
        }
        
        setPreview(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Network error. Please check your connection and try again.');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />

      {!preview ? (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors ${
            disabled 
              ? 'cursor-not-allowed opacity-50' 
              : 'cursor-pointer hover:border-gray-400'
          }`}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            {accept.includes('image') ? 'PNG, JPG, WebP' : 'Files'} up to {maxSize}MB
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <ImageIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  {uploading ? 'Uploading...' : 'Upload complete'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearPreview}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-32 object-cover rounded"
            />
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}