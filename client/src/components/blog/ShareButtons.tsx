import { Share2, Link, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Facebook, AtSign } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  className?: string;
}

export default function ShareButtons({ title, className = "" }: ShareButtonsProps) {
  const { toast } = useToast();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        <Share2 className="h-4 w-4" /> Share:
      </span>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({
              title: "Link copied",
              description: "The blog post URL has been copied to your clipboard",
            });
          }}
        >
          <Link className="h-4 w-4 mr-1" />
          Copy
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                window.location.href
              )}&text=${encodeURIComponent(title)}`,
              "_blank"
            )
          }
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={() =>
            window.open(
              `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                window.location.href
              )}&title=${encodeURIComponent(title)}`,
              "_blank"
            )
          }
        >
          <Linkedin className="h-4 w-4" />
        </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() =>
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  window.location.href
                )}`,
                "_blank"
              )
            }
          >
            <Facebook className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() =>
              window.open(
                `https://www.threads.net/share?url=${encodeURIComponent(
                  window.location.href
                )}`,
                "_blank"
              )
            }
          >
            <AtSign className="h-4 w-4" />
          </Button>
      </div>
    </div>
  );
}