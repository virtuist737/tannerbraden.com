import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface ImageUploadProps {
  imageUrl?: string | null;
  entityId: string | number;
  entityType: 'timeline' | 'interest' | 'favorite' | 'blog' | 'project' | 'blog-content' | 'timeline-content';
  onSuccess?: (newImageUrl: string) => void;
  trigger?: React.ReactNode;
}

export const ImageUpload = ({ imageUrl, entityId, entityType, onSuccess, trigger }: ImageUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`/api/upload/${entityType}/${entityId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data = await response.json();
      if (!data.imageUrl) {
        throw new Error('No image URL returned from server');
      }

      onSuccess?.(data.imageUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  if (trigger) {
    return (
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        {isUploading ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </Button>
        ) : trigger}
      </label>
    );
  }

  return (
    <div className="relative group">
      {imageUrl ? (
        <div className="relative w-full overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt="Uploaded content"
            className="object-cover w-full h-full"
          />
          {isAuthenticated && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <Button variant="secondary" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Change Image
                    </>
                  )}
                </Button>
              </label>
            </div>
          )}
        </div>
      ) : isAuthenticated ? (
        <label className="cursor-pointer block">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          <div className="w-full p-8 border-2 border-dashed rounded-lg flex items-center justify-center">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </>
            )}
          </div>
        </label>
      ) : null}
    </div>
  );
};