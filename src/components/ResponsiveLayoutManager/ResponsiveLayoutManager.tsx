import React, { useRef, ReactNode } from 'react';
import { useResponsiveLayout, useClickAway } from '../../hooks/useResponsiveLayout';
import './ResponsiveLayoutManager.scss';

interface ResponsiveLayoutManagerProps {
  sidebar: ReactNode;
  orderList: ReactNode;
  navbar?: ReactNode;
  rightSidebar?: ReactNode;
  className?: string;
}

/**
 * ResponsiveLayoutManager handles the layout between Sidebar and OrderList
 * preventing overlaps on very small screens (<440px) by implementing
 * mobile-first responsive logic with proper accessibility.
 */
const ResponsiveLayoutManager: React.FC<ResponsiveLayoutManagerProps> = ({
  sidebar,
  orderList,
  navbar,
  rightSidebar,
  className = '',
}) => {
  const { viewport, layoutState, toggleSidebar, closeSidebar } = useResponsiveLayout();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Close sidebar when clicking outside on mobile
  useClickAway(sidebarRef, closeSidebar, layoutState.isDrawerMode && layoutState.sidebarVisible);

  const getLayoutClasses = () => {
    const classes = ['responsive-layout'];
    
    if (viewport.isVerySmall) classes.push('very-small');
    else if (viewport.isMobile) classes.push('mobile');
    else if (viewport.isTablet) classes.push('tablet');
    else classes.push('desktop');
    
    if (layoutState.sidebarCollapsed) classes.push('sidebar-collapsed');
    if (layoutState.isDrawerMode) classes.push('drawer-mode');
    if (layoutState.orderListFullWidth) classes.push('orderlist-fullwidth');
    if (layoutState.sidebarVisible) classes.push('sidebar-visible');
    
    if (className) classes.push(className);
    
    return classes.join(' ');
  };

  return (
    <div className={getLayoutClasses()}>
      {/* Mobile Hamburger Button - Only visible on very small screens when sidebar is hidden */}
      {viewport.isVerySmall && !layoutState.sidebarVisible && (
        <button
          className="mobile-hamburger"
          onClick={toggleSidebar}
          aria-label="Open navigation menu"
          aria-expanded="false"
          type="button"
        >
          <span className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      )}

      {/* Drawer Overlay - Only on mobile when sidebar is visible */}
      {layoutState.isDrawerMode && layoutState.sidebarVisible && (
        <div
          className="drawer-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
          role="presentation"
        />
      )}

      {/* Sidebar Container */}
      <aside
        ref={sidebarRef}
        className={`sidebar-container ${layoutState.sidebarVisible ? 'visible' : 'hidden'}`}
        aria-hidden={layoutState.isDrawerMode && !layoutState.sidebarVisible}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Close button for mobile drawer */}
        {layoutState.isDrawerMode && layoutState.sidebarVisible && (
          <button
            className="drawer-close"
            onClick={closeSidebar}
            aria-label="Close navigation menu"
            type="button"
          >
            <span className="close-icon">×</span>
          </button>
        )}
        {sidebar}
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Navbar */}
        {navbar && (
          <header className="navbar-container" role="banner">
            {navbar}
          </header>
        )}

        {/* OrderList Container - Takes full width on very small screens */}
        <main
          className="orderlist-container"
          role="main"
          aria-label="Order list"
        >
          {orderList}
        </main>
      </div>

      {/* Right Sidebar - Hidden on mobile */}
      {rightSidebar && !viewport.isMobile && (
        <aside
          className="right-sidebar-container"
          role="complementary"
          aria-label="Secondary navigation"
        >
          {rightSidebar}
        </aside>
      )}
    </div>
  );
};

export default ResponsiveLayoutManager;