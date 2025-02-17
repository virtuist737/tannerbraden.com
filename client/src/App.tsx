import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { queryClient } from "@/lib/queryClient";

// Pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog/[slug]";
import Contact from "@/pages/contact";
import SolarisLabs from "@/pages/solarislabs";
import Auth from "@/pages/auth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";

// Admin Pages
import AdminInterests from "@/pages/admin/interests";
import EditInterest from "@/pages/admin/interests/[id]/edit";
import NewInterest from "@/pages/admin/interests/new";
import AdminBlog from "@/pages/admin/blog";
import AdminNewsletter from "@/pages/admin/newsletter";
import AdminTimeline from "@/pages/admin/timeline";
import NewBlogPost from "@/pages/admin/blog/new";
import EditBlogPost from "@/pages/admin/blog/[id]/edit";
import EditTimelineEntry from "@/pages/admin/timeline/[id]/edit";
import NewTimelineEntry from "@/pages/admin/timeline/new";
import FavoritesList from "@/pages/admin/favorites";
import NewFavorite from "@/pages/admin/favorites/new";
import EditFavorite from "@/pages/admin/favorites/[id]/edit";
import AdminProjects from "@/pages/admin/projects";
import NewProject from "@/pages/admin/projects/new";
import EditProject from "@/pages/admin/projects/[id]/edit";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-background">
          <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <Navbar />
            <main className="flex-grow">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/blog" component={Blog} />
                <Route path="/blog/:slug" component={BlogPost} />
                <Route path="/contact" component={Contact} />
                <Route path="/solarislabs" component={SolarisLabs} />
                <Route path="/auth" component={Auth} />
                <ProtectedRoute path="/dashboard" component={Dashboard} />
                <ProtectedRoute path="/admin/interests" component={AdminInterests} />
                <ProtectedRoute path="/admin/interests/new" component={NewInterest} />
                <ProtectedRoute path="/admin/interests/:id/edit" component={EditInterest} />
                <ProtectedRoute path="/admin/blog" component={AdminBlog} />
                <ProtectedRoute path="/admin/blog/new" component={NewBlogPost} />
                <ProtectedRoute path="/admin/blog/:id/edit" component={EditBlogPost} />
                <ProtectedRoute path="/admin/newsletter" component={AdminNewsletter} />
                <ProtectedRoute path="/admin/timeline" component={AdminTimeline} />
                <ProtectedRoute path="/admin/timeline/new" component={NewTimelineEntry} />
                <ProtectedRoute path="/admin/timeline/:id/edit" component={EditTimelineEntry} />
                <ProtectedRoute path="/admin/favorites" component={FavoritesList} />
                <ProtectedRoute path="/admin/favorites/new" component={NewFavorite} />
                <ProtectedRoute path="/admin/favorites/:id/edit" component={EditFavorite} />
                <ProtectedRoute path="/admin/projects" component={AdminProjects} />
                <ProtectedRoute path="/admin/projects/new" component={NewProject} />
                <ProtectedRoute path="/admin/projects/:id/edit" component={EditProject} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </div>
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}