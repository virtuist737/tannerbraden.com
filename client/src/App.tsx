import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/home";
import About from "@/pages/about";
import Blog from "@/pages/blog";
import Portfolio from "@/pages/portfolio";
import Contact from "@/pages/contact";
import BlogPost from "@/pages/blog/[slug]";
import Dashboard from "@/pages/dashboard";
import Auth from "@/pages/auth";
import AdminBlog from "@/pages/admin/blog";
import AdminPages from "@/pages/admin/pages";
import AdminNewsletter from "@/pages/admin/newsletter";
import NewBlogPost from "@/pages/admin/blog/new";
import EditBlogPost from "@/pages/admin/blog/[id]/edit";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/contact" component={Contact} />
      <Route path="/auth" component={Auth} />

      {/* Protected Admin Routes */}
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/admin/blog" component={AdminBlog} />
      <ProtectedRoute path="/admin/blog/new" component={NewBlogPost} />
      <ProtectedRoute path="/admin/blog/:id/edit" component={EditBlogPost} />
      <ProtectedRoute path="/admin/pages" component={AdminPages} />
      <ProtectedRoute path="/admin/newsletter" component={AdminNewsletter} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <div className="max-w-screen-2xl w-full mx-auto px-6 sm:px-8 lg:px-12">
              <Navbar />
              <main className="flex-grow">
                <Router />
              </main>
              {location !== "/404" && <Footer />}
            </div>
          </div>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;