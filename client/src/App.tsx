import { Suspense, lazy } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NotFound from "@/pages/not-found";

// Lazy load pages
const Home = lazy(() => import("@/pages/home"));
const About = lazy(() => import("@/pages/about"));
const Blog = lazy(() => import("@/pages/blog"));
const Portfolio = lazy(() => import("@/pages/portfolio"));
const Contact = lazy(() => import("@/pages/contact"));
const BlogPost = lazy(() => import("@/pages/blog/[slug]"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Auth = lazy(() => import("@/pages/auth"));
const AdminBlog = lazy(() => import("@/pages/admin/blog"));
const AdminNewsletter = lazy(() => import("@/pages/admin/newsletter"));
const AdminTimeline = lazy(() => import("@/pages/admin/timeline"));
const NewBlogPost = lazy(() => import("@/pages/admin/blog/new"));
const EditBlogPost = lazy(() => import("@/pages/admin/blog/[id]/edit"));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-pulse text-primary">Loading...</div>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
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
        <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} path="/dashboard" />} />
        <Route path="/admin/blog" component={() => <ProtectedRoute component={AdminBlog} path="/admin/blog" />} />
        <Route path="/admin/blog/new" component={() => <ProtectedRoute component={NewBlogPost} path="/admin/blog/new" />} />
        <Route path="/admin/blog/:id/edit" component={() => <ProtectedRoute component={EditBlogPost} path="/admin/blog/:id/edit" />} />
        <Route path="/admin/newsletter" component={() => <ProtectedRoute component={AdminNewsletter} path="/admin/newsletter" />} />
        <Route path="/admin/timeline" component={() => <ProtectedRoute component={AdminTimeline} path="/admin/timeline" />} />

        <Route component={NotFound} />
      </Switch>
    </Suspense>
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