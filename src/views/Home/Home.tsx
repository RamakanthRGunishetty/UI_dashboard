import { useContext, useEffect, useState, useCallback } from "react";
import LeftSidebar from "../../containers/LeftSidebar";
import Navbar from "../../containers/Navbar/Navbar";
import RightSidebar from "../../containers/RightSidebar";
import Dashboard from "../Dashboard";
import Orders from "../Orders";
import { navContext } from "../../contexts/navigationContext";

const useResponsiveLayout = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 480 : false,
    isVerySmall: typeof window !== 'undefined' ? window.innerWidth <= 448 : false, // Match navbar breakpoint
  });
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(() => {
    // Left sidebar open by default for all screen sizes except very small mobile
    return typeof window !== 'undefined' ? window.innerWidth > 440 : true;
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMobile = width < 480;
      const isVerySmall = width <= 448; // Match navbar breakpoint
      
      setViewport({ width, isMobile, isVerySmall });
      
      if (width <= 440) {
        // Very small screens - drawer closed by default to save space
        setSidebarCollapsed(false);
        if (!hasInitialized) {
          setIsDrawerOpen(false);
        }
      } else {
        // All screens > 440px - both sidebars open by default
        setSidebarCollapsed(false);
        if (!hasInitialized) {
          setIsDrawerOpen(true); // Left sidebar open by default
        }
      }
      
      setHasInitialized(true);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDrawer = useCallback(() => {
    // Toggle left sidebar expansion/collapse
    setIsDrawerOpen(prev => !prev);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return {
    viewport,
    isDrawerOpen,
    sidebarCollapsed,
    toggleDrawer,
    closeDrawer,
    hasInitialized,
  };
};

const Home = () => {
  const { activeView } = useContext(navContext);
  const [isDashboard, setIsDashboard] = useState<boolean>(false);
  const { viewport, isDrawerOpen, sidebarCollapsed, toggleDrawer, closeDrawer, hasInitialized } = useResponsiveLayout();
  
  // Right sidebar management - open by default for most screen sizes
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(() => {
    // Open by default for all screens except very small mobile
    return typeof window !== 'undefined' ? window.innerWidth > 480 : true;
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  
  // Touch/swipe gesture support for mobile drawer
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  useEffect(() => {
    setIsDashboard(activeView === "dashboard");
  }, [activeView]);

  // Header icon action handlers with proper toggle behavior
  const handleNotificationClick = useCallback(() => {
    // Always toggle right sidebar for notifications, regardless of screen size
    setIsRightSidebarOpen(prev => !prev);
  }, []);

  const handleHistoryClick = useCallback(() => {
    // Toggle history panel - click to open, click again to close
    setShowHistory(prev => !prev);
  }, []);

  const handleFavoritesClick = useCallback(() => {
    // Toggle favorites panel - click to open, click again to close
    setShowFavorites(prev => !prev);
  }, []);

  const handleSecondaryMenuClick = useCallback(() => {
    // Toggle right sidebar just like main menu toggles left sidebar
    setIsRightSidebarOpen(prev => !prev);
  }, []);

  // Handle escape key for mobile drawer and panels
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isDrawerOpen) {
          closeDrawer();
        } else if (showNotifications) {
          setShowNotifications(false);
        } else if (showHistory) {
          setShowHistory(false);
        } else if (showFavorites) {
          setShowFavorites(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isDrawerOpen, closeDrawer, showNotifications, showHistory, showFavorites]);

  // Close panels when switching between mobile and desktop
  useEffect(() => {
    // Close notification toast when switching to desktop (where right sidebar should be used instead)
    if (!viewport.isMobile && showNotifications) {
      setShowNotifications(false);
    }
  }, [viewport.isMobile, showNotifications]);

  // Manage right sidebar state based on screen size changes
  useEffect(() => {
    if (viewport.width <= 480) {
      // Very small mobile: Start closed by default to save space
      if (!hasInitialized) {
        setIsRightSidebarOpen(false);
      }
    } else {
      // All screens > 480px: Right sidebar open by default
      if (!hasInitialized) {
        setIsRightSidebarOpen(true);
      }
    }
  }, [viewport.width, hasInitialized]); // Remove isRightSidebarOpen dependency to prevent toggle conflicts

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    if (viewport.isMobile && isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [viewport.isMobile, isDrawerOpen]);

  // Swipe gesture handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    if (!viewport.isMobile) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!viewport.isMobile) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!viewport.isMobile || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // For very small screens (<440px)
    if (viewport.isVerySmall) {
      // Left swipe to close drawer when it's open
      if (isLeftSwipe && isDrawerOpen) {
        closeDrawer();
      }
      // Right swipe from left edge to open drawer when closed
      else if (isRightSwipe && touchStart < 50 && !isDrawerOpen) {
        toggleDrawer();
      }
    }
    // For mobile screens (440-479px)
    else {
      // Right swipe from left edge to open drawer
      if (isRightSwipe && touchStart < 50 && !isDrawerOpen) {
        toggleDrawer();
      }
      // Left swipe to close drawer when it's open
      else if (isLeftSwipe && isDrawerOpen) {
        closeDrawer();
      }
    }
  };

  const currentPageTitle = isDashboard ? "eCommerce" : "Orders";
  
  // Overlay conditions - clean UI matching Figma design
  const shouldShowDrawerOverlay = (viewport.width > 440 && viewport.width <= 940) && isDrawerOpen; // Only for smaller screens that need focus
  const shouldShowRightSidebarBackdrop = (viewport.width > 440 && viewport.width <= 940) && isRightSidebarOpen; // Same logic as left sidebar
  
  return (
    <main 
      className={`home-wrapper ${viewport.width < 1400 ? 'mobile' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${!isRightSidebarOpen ? 'right-sidebar-collapsed' : ''}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Drawer Overlay - EXCLUDE 941px-1399px range (no blur/overlay needed) */}
      {shouldShowDrawerOverlay && (
        <div
          className="drawer-overlay"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}
      
      {/* Very Small Screen Close Overlay - for ≤440px when left sidebar is open */}
      {viewport.width <= 440 && isDrawerOpen && (
        <div
          className="very-small-overlay left-sidebar-overlay"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}
      
      {/* Very Small Screen Close Overlay - for ≤440px when right sidebar is open */}
      {viewport.width <= 440 && isRightSidebarOpen && (
        <div
          className="very-small-overlay right-sidebar-overlay"
          onClick={() => setIsRightSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      


      {/* Sidebar */}
      <aside
        className={`sidebar-container ${
          isDrawerOpen ? 'drawer-open' : 'drawer-closed'
        }`}
        aria-hidden={!isDrawerOpen}
      >
        <LeftSidebar 
          collapsed={false}
          onItemClick={closeDrawer}
        />
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        <Navbar 
          onMenuClick={toggleDrawer} // Always functional for left sidebar control
          showMenuButton={true} // Always show menu button in header
          currentPage={currentPageTitle}
          onNotificationClick={handleNotificationClick}
          onHistoryClick={handleHistoryClick}
          onFavoritesClick={handleFavoritesClick}
          onSecondaryMenuClick={handleSecondaryMenuClick}
          isLeftSidebarOpen={isDrawerOpen}
          isRightSidebarOpen={isRightSidebarOpen}
        />
        {isDashboard ? <Dashboard pageTitle={currentPageTitle} /> : <Orders />}
      </div>

      {/* Right Sidebar - Now responsive for all screen sizes */}
      <RightSidebar isOpen={isRightSidebarOpen} onClose={() => setIsRightSidebarOpen(false)} />
      
      {/* Mobile backdrop overlay when right sidebar is open - EXCLUDE 941px-1399px range */}
      {shouldShowRightSidebarBackdrop && (
        <div 
          className="mobile-sidebar-backdrop right-sidebar-backdrop" 
          onClick={() => setIsRightSidebarOpen(false)}
          aria-label="Close right sidebar"
        />
      )}

      {/* Notification Overlays and Toasts */}
      {showNotifications && (
        <div className="panel-overlay" onClick={() => setShowNotifications(false)}>
          <div className="notification-toast" onClick={(e) => e.stopPropagation()}>
            <div className="toast-content">
              <div className="panel-header">
                <h4>📢 Notifications</h4>
                <button className="close-btn" onClick={() => setShowNotifications(false)} aria-label="Close notifications">×</button>
              </div>
              <p>• New order #12345 received</p>
              <p>• Payment processed successfully</p>
              <p>• 3 new messages from customers</p>
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="panel-overlay" onClick={() => setShowHistory(false)}>
          <div className="history-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-content">
              <div className="panel-header">
                <h4>🕐 Recent Activity</h4>
                <button className="close-btn" onClick={() => setShowHistory(false)} aria-label="Close history">×</button>
              </div>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="time">2 min ago</span>
                  <span className="action">Order #12345 updated</span>
                </div>
                <div className="activity-item">
                  <span className="time">5 min ago</span>
                  <span className="action">Dashboard refreshed</span>
                </div>
                <div className="activity-item">
                  <span className="time">10 min ago</span>
                  <span className="action">User logged in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFavorites && (
        <div className="panel-overlay" onClick={() => setShowFavorites(false)}>
          <div className="favorites-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-content">
              <div className="panel-header">
                <h4>⭐ Quick Access</h4>
                <button className="close-btn" onClick={() => setShowFavorites(false)} aria-label="Close favorites">×</button>
              </div>
              <div className="favorites-list">
                <div className="favorite-item">📊 Sales Dashboard</div>
                <div className="favorite-item">📦 Product Inventory</div>
                <div className="favorite-item">👥 Customer List</div>
                <div className="favorite-item">📈 Analytics</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
  
};

export default Home;
