import { Share2, Link, Linkedin, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ThreadsIcon = () => (
  <svg viewBox="0 0 4000 8000" className="h-4 w-4 fill-current">
    <path d="M3815 7254 c-329 -33 -537 -69 -745 -129 -1007 -293 -1660 -1067 -1899 -2250 -127 -629 -125 -1431 5 -2060 127 -618 384 -1149 740 -1527 371 -395 835 -645 1414 -762 235 -48 437 -66 730 -66 736 0 1275 160 1757 521 120 91 358 325 441 436 255 338 382 711 382 1123 0 686 -353 1240 -987 1550 l-112 55 -6 55 c-38 390 -122 656 -281 897 -190 287 -495 479 -871 548 -117 22 -404 31 -525 16 -339 -40 -640 -182 -863 -407 -69 -70 -175 -200 -175 -216 0 -4 44 -37 98 -73 53 -36 159 -108 235 -160 75 -52 141 -95 146 -95 4 0 21 18 37 41 64 93 209 203 329 251 144 58 177 63 405 62 206 0 219 -1 305 -28 137 -42 218 -89 311 -181 88 -87 137 -165 183 -292 28 -77 67 -231 60 -237 -2 -2 -44 2 -93 10 -255 38 -680 42 -916 8 -371 -52 -670 -190 -881 -405 -128 -130 -216 -285 -265 -465 -24 -88 -27 -117 -28 -264 -1 -174 7 -228 51 -360 196 -591 923 -912 1653 -730 582 144 945 601 1055 1328 4 23 9 42 12 42 3 0 42 -26 85 -57 272 -196 419 -454 449 -785 35 -408 -127 -788 -466 -1091 -385 -343 -854 -498 -1515 -501 -304 -1 -550 29 -800 98 -710 195 -1187 673 -1430 1435 -196 613 -234 1439 -99 2146 160 830 555 1404 1169 1693 211 100 459 170 735 208 181 25 638 26 810 1 326 -47 540 -109 781 -227 417 -204 719 -510 930 -945 70 -144 151 -352 176 -452 7 -27 13 -49 14 -51 1 -1 44 9 95 23 260 70 388 104 427 115 23 6 42 17 42 24 0 29 -94 303 -147 429 -151 360 -322 622 -578 886 -434 447 -961 696 -1681 791 -152 20 -586 35 -699 24z m825 -3499 c133 -14 297 -39 305 -47 5 -5 -23 -212 -40 -294 -32 -153 -103 -336 -167 -427 -36 -52 -130 -147 -176 -179 -151 -104 -319 -144 -564 -135 -162 5 -255 26 -372 82 -265 127 -371 402 -251 648 95 193 341 325 667 356 139 14 445 11 598 -4z" />
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