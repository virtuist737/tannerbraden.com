import { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
  subtitle?: string;
}

export function PageTitle({ children, subtitle }: PageTitleProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight">{children}</h1>
      {subtitle && (
        <p className="text-muted-foreground mt-2">{subtitle}</p>
      )}
    </div>
  );
}