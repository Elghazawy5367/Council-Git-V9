/**
 * EnhancedFileUpload Component
 * 
 * Industry-standard file upload with react-dropzone
 * 
 * Features:
 * - Drag & drop support
 * - Multiple file types (PDF, TXT, MD, images)
 * - File preview (images inline, documents with icon)
 * - Progress indicators
 * - File size validation
 * - Accept/reject file types
 * - Remove uploaded files
 */

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/primitives/button';
import { Card } from '@/components/primitives/card';
import { Progress } from '@/components/primitives/progress';
import { 
  Upload, 
  X, 
  FileText, 
  Image as ImageIcon, 
  File as FileIcon,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// File type definitions
const ACCEPTED_FILE_TYPES = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
  'text/csv': ['.csv']
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface FileWithPreview extends File {
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: 'uploading' | 'success' | 'error';
}

interface EnhancedFileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
}

export function EnhancedFileUpload({ 
  files, 
  onFilesChange, 
  disabled = false,
  maxFiles = 10
}: EnhancedFileUploadProps) {
  const [filesWithPreview, setFilesWithPreview] = useState<FileWithPreview[]>([]);

  // Handle file drop/selection
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach((error: any) => {
        if (error.code === 'file-too-large') {
          toast.error(`${file.name} is too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
        } else if (error.code === 'file-invalid-type') {
          toast.error(`${file.name} has an invalid file type`);
        } else {
          toast.error(`${file.name}: ${error.message}`);
        }
      });
    });

    // Process accepted files
    if (acceptedFiles.length > 0) {
      const newFiles: FileWithPreview[] = acceptedFiles.map(file => {
        const fileWithPreview = Object.assign(file, {
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          uploadProgress: 0,
          uploadStatus: 'uploading' as const
        });

        // Simulate upload progress
        simulateUpload(fileWithPreview);
        
        return fileWithPreview;
      });

      setFilesWithPreview(prev => [...prev, ...newFiles]);
      onFilesChange([...files, ...acceptedFiles]);
      toast.success(`Added ${acceptedFiles.length} file(s)`);
    }
  }, [files, onFilesChange]);

  // Simulate file upload with progress
  const simulateUpload = (file: FileWithPreview) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      
      setFilesWithPreview(prev => 
        prev.map(f => 
          f.name === file.name && f.size === file.size
            ? { ...f, uploadProgress: progress, uploadStatus: progress >= 100 ? 'success' : 'uploading' }
            : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles,
    disabled,
    multiple: true
  });

  // Remove file
  const removeFile = (index: number) => {
    const fileToRemove = filesWithPreview[index];
    
    // Revoke preview URL if it exists
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const newFilesWithPreview = filesWithPreview.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);
    
    setFilesWithPreview(newFilesWithPreview);
    onFilesChange(newFiles);
    
    toast.success('File removed');
  };

  // Get file type icon
  const getFileIcon = (file: FileWithPreview) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileIcon className="h-4 w-4 text-red-500" />;
    } else {
      return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get status icon
  const getStatusIcon = (file: FileWithPreview) => {
    if (file.uploadStatus === 'success') {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    } else if (file.uploadStatus === 'error') {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    } else if (file.uploadStatus === 'uploading') {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
          "hover:border-primary/50 hover:bg-primary/5",
          isDragActive && !isDragReject && "border-primary bg-primary/10",
          isDragReject && "border-red-500 bg-red-50/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className={cn(
            "h-10 w-10 mb-2",
            isDragActive && !isDragReject ? "text-primary" : "text-muted-foreground",
            isDragReject && "text-red-500"
          )} />
          
          {isDragReject ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-600">
                Some files will be rejected
              </p>
              <p className="text-xs text-red-500">
                Please check file type and size
              </p>
            </div>
          ) : isDragActive ? (
            <p className="text-sm font-medium text-primary">
              Drop files here...
            </p>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Drag & drop files here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: Images (PNG, JPG, GIF, WEBP), PDF, TXT, MD, CSV
              </p>
              <p className="text-xs text-muted-foreground">
                Max file size: 10MB • Max {maxFiles} files
              </p>
            </div>
          )}
        </div>
      </div>

      {/* File Previews */}
      {filesWithPreview.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Attached Files ({filesWithPreview.length})
            </p>
            {filesWithPreview.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  filesWithPreview.forEach(file => {
                    if (file.preview) URL.revokeObjectURL(file.preview);
                  });
                  setFilesWithPreview([]);
                  onFilesChange([]);
                }}
                disabled={disabled}
                className="h-8 text-xs"
              >
                Remove All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filesWithPreview.map((file, index) => (
              <Card key={`${file.name}-${index}`} className="p-3">
                <div className="flex items-start gap-3">
                  {/* File Preview/Icon */}
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="h-16 w-16 object-cover rounded border"
                        onLoad={() => {
                          // Revoke preview URL after image loads to free memory
                          // We'll keep it for now for better UX
                        }}
                      />
                    ) : (
                      <div className="h-16 w-16 flex items-center justify-center bg-muted rounded border">
                        {getFileIcon(file)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                          {getStatusIcon(file)}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={disabled}
                        className="h-8 w-8 p-0 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Upload Progress */}
                    {file.uploadStatus === 'uploading' && file.uploadProgress !== undefined && (
                      <div className="space-y-1">
                        <Progress value={file.uploadProgress} className="h-1" />
                        <p className="text-xs text-muted-foreground">
                          Uploading... {file.uploadProgress}%
                        </p>
                      </div>
                    )}

                    {file.uploadStatus === 'success' && (
                      <p className="text-xs text-green-600">
                        ✓ Upload complete
                      </p>
                    )}

                    {file.uploadStatus === 'error' && (
                      <p className="text-xs text-red-600">
                        ✗ Upload failed
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
