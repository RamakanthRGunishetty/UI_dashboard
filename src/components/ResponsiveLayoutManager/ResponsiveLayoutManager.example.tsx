import React from 'react';
import ResponsiveLayoutManager from './ResponsiveLayoutManager';
import LeftSidebar from '../../containers/LeftSidebar';
import Navbar from '../../containers/Navbar/Navbar';
import Orders from '../../views/Orders';
import RightSidebar from '../../containers/RightSidebar';

/**
 * Example usage of ResponsiveLayoutManager
 * 
 * This component demonstrates how to implement the responsive layout
 * that prevents overlap between OrderList and Sidebar on screens <440px
 */
const ResponsiveLayoutExample: React.FC = () => {
  return (
    <ResponsiveLayoutManager
      // Left sidebar with navigation
      sidebar={
        <LeftSidebar 
          collapsed={false}
          onItemClick={() => {
            // Handle menu item clicks
            // On very small screens, this will auto-close the sidebar
          }}
        />
      }
      
      // Top navigation bar
      navbar={
        <Navbar 
          currentPage="Orders"
          onMenuClick={() => {
            // This will be handled by ResponsiveLayoutManager
            // No need to implement custom logic
          }}
          showMenuButton={false} // ResponsiveLayoutManager handles the hamburger
        />
      }
      
      // Main content area (OrderList)
      orderList={<Orders />}
      
      // Right sidebar (hidden on mobile)
      rightSidebar={<RightSidebar />}
      
      // Optional custom className
      className="custom-dashboard-layout"
    />
  );
};

/**
 * Advanced example with custom breakpoint handling
 */
const CustomResponsiveExample: React.FC = () => {
  return (
    <ResponsiveLayoutManager
      sidebar={
        <div style={{ padding: '20px' }}>
          <h3>Navigation Menu</h3>
          <nav>
            <ul>
              <li><a href="#dashboard">Dashboard</a></li>
              <li><a href="#orders">Orders</a></li>
              <li><a href="#customers">Customers</a></li>
            </ul>
          </nav>
        </div>
      }
      
      navbar={
        <div style={{ 
          padding: '16px 24px', 
          borderBottom: '1px solid #e0e0e0',
          background: 'white'
        }}>
          <h2>Dashboard Header</h2>
        </div>
      }
      
      orderList={
        <div style={{ padding: '24px' }}>
          <h1>Order Management</h1>
          <p>This content takes full width on screens &lt;440px</p>
          <p>Sidebar becomes a drawer that can be toggled via hamburger menu</p>
          
          {/* Example table or content */}
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h3>Order List Table</h3>
            <p>Table content goes here...</p>
          </div>
        </div>
      }
      
      rightSidebar={
        <div style={{ padding: '20px', background: '#f8f9fa' }}>
          <h4>Notifications</h4>
          <p>Right sidebar content</p>
        </div>
      }
    />
  );
};

export default ResponsiveLayoutExample;
export { CustomResponsiveExample };