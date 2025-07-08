import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import MusicStudio from "@/pages/MusicStudio";

export default function App() {



  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-background">
          <div className="fixed top-4 right-4 z-50">
            <ModeToggle />
          </div>
          <Switch>
            <Route path="/" component={MusicStudio} />
            <Route path="/studio" component={MusicStudio} />
            <Route>
              <MusicStudio />
            </Route>
          </Switch>
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}