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
import Portfolio from "@/pages/portfolio";
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-background">
          <div className="max-w-screen-2xl w-full mx-auto px-6 sm:px-8 lg:px-12">
            <Navbar />
            <main className="flex-grow">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/about">
                  {(params) => <About {...params} />}
                </Route>
                <Route path="/blog">
                  {(params) => <Blog {...params} />}
                </Route>
                <Route path="/blog/:slug">
                  {(params) => <BlogPost {...params} />}
                </Route>
                <Route path="/contact">
                  {(params) => <Contact {...params} />}
                </Route>
                <Route path="/portfolio">
                  {(params) => <Portfolio {...params} />}
                </Route>
                <Route path="/auth">
                  {(params) => <Auth {...params} />}
                </Route>
                <Route path="/dashboard">
                  {(params) => <Dashboard {...params} />}
                </Route>
                <Route path="/admin/interests">
                  {(params) => <AdminInterests {...params} />}
                </Route>
                <Route path="/admin/interests/new">
                  {(params) => <NewInterest {...params} />}
                </Route>
                <Route path="/admin/interests/:id/edit">
                  {(params) => <EditInterest {...params} />}
                </Route>
                <Route path="/admin/blog">
                  {(params) => <AdminBlog {...params} />}
                </Route>
                <Route path="/admin/blog/new">
                  {(params) => <NewBlogPost {...params} />}
                </Route>
                <Route path="/admin/blog/:id/edit">
                  {(params) => <EditBlogPost {...params} />}
                </Route>
                <Route path="/admin/newsletter">
                  {(params) => <AdminNewsletter {...params} />}
                </Route>
                <Route path="/admin/timeline">
                  {(params) => <AdminTimeline {...params} />}
                </Route>
                <Route path="/admin/timeline/new">
                  {(params) => <NewTimelineEntry {...params} />}
                </Route>
                <Route path="/admin/timeline/:id/edit">
                  {(params) => <EditTimelineEntry {...params} />}
                </Route>
                <Route path="/admin/favorites">
                  {(params) => <FavoritesList {...params} />}
                </Route>
                <Route path="/admin/favorites/new">
                  {(params) => <NewFavorite {...params} />}
                </Route>
                <Route path="/admin/favorites/:id/edit">
                  {(params) => <EditFavorite {...params} />}
                </Route>
                <Route>
                  {() => <NotFound />}
                </Route>
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
