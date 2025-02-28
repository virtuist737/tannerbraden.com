import { apiRequest } from "./queryClient";

/**
 * Tracks page views and user engagement metrics
 */
class AnalyticsTracker {
  private startTime: number = 0;
  private isTracking: boolean = false;
  private maxScrollDepth: number = 0;
  private sessionId: string = '';
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private exitTracking: boolean = false;

  constructor() {
    // Generate a session ID if one doesn't exist
    this.sessionId = this.getOrCreateSessionId();
    this.setupScrollTracking();
    this.setupExitTracking();
  }

  /**
   * Initialize page view tracking for the current page
   */
  public trackPageView(path: string = window.location.pathname): void {
    if (this.isTracking) {
      this.endTracking();
    }
    
    this.startTime = Date.now();
    this.maxScrollDepth = 0;
    this.isTracking = true;
    
    // Record the initial page view
    this.recordPageView(path, 0);
  }

  /**
   * End tracking for the current page
   */
  public endTracking(): void {
    if (!this.isTracking) return;
    
    const duration = Math.round((Date.now() - this.startTime) / 1000);
    
    // Avoid tracking very short accidental page views
    if (duration >= 2) {
      this.updatePageMetrics(duration);
    }
    
    this.isTracking = false;
  }

  /**
   * Record a page view to the server
   */
  private async recordPageView(path: string, scrollDepth: number): Promise<void> {
    try {
      await apiRequest(`/api/analytics/pageview`, {
        method: 'POST',
        body: JSON.stringify({
          path,
          scrollDepth,
          sessionId: this.sessionId
        }),
      });
    } catch (error) {
      console.error('Failed to record page view:', error);
    }
  }

  /**
   * Update page metrics with duration and scroll depth
   */
  private async updatePageMetrics(duration: number): Promise<void> {
    try {
      await apiRequest(`/api/analytics/pageview/update`, {
        method: 'POST',
        body: JSON.stringify({
          duration,
          scrollDepth: this.maxScrollDepth,
          sessionId: this.sessionId,
          isExit: this.exitTracking
        }),
      });
    } catch (error) {
      console.error('Failed to update page metrics:', error);
    }
  }

  /**
   * Set up scroll depth tracking
   */
  private setupScrollTracking(): void {
    const handleScroll = () => {
      if (!this.isTracking) return;
      
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      
      // Calculate scroll percentage
      const scrollPercentage = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100);
      
      // Update max scroll depth if the current scroll is deeper
      this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollPercentage);
      
      // Debounce updates to avoid too many API calls
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      
      this.debounceTimer = setTimeout(() => {
        // Only update if significant scroll
        if (this.maxScrollDepth > 10) {
          this.updatePageMetrics(Math.round((Date.now() - this.startTime) / 1000));
        }
      }, 2000);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Set up exit tracking
   */
  private setupExitTracking(): void {
    const handleBeforeUnload = () => {
      this.exitTracking = true;
      this.endTracking();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
  }

  /**
   * Get or create a session ID for the current user
   */
  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('analytics_session_id');
    
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('analytics_session_id', sessionId);
      
      // Set session expiration (24 hours)
      const expiration = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('analytics_session_expiration', expiration.toString());
    } else {
      const expiration = Number(localStorage.getItem('analytics_session_expiration') || '0');
      
      // If session expired, create a new one
      if (Date.now() > expiration) {
        sessionId = this.generateSessionId();
        localStorage.setItem('analytics_session_id', sessionId);
        
        const newExpiration = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('analytics_session_expiration', newExpiration.toString());
      }
    }
    
    return sessionId;
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Create singleton instance
const analytics = new AnalyticsTracker();

/**
 * Hook to track page views - can be used in React components
 */
export function trackPageView(path?: string): void {
  // Wait a bit to ensure page is ready
  setTimeout(() => {
    analytics.trackPageView(path);
  }, 100);
}

/**
 * Clean up analytics tracking when component unmounts
 */
export function endPageTracking(): void {
  analytics.endTracking();
}

// Automatically track page views on all page navigations
if (typeof window !== 'undefined') {
  // Track initial page load
  trackPageView();
  
  // Create MutationObserver to detect SPA navigations via URL changes
  let lastPath = window.location.pathname;
  
  setInterval(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      trackPageView(currentPath);
    }
  }, 300);
}

export default analytics;