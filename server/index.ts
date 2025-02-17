import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth";

const app = express();

// Body parsing middleware must come before route handlers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up authentication first
setupAuth(app);

// Handle API routes
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Enhanced request logging middleware with better filtering
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  const method = req.method;

  // Skip logging for static assets and dev files
  if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|ts|tsx|json|woff|woff2|ttf|otf)$/) || 
      path.startsWith('/@') || 
      path.startsWith('/node_modules/') ||
      path.startsWith('/src/')) {
    return next();
  }

  // Only log detailed request info for API endpoints
  if (path.startsWith('/api')) {
    const requestInfo = {
      method,
      path,
      query: Object.keys(req.query).length ? req.query : undefined,
      body: Object.keys(req.body).length ? req.body : undefined,
    };

    // Clean log output for API requests
    console.log(`🌐 API ${new Date().toISOString()} | ${method} ${path}`, 
      Object.keys(requestInfo).length > 2 ? requestInfo : '');
  }

  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const status = res.statusCode;
      const statusEmoji = status >= 400 ? '❌' : '✅';

      // Simplified response logging
      let logLine = `${statusEmoji} ${method} ${path} [${status}] ${duration}ms`;

      // Only show response preview for errors in development
      if (status >= 400 && process.env.NODE_ENV === 'development' && capturedJsonResponse) {
        const responsePreview = JSON.stringify(capturedJsonResponse).slice(0, 100);
        logLine += ` :: ${responsePreview}${responsePreview.length >= 100 ? '...' : ''}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Enhanced global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;

    console.error('❌ Error:', {
      status,
      message,
      stack,
      timestamp: new Date().toISOString()
    });

    if (!res.headersSent) {
      res.status(status).json({ 
        error: message,
        ...(stack ? { stack } : {})
      });
    }
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    log(`🚀 Server started on port ${PORT}`);
  });
})();