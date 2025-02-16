import { useState } from "react";
import { motion } from "framer-motion";
import { Layout, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// For now, we'll use a simple static list of pages
// This can be expanded later to use dynamic data from the API
const pages = [
  { id: "home", title: "Home Page", path: "/" },
  { id: "about", title: "About Page", path: "/about" },
  { id: "portfolio", title: "Portfolio Page", path: "/portfolio" },
  { id: "contact", title: "Contact Page", path: "/contact" },
];

export default function AdminPages() {
  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Page Builder</h1>
        </div>

        <div className="grid gap-4">
          {pages.map((page) => (
            <Card
              key={page.id}
              className="cursor-pointer hover:bg-accent transition-colors"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    {page.title}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Path: {page.path}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            Page builder functionality coming soon...
          </p>
        </div>
      </motion.div>
    </div>
  );
}
