import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Image as ImageIcon, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImageUploadProps {
  imageUrl?: string | null;
  entityId: string | number;
  entityType: 'timeline' | 'interest' | 'favorite' | 'blog' | 'project' | 'blog-content' | 'timeline-content';
  onSuccess?: (newImageUrl: string) => void;
  trigger?: React.ReactNode;
  multiple?: boolean;
}

export const ImageUpload = ({ imageUrl, entityId, entityType, onSuccess, trigger, multiple = false }: ImageUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const fileArray = Array.from(files);
    const invalidFiles = fileArray.filter(file => !file.type.startsWith('image/'));

    if (invalidFiles.length > 0) {
      toast({
        title: "Error",
        description: "Please upload only image files",
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Error",
        description: "Each image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = fileArray.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

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

        return data.imageUrl;
      });

      const urls = await Promise.all(uploadPromises);

      if (multiple) {
        setUploadedImages(prev => [...prev, ...urls]);
        urls.forEach(url => onSuccess?.(url));
      } else {
        onSuccess?.(urls[0]);
      }

      toast({
        title: "Success",
        description: `${urls.length} image${urls.length > 1 ? 's' : ''} uploaded successfully`,
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
      event.target.value = '';
    }
  };

  const handleSelectImage = (url: string) => {
    onSuccess?.(url);
    setShowGallery(false);
  };

  const handleRemoveImage = (urlToRemove: string) => {
    setUploadedImages(prev => prev.filter(url => url !== urlToRemove));
  };

  const ImageGallery = () => (
    <Dialog open={showGallery} onOpenChange={setShowGallery}>
      <DialogContent className="sm:max-w-[80vw]">
        <DialogHeader>
          <DialogTitle>Image Gallery</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Uploaded content ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() => handleSelectImage(url)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(url);
                  }}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  if (trigger) {
    return (
      <>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center">{trigger}</div>
          )}
        </label>
        {multiple && uploadedImages.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowGallery(true);
            }}
            className="ml-2"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        )}
        <ImageGallery />
      </>
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
                  multiple={multiple}
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
            multiple={multiple}
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
                Upload Image{multiple ? 's' : ''}
              </>
            )}
          </div>
        </label>
      ) : null}
      {multiple && <ImageGallery />}
    </div>
  );
};