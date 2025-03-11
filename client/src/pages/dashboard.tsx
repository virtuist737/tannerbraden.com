import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  PenSquare, Mail, Clock, Layers, FileText, Users, Code, Settings, 
  LayoutDashboard, Bookmark, Palette, MessageSquare, Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { BlogPost, Project, Favorite, Interest } from "@shared/schema";
import { dateFormat } from "@/lib/utils";

const Dashboard = () => {
  // Query relevant data for dashboard
  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });
  
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: interests } = useQuery<Interest[]>({
    queryKey: ["/api/about/interests"],
  });

  const { data: favorites } = useQuery<Favorite[]>({
    queryKey: ["/api/about/favorites"],
  });

  return (
    <div className="py-6 sm:py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 sm:space-y-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter mb-1">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage website content</p>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                <Newspaper className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blogPosts?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <Link href="/admin/blog" className="text-primary hover:underline">
                    Manage Posts
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <Link href="/admin/projects" className="text-primary hover:underline">
                    Manage Projects
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interests</CardTitle>
                <Palette className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{interests?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <Link href="/admin/interests" className="text-primary hover:underline">
                    Manage Interests
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorites</CardTitle>
                <Bookmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{favorites?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <Link href="/admin/favorites" className="text-primary hover:underline">
                    Manage Favorites
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Blog Posts</CardTitle>
              <CardDescription>Recent publications on your site</CardDescription>
            </CardHeader>
            <CardContent>
              {blogPosts && blogPosts.length > 0 ? (
                <div className="space-y-4">
                  {blogPosts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-center gap-4">
                      {post.coverImage && (
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{post.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {dateFormat(post.publishedAt || new Date())}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/admin/blog/${post.id}/edit`}>Edit</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Newspaper className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No blog posts yet</p>
                  <Button className="mt-4" size="sm" asChild>
                    <Link href="/admin/blog/new">Create a post</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Useful shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/blog/new">
                  <PenSquare className="mr-2 h-4 w-4" />
                  New Blog Post
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/projects/new">
                  <Code className="mr-2 h-4 w-4" />
                  New Project
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/interests/new">
                  <Palette className="mr-2 h-4 w-4" />
                  New Interest
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/favorites/new">
                  <Bookmark className="mr-2 h-4 w-4" />
                  New Favorite
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/timeline/new">
                  <Clock className="mr-2 h-4 w-4" />
                  New Timeline Entry
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/newsletter">
                  <Mail className="mr-2 h-4 w-4" />
                  Newsletter Subscribers
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your latest work</CardDescription>
            </CardHeader>
            <CardContent>
              {projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center gap-4">
                      {project.imageUrl && (
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{project.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {project.description?.substring(0, 60)}...
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/admin/projects/${project.id}/edit`}>Edit</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Code className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No projects yet</p>
                  <Button className="mt-4" size="sm" asChild>
                    <Link href="/admin/projects/new">Add a project</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interests & Favorites</CardTitle>
              <CardDescription>Content for the About page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Palette className="h-4 w-4 mr-1" />
                    Interests
                  </h3>
                  {interests && interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {interests.slice(0, 6).map((interest) => (
                        <div key={interest.id} className="px-2 py-1 bg-muted rounded-md text-xs">
                          {interest.title}
                        </div>
                      ))}
                      {interests.length > 6 && (
                        <div className="px-2 py-1 bg-muted rounded-md text-xs">
                          +{interests.length - 6} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No interests added yet</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Bookmark className="h-4 w-4 mr-1" />
                    Favorites
                  </h3>
                  {favorites && favorites.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {favorites.slice(0, 6).map((favorite) => (
                        <div key={favorite.id} className="px-2 py-1 bg-muted rounded-md text-xs">
                          {favorite.title}
                        </div>
                      ))}
                      {favorites.length > 6 && (
                        <div className="px-2 py-1 bg-muted rounded-md text-xs">
                          +{favorites.length - 6} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No favorites added yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;