import { useEffect, useState, useContext } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Icon from "../../components/Icon";
import {MenuItem} from "../../types/MenuTypes";
import { navContext } from "../../contexts/navigationContext";

interface MenuProps {
  menu: MenuItem;
  key: number;
  collapsed?: boolean;
  compact?: boolean;
  onItemClick?: (action?: () => void) => void;
  onMenuToggle?: () => void;
}

const Menu = ({ menu, collapsed = false, compact = false, onItemClick, onMenuToggle }:MenuProps) => {
  const [open, setOpen] = useState<Record<string,boolean>>({});
  const { subHeaderLabel, list }:MenuItem = menu;
  const { activeMenuItem, setActiveMenuItem, activeSubMenuItem, setActiveSubMenuItem } = useContext(navContext);
  
  const handleClick = (label: string = '', itemId: string = '', hasSubitems = false) => {
    if (collapsed && hasSubitems && onMenuToggle) {
      // In collapsed mode, expand sidebar first
      onMenuToggle();
      return;
    }
    
    // Normal mode - toggle collapse
    if (label) {
      const obj = {
        ...open,
        [label]: !open[label],
      };
      setOpen(obj);
    }
    
    // Set active menu item when clicked
    if (itemId) {
      setActiveMenuItem(itemId);
    }
  };

  const handleSubItemClick = (subItemId: string, action?: () => void) => {
    setActiveSubMenuItem(subItemId);
    if (onItemClick) {
      onItemClick(action);
    } else if (action) {
      action();
    }
  };

  useEffect(() => {
    const headerLabels: Record<string, boolean> = {};
    const listHeaders = menu.list.map(({ listLabel }) => listLabel).filter(Boolean);
    listHeaders.forEach((item) => {
      if (item) {
        // Open "Default" menu by default if it's the active menu item
        if (item === "Default" && activeMenuItem === "default") {
          headerLabels[item] = true;
        } else {
          headerLabels[item] = false;
        }
      }
    });
    setOpen(headerLabels);
  }, [activeMenuItem]);

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={`menu-list ${collapsed ? 'collapsed' : ''} ${compact ? 'compact' : ''}`}
      subheader={
        !collapsed && (
          <ListSubheader component="div" id="nested-list-subheader">
            {subHeaderLabel}
          </ListSubheader>
        )
      }
    >
      {list.map((item, index) => {
        const itemLabel = item.listLabel || '';
        const itemIcon = item.icon || '';
        const itemId = item.id || '';
        const isOpen = itemLabel ? open[itemLabel] || false : false;
        
        const hasSubitems = (item.subList || []).length > 0;
        
        return (
          <div key={index}>
            <ListItemButton
              onClick={(event) => {
                event.stopPropagation(); // Prevent sidebar click from bubbling
                handleClick(itemLabel, itemId, hasSubitems);
              }}
              className={`menu-item ${activeMenuItem === itemId ? 'active' : ''} ${collapsed && hasSubitems ? 'has-subitems' : ''}`}
              title={collapsed ? itemLabel : undefined}
              aria-label={collapsed ? itemLabel : undefined}
              aria-expanded={isOpen}
              aria-haspopup={hasSubitems ? "true" : undefined}
            >
              {!collapsed && hasSubitems && (isOpen ? (
                <Icon type="arrow-down-icon" />
              ) : (
                <Icon type="arrow-right-icon" />
              ))}
              <ListItemIcon>
                <Icon type={itemIcon} />
              </ListItemIcon>
              {!collapsed && <ListItemText primary={itemLabel} />}
              {collapsed && hasSubitems && (
                <div className="submenu-indicator">
                  <Icon type="arrow-right-icon" />
                </div>
              )}
            </ListItemButton>

            {/* Normal collapse for both modes */}
            {hasSubitems && (
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {(item.subList || []).map((subListItem, subIndex) => (
                    <ListItemButton 
                      sx={{ pl: compact ? 3 : 4 }} 
                      key={subIndex}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSubItemClick(subListItem.id || '', subListItem.action);
                      }}
                      className={`sub-menu-item ${activeSubMenuItem === subListItem.id ? 'active' : ''}`}
                    >
                      <ListItemText primary={subListItem.subListLabel} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        );
      })}
    </List>
  );
  
};

export default Menu;
