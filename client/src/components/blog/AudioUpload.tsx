import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, X, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface AudioUploadProps {
  audioUrl?: string;
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  accept?: string;
}

export function AudioUpload({
  audioUrl,
  onUploadComplete,
  onRemove,
  label = "Audio File",
  accept = "audio/mp3,audio/wav,audio/ogg,audio/mpeg"
}: AudioUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-wav'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an MP3, WAV, or OGG audio file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an audio file smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      xhr.onload = async function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          onUploadComplete(response.url);
          toast({
            title: "Audio uploaded",
            description: "Your audio file has been uploaded successfully.",
          });
        } else {
          throw new Error('Upload failed');
        }
        setIsUploading(false);
        setUploadProgress(0);
      };

      xhr.onerror = function() {
        toast({
          title: "Upload failed",
          description: "Failed to upload audio file. Please try again.",
          variant: "destructive",
        });
        setIsUploading(false);
        setUploadProgress(0);
      };

      xhr.open('POST', '/api/upload/audio');
      xhr.withCredentials = true;
      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload audio file. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {audioUrl ? (
        <div className="flex items-center gap-2 p-3 bg-secondary rounded-md">
          <Music className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm flex-1 truncate">Audio file uploaded</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onRemove?.();
              onUploadComplete('');
            }}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <Input
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={isUploading}
            className="cursor-pointer"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
              <div className="text-center">
                <div className="text-sm font-medium">{uploadProgress}%</div>
                <div className="w-32 h-2 bg-secondary rounded-full mt-1">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Accepted formats: MP3, WAV, OGG (max 50MB)
      </p>
    </div>
  );
}