// Premium Accessibility Enhancement Hook
import { useEffect, useRef, useCallback, useState } from 'react';

export const useAccessibility = (options = {}) => {
  const {
    announceChanges = true,
    keyboardNavigation = true,
    focusManagement = true,
    colorContrast = true
  } = options;

  // Screen reader announcements
  const announceToScreenReader = useCallback((message, priority = 'polite') => {
    if (!announceChanges) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [announceChanges]);

  // Focus management
  const manageFocus = useCallback(() => {
    if (!focusManagement) return {};

    const focusableElements = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])'
    ];

    const getFocusableElements = (container = document) => {
      return container.querySelectorAll(focusableElements.join(','));
    };

    const trapFocus = (container) => {
      const focusable = getFocusableElements(container);
      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];

      const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      };

      container.addEventListener('keydown', handleTabKey);

      return () => {
        container.removeEventListener('keydown', handleTabKey);
      };
    };

    const restoreFocus = (element) => {
      if (element && typeof element.focus === 'function') {
        element.focus();
      }
    };

    return { getFocusableElements, trapFocus, restoreFocus };
  }, [focusManagement]);

  // Keyboard navigation helpers
  const useKeyboardNavigation = useCallback((handlers = {}) => {
    if (!keyboardNavigation) return () => {};

    const handleKeyDown = (e) => {
      const { key, ctrlKey, altKey, shiftKey, metaKey } = e;
      
      // Standard keyboard shortcuts
      const shortcuts = {
        'Escape': handlers.onEscape,
        'Enter': handlers.onEnter,
        'Space': handlers.onSpace,
        'ArrowUp': handlers.onArrowUp,
        'ArrowDown': handlers.onArrowDown,
        'ArrowLeft': handlers.onArrowLeft,
        'ArrowRight': handlers.onArrowRight,
        'Home': handlers.onHome,
        'End': handlers.onEnd,
        'Tab': handlers.onTab,
      };

      // Modifier key combinations
      if (ctrlKey || metaKey) {
        shortcuts[`Ctrl+${key}`] = handlers[`onCtrl${key}`];
      }
      if (altKey) {
        shortcuts[`Alt+${key}`] = handlers[`onAlt${key}`];
      }
      if (shiftKey) {
        shortcuts[`Shift+${key}`] = handlers[`onShift${key}`];
      }

      const handler = shortcuts[key] || shortcuts[`${ctrlKey || metaKey ? 'Ctrl+' : ''}${altKey ? 'Alt+' : ''}${shiftKey ? 'Shift+' : ''}${key}`];
      
      if (handler) {
        handler(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyboardNavigation]);

  // Color contrast checking
  const checkColorContrast = useCallback(() => {
    if (!colorContrast) return;

    // This is a simplified contrast checker
    // In production, you'd use a proper color contrast library
    const getContrastRatio = (color1, color2) => {
      // Simplified calculation - implement proper WCAG contrast ratio calculation
      return 4.5; // Placeholder
    };

    const checkElement = (element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      if (color && backgroundColor) {
        const ratio = getContrastRatio(color, backgroundColor);
        if (ratio < 4.5) {
          console.warn('Low contrast detected:', { element, color, backgroundColor, ratio });
        }
      }
    };

    // Check all text elements
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, button, a, label');
    textElements.forEach(checkElement);
  }, [colorContrast]);

  // ARIA helpers
  const useAriaProps = useCallback(() => {
    const createAriaProps = (type, props = {}) => {
      const ariaMap = {
        button: {
          role: 'button',
          tabIndex: 0,
          ...props
        },
        dialog: {
          role: 'dialog',
          'aria-modal': 'true',
          tabIndex: -1,
          ...props
        },
        menu: {
          role: 'menu',
          ...props
        },
        menuitem: {
          role: 'menuitem',
          tabIndex: -1,
          ...props
        },
        tab: {
          role: 'tab',
          tabIndex: -1,
          ...props
        },
        tabpanel: {
          role: 'tabpanel',
          tabIndex: 0,
          ...props
        },
        alert: {
          role: 'alert',
          'aria-live': 'assertive',
          ...props
        },
        status: {
          role: 'status',
          'aria-live': 'polite',
          ...props
        }
      };

      return ariaMap[type] || props;
    };

    return { createAriaProps };
  }, []);

  // High contrast mode detection
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const checkHighContrast = () => {
      // Check for forced colors (Windows High Contrast)
      const hasMediaQuery = window.matchMedia('(forced-colors: active)');
      setIsHighContrast(hasMediaQuery.matches);
    };

    checkHighContrast();

    // Listen for changes
    const mediaQuery = window.matchMedia('(forced-colors: active)');
    mediaQuery.addListener(checkHighContrast);

    return () => {
      mediaQuery.removeListener(checkHighContrast);
    };
  }, []);

  // Reduced motion detection
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkReducedMotion = () => {
      const hasMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(hasMediaQuery.matches);
    };

    checkReducedMotion();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addListener(checkReducedMotion);

    return () => {
      mediaQuery.removeListener(checkReducedMotion);
    };
  }, []);

  return {
    announceToScreenReader,
    manageFocus: manageFocus(),
    useKeyboardNavigation,
    checkColorContrast,
    useAriaProps: useAriaProps(),
    isHighContrast,
    prefersReducedMotion
  };
};

// Hook for managing skip links
export const useSkipLinks = () => {
  useEffect(() => {
    // Add skip link if it doesn't exist
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link btn-premium btn-premium--primary sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-tooltip';
      skipLink.textContent = 'Skip to main content';
      
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Add main content landmark if it doesn't exist
    const mainContent = document.querySelector('#main-content') || document.querySelector('main');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }
  }, []);
};

// Hook for managing live regions
export const useLiveRegion = () => {
  const liveRegionRef = useRef();

  useEffect(() => {
    // Create live region if it doesn't exist
    if (!liveRegionRef.current) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.id = 'live-region';
      
      document.body.appendChild(liveRegion);
      liveRegionRef.current = liveRegion;
    }

    return () => {
      if (liveRegionRef.current && liveRegionRef.current.parentNode) {
        liveRegionRef.current.parentNode.removeChild(liveRegionRef.current);
      }
    };
  }, []);

  const announce = useCallback((message, priority = 'polite') => {
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute('aria-live', priority);
      liveRegionRef.current.textContent = message;
      
      // Clear after a delay
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announce };
};

export default useAccessibility;