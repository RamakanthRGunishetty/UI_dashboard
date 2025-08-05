import { useState, useEffect, useRef } from "react";
import notifications from "../../data/notification.json";
import activities from "../../data/activities.json";
import contacts from "../../data/contacts.json";
import CardContainer from "../../components/CardContainer";
import Icon from "../../components/Icon";

interface RightSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const useResponsiveRightSidebar = () => {
  const [sidebarSettings, setSidebarSettings] = useState({
    width: 240,
    showContent: true,
    iconOnlyMode: false,
    isExpanded: false
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateSettings = () => {
      const width = window.innerWidth;
      
      if (width < 480) {
        // Mobile - hide completely
        setSidebarSettings(prev => ({
          ...prev,
          width: 0,
          showContent: false,
          iconOnlyMode: false
        }));
        setIsExpanded(false);
      } else if (width >= 480 && width < 768) {
        // Small tablet - compact content with smaller text
        setSidebarSettings(prev => ({
          ...prev,
          width: 200,
          showContent: true,
          iconOnlyMode: false
        }));
        setIsExpanded(false);
      } else if (width >= 768 && width < 1024) {
        // Medium tablet - slightly reduced width but full content
        setSidebarSettings(prev => ({
          ...prev,
          width: 220,
          showContent: true,
          iconOnlyMode: false
        }));
        setIsExpanded(false);
      } else {
        // Large Desktop (>=1024px) - always show full content
        setSidebarSettings(prev => ({
          ...prev,
          width: 240,
          showContent: true,
          iconOnlyMode: false
        }));
        setIsExpanded(false);
      }
    };

    updateSettings();
    window.addEventListener('resize', updateSettings);
    return () => window.removeEventListener('resize', updateSettings);
  }, []); // Remove isExpanded dependency to avoid conflicts

  const toggleExpanded = () => {
    const width = window.innerWidth;
    // Only allow toggle for tablet ranges
    if (width >= 480 && width < 1024) {
      setIsExpanded(prev => !prev);
    }
  };

  return { ...sidebarSettings, isExpanded, toggleExpanded };
};

const RightSidebar = ({ isOpen, onClose }: RightSidebarProps = {}) => {
  const { iconOnlyMode, isExpanded, toggleExpanded } = useResponsiveRightSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // When external control is provided, use it exclusively
  const isExternallyControlled = isOpen !== undefined;
  const actuallyExpanded = isExternallyControlled ? isOpen : isExpanded;
  const shouldShowContent = isExternallyControlled ? isOpen : true;
  
  // Handle close action
  const handleClose = () => {
    if (isExternallyControlled && onClose) {
      onClose();
    } else if (!isExternallyControlled) {
      toggleExpanded();
    }
  };

  // Only handle escape key for accessibility, no click-outside behavior
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && actuallyExpanded && isExternallyControlled) {
        handleClose();
      }
    };

    if (actuallyExpanded && isExternallyControlled) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [actuallyExpanded, isExternallyControlled, handleClose]);

  return (
    <>
      {/* No overlay - sidebar should not close when clicking outside */}
      
      <div 
        ref={sidebarRef}
        className={`right-sidebar ${iconOnlyMode ? 'icon-only' : ''} ${shouldShowContent ? 'expanded' : 'collapsed'}`}
        onClick={!isExternallyControlled && iconOnlyMode && !shouldShowContent ? toggleExpanded : undefined}
        role="complementary"
        aria-label="Notifications and activities"
      >
      {!shouldShowContent ? (
        // Collapsed state - show icon only or nothing
        iconOnlyMode ? (
          <div className="sidebar-icons">
            <div className="icon-item" title="Notifications">
              <Icon type="notification-bell-icon" />
              <div className="notification-badge">3</div>
            </div>
          </div>
        ) : null
      ) : (
        // Expanded state - show full content
        <div className="sidebar-content">
          {/* Close button for expanded state */}
          {actuallyExpanded && iconOnlyMode && (
            <div className="close-button" onClick={handleClose} title="Close sidebar">
              <Icon type="sidebar-icon" />
            </div>
          )}
          
          {/* Always show content sections when expanded */}
          <div className="notifications">
            <CardContainer subHeader="Notifications" list={notifications} />
          </div>
          <div className="activities">
            <CardContainer subHeader="Activities" list={activities} />
          </div>
          <div className="contacts">
            <CardContainer subHeader="Contacts" list={contacts} />
          </div>
        </div>
      )}
      </div>
    </>
  );
  
};

export default RightSidebar;
