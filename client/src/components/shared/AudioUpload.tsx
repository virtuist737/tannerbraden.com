import { useState } from "react";
import { Upload, Music, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface AudioUploadProps {
  onUpload: (file: File) => Promise<string>;
  onRemove?: () => void;
  value?: string;
  disabled?: boolean;
  className?: string;
}

export default function AudioUpload({
  onUpload,
  onRemove,
  value,
  disabled,
  className,
}: AudioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      alert("Please upload an audio file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  if (value) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Audio uploaded</p>
                <p className="text-sm text-muted-foreground">
                  {value.split("/").pop()?.split(".")[0] || "Audio file"}
                </p>
              </div>
            </div>
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <audio controls className="w-full mt-3">
            <source src={value} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className={`${className} border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors ${
        dragActive ? "border-primary bg-primary/5" : ""
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4">
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <Music className="h-8 w-8 text-muted-foreground" />
        )}
        
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {uploading ? "Uploading..." : "Upload audio file"}
          </p>
          <p className="text-xs text-muted-foreground">
            Drag and drop or click to select (MP3, WAV, etc. - max 10MB)
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="audio-upload" className="sr-only">
            Upload audio file
          </Label>
          <Input
            id="audio-upload"
            type="file"
            accept="audio/*"
            onChange={handleFileInputChange}
            disabled={disabled || uploading}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            disabled={disabled || uploading}
            onClick={() => document.getElementById("audio-upload")?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </div>
      </div>
    </div>
  );
}