import Icon from "../../components/Icon";
import { useContext, useState, useEffect } from "react";
import Button from "../../components/Button";
import Search from "../../components/Search";
import { themeContext } from "../../contexts/themeContext";

interface NavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  currentPage?: string;
  onNotificationClick?: () => void;
  onHistoryClick?: () => void;
  onFavoritesClick?: () => void;
  onSecondaryMenuClick?: () => void;
  isLeftSidebarOpen?: boolean;
  isRightSidebarOpen?: boolean;
}

const Navbar = ({ 
  onMenuClick, 
  showMenuButton = true,
  currentPage = "eCommerce",
  onNotificationClick,
  onHistoryClick,
  onFavoritesClick,
  onSecondaryMenuClick
}: NavbarProps = {}) => {
  

  const {theme,setTheme} = useContext(themeContext);
  const [isVerySmall, setIsVerySmall] = useState(false);
  const [rightSidebarIconOnly, setRightSidebarIconOnly] = useState(false);
  const [hideSearchBar, setHideSearchBar] = useState(false);
  const [isSecondaryMenuAnimating, setIsSecondaryMenuAnimating] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsVerySmall(width <= 448); // Updated to match CSS breakpoint
      setRightSidebarIconOnly(width >= 480 && width < 940);
      setHideSearchBar(width < 1400);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleThemeChange = () => {
    theme == "light" ? setTheme("dark") : setTheme("light");
  };

  // Handle secondary menu click with enhanced animation and feedback
  const handleSecondaryMenuClick = () => {
    setIsSecondaryMenuAnimating(true);
    
    // Simulate haptic feedback for better UX (if supported)
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Short vibration for mobile devices
    }
    
    // Add visual feedback with multiple animation phases
    const clickElement = document.querySelector('.secondary-menu') as HTMLElement;
    if (clickElement) {
      // Add immediate visual feedback
      clickElement.style.transform = 'scale(0.95)';
      clickElement.style.transition = 'transform 0.1s ease';
      
      // Restore with bounce after short delay
      setTimeout(() => {
        clickElement.style.transform = '';
        clickElement.style.transition = '';
      }, 100);
    }
    
    // Call the original handler
    if (onSecondaryMenuClick) {
      onSecondaryMenuClick();
    }
    
    // Reset animation after it completes
    setTimeout(() => {
      setIsSecondaryMenuAnimating(false);
    }, 600); // Match animation duration
  };
  
  return (
    <div className={`navbar-wrapper ${rightSidebarIconOnly ? 'right-sidebar-collapsed' : ''} ${hideSearchBar ? 'search-hidden' : ''}`}>
      <div className="left">
        {showMenuButton && (
          <span 
            onClick={onMenuClick}
            className="menu-toggle menu-icon"
            role="button"
            aria-label="Toggle left sidebar"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onMenuClick?.();
              }
            }}
          >
            <Icon type="menu-hamburger-icon" />
          </span>
        )}
        <span className="star-icon" onClick={onFavoritesClick}>
          <Icon type="favorite-star-icon" />{" "}
        </span>
        <div className="breadcrumb-wrapper">
          <Button title="Dashboards" style="lighter" action={() => {}} />
          /
          <Button title={currentPage} action={() => {}} />
        </div>
      </div>
      <div className="right">
        {!hideSearchBar && (
          <Search 
            showTextIcon={!isVerySmall} 
            compact={isVerySmall}
            expanded={rightSidebarIconOnly}
          />
        )}
        <span className="theme-toggle-icon">
          <Icon type="theme-toggle-icon" onClick={handleThemeChange} />
        </span>
        <span className="history-icon" onClick={onHistoryClick}>
          <Icon type="history-clock-icon" />{" "}
        </span>
        <span className="notification-icon" onClick={onNotificationClick}>
          <Icon type="notification-bell-icon" />
        </span>
        <span 
          className={`secondary-menu menu-icon ${isSecondaryMenuAnimating ? 'animating' : ''}`}
          role="button" 
          aria-label="Toggle right sidebar"
          title="Toggle right sidebar"
          tabIndex={0}
          onClick={handleSecondaryMenuClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSecondaryMenuClick();
            }
          }}
          aria-pressed={isSecondaryMenuAnimating}
          data-testid="secondary-menu-button"
        >
          <Icon type="menu-hamburger-icon" />
        </span>
      </div>
    </div>
  );
  
};

export default Navbar;
