
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { Redirect, Route, useLocation } from "wouter";
import { ReactNode, useEffect } from "react";

type ProtectedRouteProps = {
  path?: string;
  component?: () => React.JSX.Element | null;
  children?: ReactNode;
};

export function ProtectedRoute({
  path,
  component: Component,
  children,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  // Auto-redirect to auth flow for dashboard access
  useEffect(() => {
    if (!isLoading && !user && (location === "/dashboard" || location.startsWith("/admin/"))) {
      window.location.href = "/api/login";
    }
  }, [user, isLoading, location]);

  // If used as a wrapper component
  if (!path || !Component) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      );
    }

    if (!user) {
      return null; // Will redirect via useEffect
    }

    return <>{children}</>;
  }

  // If used as a route component
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        {(() => {
          // useEffect will handle the redirect
          return null;
        })()}
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
