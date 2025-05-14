import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location.startsWith(path) ? "bg-accent" : "";
  };

  return (
    <div className="flex min-h-screen">
      <ScrollArea className="w-64 border-r bg-card p-4 hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start ${isActive("/admin/blog")}`}
            asChild
          >
            <Link href="/admin/blog">Blog Posts</Link>
          </Button>
          
          <Button
            variant="ghost"
            className={`w-full justify-start ${isActive("/admin/companies")}`}
            asChild
          >
            <Link href="/admin/companies">Companies</Link>
          </Button>
          
          <Button
            variant="ghost"
            className={`w-full justify-start ${isActive("/admin/projects")}`}
            asChild
          >
            <Link href="/admin/projects">Projects</Link>
          </Button>
          
          <Button
            variant="ghost"
            className={`w-full justify-start ${isActive("/admin/timeline")}`}
            asChild
          >
            <Link href="/admin/timeline">Timeline</Link>
          </Button>
          
          <Button
            variant="ghost"
            className={`w-full justify-start ${isActive("/admin/interests")}`}
            asChild
          >
            <Link href="/admin/interests">Interests</Link>
          </Button>
          
          <Button
            variant="ghost"
            className={`w-full justify-start ${isActive("/admin/favorites")}`}
            asChild
          >
            <Link href="/admin/favorites">Favorites</Link>
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start ${isActive("/admin/newsletter")}`}
            asChild
          >
            <Link href="/admin/newsletter">Newsletter</Link>
          </Button>
        </div>
      </ScrollArea>

      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}