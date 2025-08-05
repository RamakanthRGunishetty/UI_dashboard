import { useContext, useState, useEffect } from "react";
import Button from "../../components/Button";
import StatusBadge from "../../components/StatusBadge";
import Menu from "../Menu";
import UserProfile from "../../components/UserProfile";
import { navContext } from "../../contexts/navigationContext";
import {MenuItem} from "../../types/MenuTypes";

interface LeftSidebarProps {
  collapsed?: boolean;
  onItemClick?: () => void;
}

const useResponsiveSidebar = (collapsed?: boolean) => {
  const [sidebarSettings, setSidebarSettings] = useState({
    width: 280,
    showText: true,
    showHeader: true,
    showButtons: true,
    compactMode: false,
    iconOnlyMode: false,
    isExpanded: false,
    isHidden: false
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateSettings = () => {
      const width = window.innerWidth;
      
      if (collapsed) {
        // Collapsed state
        setSidebarSettings(prev => ({
          ...prev,
          width: 64,
          showText: false,
          showHeader: false,
          showButtons: false,
          compactMode: false,
          iconOnlyMode: true
        }));
      } else if (width < 480) {
        // Mobile - full width drawer
        setSidebarSettings(prev => ({
          ...prev,
          width: 280,
          showText: true,
          showHeader: true,
          showButtons: true,
          compactMode: false,
          iconOnlyMode: false
        }));
        setIsExpanded(false);
      } else if (width >= 480 && width < 1400) {
        // Medium screens (480px-1399px) - drawer mode like mobile
        setSidebarSettings(prev => ({
          ...prev,
          width: 280,
          showText: true,
          showHeader: true,
          showButtons: true,
          compactMode: false,
          iconOnlyMode: false,
          isHidden: false
        }));
        setIsExpanded(false);
      } else {
        // Large Desktop (≥1400px) - full sidebar
        setSidebarSettings(prev => ({
          ...prev,
          width: 280,
          showText: true,
          showHeader: true,
          showButtons: true,
          compactMode: false,
          iconOnlyMode: false,
          isHidden: false
        }));
        setIsExpanded(false);
      }
    };

    updateSettings();
    window.addEventListener('resize', updateSettings);
    return () => window.removeEventListener('resize', updateSettings);
  }, [collapsed, isExpanded]);

  const toggleExpanded = () => {
    const width = window.innerWidth;
    if (width >= 480 && width < 1400) {
      // In hidden range, toggle expanded state for drawer mode
      setIsExpanded(prev => !prev);
    }
  };

  return { ...sidebarSettings, isExpanded, toggleExpanded };
};

const LeftSidebar = ({ collapsed = false, onItemClick }: LeftSidebarProps = {}) => {
  const { setActiveView, setActiveMenuItem, setActiveSubMenuItem } = useContext(navContext);
  const { isExpanded, toggleExpanded, ...sidebarSettings } = useResponsiveSidebar(collapsed);



  const menu:MenuItem[] = [
    {
      subHeaderLabel: "Dashboard",
      list: [
        {
          listLabel: "Default",
          icon: "dashboard-chart-icon",
          id: "default",
          subList: [
            {
              subListLabel: "e-commerce",
              id: "e-commerce",
              action: () => {
                setActiveView("dashboard");
                setActiveMenuItem("default");
                setActiveSubMenuItem("e-commerce");
              },
            },
            {
              subListLabel: "order list",
              id: "order-list",
              action: () => {
                setActiveView("orders");
                setActiveMenuItem("default");
                setActiveSubMenuItem("order-list");
              },
            },
          ],
        },
        {
          listLabel: "eCommerce",
          icon: "ecommerce-bag-icon",
          id: "ecommerce",
          subList: [],
        },
        {
          listLabel: "Projects",
          icon: "projects-folder-icon",
          id: "projects",
          subList: [],
        },
        {
          listLabel: "Online Courses",
          icon: "learning-book-icon",
          id: "online-courses",
          subList: [],
        },
      ],
    },
    {
      subHeaderLabel: "Pages",
      list: [
        {
          listLabel: "User Profile",
          icon: "user-profile-badge-icon",
          id: "user-profile",
          subList: [
            {
              subListLabel: "Overview",
              id: "overview",
              action: () => {},
            },
            {
              subListLabel: "Projects",
              id: "projects-sub",
              action: () => {},
            },
            {
              subListLabel: "Campaigns",
              id: "campaigns",
              action: () => {},
            },
            {
              subListLabel: "Documents",
              id: "documents",
              action: () => {},
            },
            {
              subListLabel: "Followers",
              id: "followers",
              action: () => {},
            },
          ],
        },
        {
          listLabel: "Account",
          icon: "account-card-icon",
          id: "account",
          subList: [],
        },
        {
          listLabel: "Corporate",
          icon: "corporate-users-icon",
          id: "corporate",
          subList: [],
        },
        {
          listLabel: "Blog",
          icon: "blog-notebook-icon",
          id: "blog",
          subList: [],
        },
        {
          listLabel: "Social",
          icon: "social-chat-icon",
          id: "social",
          subList: [],
        },
      ],
    },
  ];

  const handleMenuItemClick = (action?: () => void) => {
    if (action) action();
    if (onItemClick) onItemClick(); // Close mobile drawer
  };

  return (
    <section 
      className={`left-sidebar ${collapsed ? 'collapsed' : ''} ${sidebarSettings.compactMode ? 'compact' : ''} ${sidebarSettings.iconOnlyMode ? 'icon-only' : ''} ${isExpanded ? 'expanded' : ''}`}
      style={{ '--sidebar-width': `${sidebarSettings.width}px` } as React.CSSProperties}
      role="navigation"
      aria-label="Main navigation"
      onClick={sidebarSettings.iconOnlyMode ? toggleExpanded : undefined}
    >
      <div className="sidebar-content">
        <UserProfile 
          name={sidebarSettings.showText ? "ByeWind" : ""} 
          avatar="byewind-logo" 
          alt="ByeWind"
          compact={sidebarSettings.compactMode || sidebarSettings.iconOnlyMode}
        />
        
        {sidebarSettings.showHeader && (
          <div className="menu-item-header">
            {sidebarSettings.showButtons && (
              <div className="header-buttons">
                <Button title="Favorites" action={() => handleMenuItemClick()} />
                <Button style="lighter" title="Recently" action={() => handleMenuItemClick()} />
              </div>
            )}
            <div className="header-list">
              <StatusBadge 
                label="Overview" 
                markerColor="#1C1C1C33"
                compact={sidebarSettings.compactMode}
              />
              <StatusBadge 
                label="Projects" 
                markerColor="#1C1C1C33"
                compact={sidebarSettings.compactMode}
              />
            </div>
          </div>
        )}
        
        <div className="menu-container">
          {menu.map((item, index) => (
            <Menu 
              menu={item} 
              key={index}
              collapsed={sidebarSettings.iconOnlyMode}
              compact={sidebarSettings.compactMode}
              onItemClick={handleMenuItemClick}
              onMenuToggle={toggleExpanded}
            />
          ))}
        </div>
      </div>
    </section>
  );
  
};

export default LeftSidebar;
