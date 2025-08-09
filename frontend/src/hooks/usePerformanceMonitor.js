// Premium Performance Monitoring Hook
import { useEffect, useRef, useCallback } from 'react';

export const usePerformanceMonitor = (componentName = 'Unknown') => {
  const mountTimeRef = useRef(null);
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(null);

  // Performance metrics tracking
  useEffect(() => {
    mountTimeRef.current = performance.now();
    
    // Track component mount time
    const mountTime = performance.now() - mountTimeRef.current;
    if (mountTime > 100) { // Warn if mount takes longer than 100ms
      console.warn(`Slow component mount detected: ${componentName} took ${mountTime.toFixed(2)}ms`);
    }

    return () => {
      // Track component unmount and total lifecycle
      const totalTime = performance.now() - mountTimeRef.current;
      console.log(`Component ${componentName} lifecycle: ${totalTime.toFixed(2)}ms, renders: ${renderCountRef.current}`);
    };
  }, [componentName]);

  // Track render performance
  useEffect(() => {
    renderCountRef.current += 1;
    const renderTime = performance.now();
    
    if (lastRenderTimeRef.current) {
      const timeSinceLastRender = renderTime - lastRenderTimeRef.current;
      if (timeSinceLastRender < 16.67) { // 60fps = 16.67ms per frame
        // Optimal render timing
      } else if (timeSinceLastRender > 33.33) { // 30fps = 33.33ms per frame
        console.warn(`Slow render detected: ${componentName} took ${timeSinceLastRender.toFixed(2)}ms`);
      }
    }
    
    lastRenderTimeRef.current = renderTime;
  });

  // Memory leak detection for event listeners
  const trackEventListener = useCallback((element, event, handler, options) => {
    if (!element) return () => {};

    element.addEventListener(event, handler, options);
    
    return () => {
      element.removeEventListener(event, handler, options);
    };
  }, []);

  // Debounced callback for expensive operations
  const createDebouncedCallback = useCallback((callback, delay = 300) => {
    let timeoutId;
    
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), delay);
    };
  }, []);

  // Throttled callback for frequently called operations
  const createThrottledCallback = useCallback((callback, limit = 100) => {
    let inThrottle;
    
    return (...args) => {
      if (!inThrottle) {
        callback(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // Intersection observer for lazy loading
  const createIntersectionObserver = useCallback((callback, options = {}) => {
    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry);
        }
      });
    }, defaultOptions);

    return {
      observe: (element) => {
        if (element) observer.observe(element);
      },
      unobserve: (element) => {
        if (element) observer.unobserve(element);
      },
      disconnect: () => observer.disconnect()
    };
  }, []);

  // Measure component render time
  const measureRenderTime = useCallback((callback) => {
    const startTime = performance.now();
    const result = callback();
    const endTime = performance.now();
    
    const renderTime = endTime - startTime;
    if (renderTime > 16) { // Longer than one frame at 60fps
      console.warn(`Expensive render in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
    
    return result;
  }, [componentName]);

  // Bundle size impact tracking
  const trackBundleImpact = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      const navigationEntry = performance.getEntriesByType('navigation')[0];
      if (navigationEntry) {
        console.log(`Bundle load performance for ${componentName}:`, {
          domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
          loadComplete: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
          totalLoad: navigationEntry.loadEventEnd - navigationEntry.fetchStart
        });
      }
    }
  }, [componentName]);

  return {
    trackEventListener,
    createDebouncedCallback,
    createThrottledCallback,
    createIntersectionObserver,
    measureRenderTime,
    trackBundleImpact,
    renderCount: renderCountRef.current
  };
};

// Hook for monitoring API performance
export const useAPIPerformanceMonitor = () => {
  const trackAPICall = useCallback(async (apiCall, apiName = 'Unknown API') => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Log performance metrics
      console.log(`API Call ${apiName}: ${duration.toFixed(2)}ms`);
      
      // Warn for slow API calls
      if (duration > 1000) { // 1 second
        console.warn(`Slow API call detected: ${apiName} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.error(`API Call ${apiName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }, []);

  return { trackAPICall };
};

// Hook for monitoring scroll performance
export const useScrollPerformance = () => {
  const scrollHandlerRef = useRef(null);
  
  const createOptimizedScrollHandler = useCallback((callback, options = {}) => {
    const { throttle = 16, passive = true } = options; // 60fps default
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          callback();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    scrollHandlerRef.current = handleScroll;
    
    return {
      addEventListener: (element = window) => {
        element.addEventListener('scroll', handleScroll, { passive });
      },
      removeEventListener: (element = window) => {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  return { createOptimizedScrollHandler };
};

// Hook for monitoring memory usage
export const useMemoryMonitor = (componentName) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const checkMemory = () => {
        const memory = performance.memory;
        const memoryInfo = {
          used: Math.round(memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
        };
        
        console.log(`Memory usage for ${componentName}:`, memoryInfo);
        
        // Warn if memory usage is high
        if (memoryInfo.used > memoryInfo.limit * 0.9) {
          console.warn(`High memory usage detected in ${componentName}: ${memoryInfo.used}MB`);
        }
      };
      
      const interval = setInterval(checkMemory, 5000); // Check every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [componentName]);
};

export default usePerformanceMonitor;