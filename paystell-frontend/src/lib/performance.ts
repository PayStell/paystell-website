// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure Core Web Vitals
  measureCoreWebVitals() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.set('LCP', lastEntry.startTime);
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.metrics.set('FID', entry.processingStart - entry.startTime);
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.set('CLS', clsValue);
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Measure component load time
  measureComponentLoad(componentName: string, startTime: number) {
    const loadTime = performance.now() - startTime;
    this.metrics.set(`${componentName}_load_time`, loadTime);
    console.log(`${componentName} load time:`, loadTime);
    return loadTime;
  }

  // Get all metrics
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // Report metrics to analytics
  reportMetrics() {
    const metrics = this.getMetrics();
    // Send to your analytics service
    console.log('Performance Metrics:', metrics);
    return metrics;
  }
}

// Hook for measuring component performance
export function usePerformanceMonitor(componentName: string) {
  const startTime = performance.now();
  
  return {
    endMeasurement: () => {
      PerformanceMonitor.getInstance().measureComponentLoad(componentName, startTime);
    }
  };
}

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  if (typeof window !== 'undefined') {
    const monitor = PerformanceMonitor.getInstance();
    monitor.measureCoreWebVitals();
  }
}
