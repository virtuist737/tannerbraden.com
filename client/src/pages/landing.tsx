import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Palette, Code, Play } from "lucide-react";

export default function Landing() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Creative Studio</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Explore innovative digital audio production and creative projects
        </p>
        <Button 
          size="lg"
          onClick={() => window.location.href = "/api/login"}
        >
          Sign In to Continue
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <Music className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Music Creation</CardTitle>
            <CardDescription>
              Innovative audio synthesis and production tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Access powerful music creation tools and explore sound design capabilities.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Code className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Creative Projects</CardTitle>
            <CardDescription>
              Explore portfolio of digital creations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Discover innovative projects spanning web development, audio design, and more.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Palette className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Interactive Design</CardTitle>
            <CardDescription>
              User-friendly interfaces and experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Experience modern web technologies and responsive design patterns.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Ready to explore? Sign in to access the full experience.
        </p>
        <Button 
          variant="outline"
          onClick={() => window.location.href = "/api/login"}
        >
          <Play className="h-4 w-4 mr-2" />
          Get Started
        </Button>
      </div>
    </div>
  );
}