import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface ImageUploadProps {
  imageUrl?: string | null;
  entityId: number;
  entityType: 'timeline' | 'interest' | 'favorite' | 'blog' | 'project';
  onSuccess?: (newImageUrl: string) => void;
}

export const ImageUpload = ({ imageUrl, entityId, entityType, onSuccess }: ImageUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`/api/upload/${entityType}/${entityId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onSuccess?.(data.imageUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      {imageUrl ? (
        <div className="relative w-full overflow-hidden rounded-lg">
          <img
            src={imageUrl.startsWith('/') ? imageUrl : `/images/${imageUrl}`}
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