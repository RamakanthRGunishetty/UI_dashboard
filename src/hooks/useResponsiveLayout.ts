import { useState, useEffect, useCallback } from 'react';

interface ViewportState {
  width: number;
  height: number;
  isMobile: boolean;
  isVerySmall: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

interface LayoutState {
  sidebarVisible: boolean;
  sidebarCollapsed: boolean;
  isDrawerMode: boolean;
  orderListFullWidth: boolean;
}

export const useWindowSize = () => {
  const [viewport, setViewport] = useState<ViewportState>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const height = typeof window !== 'undefined' ? window.innerHeight : 800;
    
    return {
      width,
      height,
      isMobile: width < 768,
      isVerySmall: width < 440,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewport({
        width,
        height,
        isMobile: width < 768,
        isVerySmall: width < 440,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    // Debounce resize events for performance
    let timeoutId: number;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return viewport;
};

export const useClickAway = (
  ref: React.RefObject<HTMLElement>,
  onClickAway: () => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleClickAway = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickAway();
      }
    };

    document.addEventListener('mousedown', handleClickAway);
    document.addEventListener('touchstart', handleClickAway);

    return () => {
      document.removeEventListener('mousedown', handleClickAway);
      document.removeEventListener('touchstart', handleClickAway);
    };
  }, [ref, onClickAway, enabled]);
};

export const useResponsiveLayout = () => {
  const viewport = useWindowSize();
  const [layoutState, setLayoutState] = useState<LayoutState>({
    sidebarVisible: true,
    sidebarCollapsed: false,
    isDrawerMode: false,
    orderListFullWidth: false,
  });

  // Update layout state based on viewport changes
  useEffect(() => {
    setLayoutState(prevState => {
      if (viewport.isVerySmall) {
        // Very small screens: OrderList takes precedence, sidebar becomes drawer
        return {
          ...prevState,
          sidebarVisible: false, // Hide by default to prevent overlap
          sidebarCollapsed: false,
          isDrawerMode: true,
          orderListFullWidth: true,
        };
      } else if (viewport.isMobile) {
        // Mobile: Sidebar drawer mode
        return {
          ...prevState,
          sidebarVisible: true,
          sidebarCollapsed: false,
          isDrawerMode: true,
          orderListFullWidth: false,
        };
      } else if (viewport.isTablet) {
        // Tablet: Sidebar icon-only mode
        return {
          ...prevState,
          sidebarVisible: true,
          sidebarCollapsed: true,
          isDrawerMode: false,
          orderListFullWidth: false,
        };
      } else {
        // Desktop: Full layout
        return {
          ...prevState,
          sidebarVisible: true,
          sidebarCollapsed: false,
          isDrawerMode: false,
          orderListFullWidth: false,
        };
      }
    });
  }, [viewport]);

  const toggleSidebar = useCallback(() => {
    setLayoutState(prevState => ({
      ...prevState,
      sidebarVisible: !prevState.sidebarVisible,
    }));
  }, []);

  const closeSidebar = useCallback(() => {
    setLayoutState(prevState => ({
      ...prevState,
      sidebarVisible: false,
    }));
  }, []);

  const openSidebar = useCallback(() => {
    setLayoutState(prevState => ({
      ...prevState,
      sidebarVisible: true,
    }));
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && layoutState.sidebarVisible && layoutState.isDrawerMode) {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [layoutState.sidebarVisible, layoutState.isDrawerMode, closeSidebar]);

  return {
    viewport,
    layoutState,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  };
};