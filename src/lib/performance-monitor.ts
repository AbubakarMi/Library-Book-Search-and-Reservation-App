/**
 * Performance monitoring utilities for Adustech Library
 */

interface PerformanceMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  loadTime?: number;
  renderTime?: number;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.measureLoadTime();
    }
  }

  private initializeObservers() {
    // Observe paint metrics (FCP, LCP)
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.FCP = entry.startTime;
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);

        // Observe LCP
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.LCP = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);

        // Observe FID
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.metrics.FID = (entry as any).processingStart - entry.startTime;
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);

        // Observe CLS
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.metrics.CLS = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);

      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }
  }

  private measureLoadTime() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        this.metrics.TTFB = navigation.responseStart - navigation.requestStart;
      });
    }
  }

  // Measure component render time
  measureRenderTime(componentName: string, startTime: number) {
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);

    // Store in metrics
    if (!this.metrics.renderTime) {
      this.metrics.renderTime = renderTime;
    }

    return renderTime;
  }

  // Measure memory usage
  measureMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize;

      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };
    }
    return null;
  }

  // Get all metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Log performance summary
  logPerformanceSummary() {
    const metrics = this.getMetrics();
    const memory = this.measureMemoryUsage();

    console.group('🚀 Adustech Library Performance Metrics');

    if (metrics.FCP) {
      console.log(`⚡ First Contentful Paint: ${metrics.FCP.toFixed(2)}ms`);
    }

    if (metrics.LCP) {
      console.log(`🎨 Largest Contentful Paint: ${metrics.LCP.toFixed(2)}ms`);
    }

    if (metrics.FID) {
      console.log(`👆 First Input Delay: ${metrics.FID.toFixed(2)}ms`);
    }

    if (metrics.CLS) {
      console.log(`📐 Cumulative Layout Shift: ${metrics.CLS.toFixed(4)}`);
    }

    if (metrics.TTFB) {
      console.log(`🌐 Time to First Byte: ${metrics.TTFB.toFixed(2)}ms`);
    }

    if (metrics.loadTime) {
      console.log(`📦 Load Time: ${metrics.loadTime.toFixed(2)}ms`);
    }

    if (memory) {
      console.log(`🧠 Memory Usage: ${(memory.used / 1024 / 1024).toFixed(2)}MB (${memory.percentage.toFixed(1)}%)`);
    }

    console.groupEnd();

    // Performance scoring
    this.scorePerformance(metrics);
  }

  private scorePerformance(metrics: PerformanceMetrics) {
    let score = 100;
    const issues: string[] = [];

    // FCP scoring (good: <1.8s, needs improvement: 1.8s-3s, poor: >3s)
    if (metrics.FCP) {
      if (metrics.FCP > 3000) {
        score -= 20;
        issues.push('First Contentful Paint is too slow');
      } else if (metrics.FCP > 1800) {
        score -= 10;
        issues.push('First Contentful Paint could be faster');
      }
    }

    // LCP scoring (good: <2.5s, needs improvement: 2.5s-4s, poor: >4s)
    if (metrics.LCP) {
      if (metrics.LCP > 4000) {
        score -= 25;
        issues.push('Largest Contentful Paint is too slow');
      } else if (metrics.LCP > 2500) {
        score -= 15;
        issues.push('Largest Contentful Paint could be faster');
      }
    }

    // FID scoring (good: <100ms, needs improvement: 100ms-300ms, poor: >300ms)
    if (metrics.FID) {
      if (metrics.FID > 300) {
        score -= 20;
        issues.push('First Input Delay is too high');
      } else if (metrics.FID > 100) {
        score -= 10;
        issues.push('First Input Delay could be lower');
      }
    }

    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (metrics.CLS) {
      if (metrics.CLS > 0.25) {
        score -= 20;
        issues.push('Cumulative Layout Shift is too high');
      } else if (metrics.CLS > 0.1) {
        score -= 10;
        issues.push('Cumulative Layout Shift could be lower');
      }
    }

    // Log score and recommendations
    const getScoreColor = (score: number) => {
      if (score >= 90) return '🟢';
      if (score >= 70) return '🟡';
      return '🔴';
    };

    console.log(`${getScoreColor(score)} Performance Score: ${score}/100`);

    if (issues.length > 0) {
      console.group('⚠️ Performance Issues');
      issues.forEach(issue => console.log(`• ${issue}`));
      console.groupEnd();
    }
  }

  // Cleanup observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Lazy singleton instance
let performanceMonitorInstance: PerformanceMonitor | null = null;

export const performanceMonitor = {
  getInstance(): PerformanceMonitor {
    if (!performanceMonitorInstance && typeof window !== 'undefined') {
      performanceMonitorInstance = new PerformanceMonitor();
    }
    return performanceMonitorInstance || ({} as PerformanceMonitor);
  },

  // Proxy methods for easier access
  measureRenderTime: (componentName: string, startTime: number) =>
    performanceMonitor.getInstance().measureRenderTime?.(componentName, startTime),
  getMetrics: () => performanceMonitor.getInstance().getMetrics?.() || {},
  measureMemoryUsage: () => performanceMonitor.getInstance().measureMemoryUsage?.(),
  logPerformanceSummary: () => performanceMonitor.getInstance().logPerformanceSummary?.(),
  disconnect: () => performanceMonitor.getInstance().disconnect?.()
};

// React Hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const startTime = typeof window !== 'undefined' ? performance.now() : 0;

  return {
    measureRender: () => performanceMonitor.measureRenderTime(componentName, startTime),
    getMetrics: () => performanceMonitor.getMetrics(),
    measureMemory: () => performanceMonitor.measureMemoryUsage(),
  };
}

// Higher-order component for performance monitoring
export function withPerformanceMonitoring<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string
) {
  return function PerformanceMonitoredComponent(props: T) {
    const { measureRender } = usePerformanceMonitor(componentName);

    React.useEffect(() => {
      measureRender();
    });

    return React.createElement(WrappedComponent, props);
  };
}

// Performance debugging utilities
export const performanceDebug = {
  // Log all performance entries
  logAllEntries() {
    if (typeof window !== 'undefined') {
      const entries = performance.getEntries();
      console.table(entries);
    }
  },

  // Log resource timing
  logResourceTiming() {
    if (typeof window !== 'undefined') {
      const resources = performance.getEntriesByType('resource');
      console.group('📁 Resource Loading Times');
      resources.forEach((resource: PerformanceResourceTiming) => {
        console.log(`${resource.name}: ${(resource.responseEnd - resource.startTime).toFixed(2)}ms`);
      });
      console.groupEnd();
    }
  },

  // Clear performance data
  clearData() {
    if (typeof window !== 'undefined') {
      performance.clearMarks();
      performance.clearMeasures();
      performance.clearResourceTimings();
    }
  },

  // Mark performance points
  mark(name: string) {
    if (typeof window !== 'undefined') {
      performance.mark(name);
    }
  },

  // Measure between marks
  measure(name: string, startMark: string, endMark: string) {
    if (typeof window !== 'undefined') {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      console.log(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`);
    }
  }
};

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).performanceMonitor = performanceMonitor.getInstance();
  (window as any).performanceDebug = performanceDebug;
}