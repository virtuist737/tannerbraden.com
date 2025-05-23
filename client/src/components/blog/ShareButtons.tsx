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
    <path d="M17.743 11.123a8.547 8.547 0 0 0-.315-.142c-.185-3.414-2.05-5.368-5.182-5.388h-.042c-1.874 0-3.431.822-4.39 2.065l1.716 1.622a3.014 3.014 0 0 1 2.633-1.326l.03.001c1.12.009 1.96.364 2.49 1.058.383.502.598 1.15.686 1.93a8.356 8.356 0 0 0-2.89-.33c-2.61.122-4.238 1.857-4.087 4.347.077 1.234.677 2.29 1.691 2.973 1.02.687 2.308.96 3.587.761 1.724-.266 2.997-1.199 3.622-2.657.396-.924.632-2.074.7-3.407.751.447 1.333 1.04 1.734 1.778.695 1.28.89 3.113.563 5.324-.413 2.762-1.875 4.813-4.356 6.09l-1.335-1.893c1.147-.721 2.008-1.697 2.55-2.925-1.028.477-2.162.718-3.384.718C9.936 21.822 7 19.272 7 15.161c0-.147.005-.293.015-.44-.03-1.556.35-2.93 1.11-4.051.806-1.185 2.02-2.048 3.528-2.433 1.475-.378 2.879-.32 4.09.886Z" />
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