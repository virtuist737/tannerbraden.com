import { Share2, Link, Linkedin, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.067v-.052l.007-.463a6.413 6.413 0 0 1 1.739-4.159A6.43 6.43 0 0 1 7.39 5.615l.385-.011c1.315-.034 2.602.269 3.71.876a6.44 6.44 0 0 1 2.691 2.835c.532 1.152.801 2.423.801 3.792v.376a.75.75 0 0 1-1.5 0v-.376c0-1.088-.216-2.083-.641-2.964a4.94 4.94 0 0 0-2.067-2.175 4.996 4.996 0 0 0-2.85-.673l-.292.008a4.933 4.933 0 0 0-3.27 1.437 4.9 4.9 0 0 0-1.332 3.187l-.007.461v.054c0 3.214.766 5.771 2.275 7.594 1.532 1.85 3.904 2.815 7.055 2.834 3.199-.024 5.579-.977 7.112-2.834 1.509-1.823 2.275-4.38 2.275-7.594v-.054c0-.102-.002-.203-.006-.305l-.012-.431a4.875 4.875 0 0 0-1.332-3.186 4.933 4.933 0 0 0-3.27-1.437l-.292-.008a5.014 5.014 0 0 0-2.851.673 4.94 4.94 0 0 0-2.066 2.175.75.75 0 0 1-1.378-.588 6.44 6.44 0 0 1 2.691-2.835c1.108-.607 2.395-.91 3.71-.876l.385.011a6.43 6.43 0 0 1 4.144 1.778 6.413 6.413 0 0 1 1.739 4.159l.007.463v.052c0 3.519-.85 6.373-2.495 8.424-1.85 2.304-4.603 3.485-8.184 3.509h-.007z" />
  </svg>
);

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
          <XIcon />
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
          <ThreadsIcon />
        </Button>
      </div>
    </div>
  );
}