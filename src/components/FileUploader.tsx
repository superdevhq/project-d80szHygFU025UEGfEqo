
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { FileAudio, FileVideo, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
  file: File | null;
  acceptedFileTypes?: Record<string, string[]>;
}

const FileUploader = ({ 
  onFileChange, 
  file, 
  acceptedFileTypes = { 'audio/*': [], 'video/*': [] } 
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    // Check if file is audio or video
    const isAudio = selectedFile.type.startsWith('audio/');
    const isVideo = selectedFile.type.startsWith('video/');
    
    if (isAudio || isVideo) {
      onFileChange(selectedFile);
    } else {
      alert('Please upload an audio or video file.');
      onFileChange(null);
    }
  };

  const getAcceptString = () => {
    const acceptValues: string[] = [];
    
    Object.entries(acceptedFileTypes).forEach(([mimeType, extensions]) => {
      acceptValues.push(mimeType);
      extensions.forEach(ext => acceptValues.push(ext));
    });
    
    return acceptValues.join(',');
  };

  const isAudioFile = file?.type.startsWith('audio/');
  const isVideoFile = file?.type.startsWith('video/');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center transition-colors",
            isDragging 
              ? "border-primary/50 bg-primary/5" 
              : "border-muted-foreground/25 hover:bg-muted/25"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-1 text-lg font-semibold">Drag & drop your file</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            or click to browse files
          </p>
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            className="relative"
          >
            Select File
            <input
              ref={fileInputRef}
              type="file"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={handleFileInput}
              accept={getAcceptString()}
            />
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-md bg-primary/10 p-2">
              {isAudioFile ? (
                <FileAudio className="h-8 w-8 text-primary" />
              ) : isVideoFile ? (
                <FileVideo className="h-8 w-8 text-primary" />
              ) : (
                <FileAudio className="h-8 w-8 text-primary" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{file.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)} • {file.type}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => onFileChange(null)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
                <div className="h-full w-full bg-primary" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
