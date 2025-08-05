import { useContext, useState, useEffect, useMemo, useCallback } from "react";
import Icon from "../../components/Icon";
import Search from "../../components/Search";
import Table from "../../containers/Table";
import rows from "../../data/orderList.json";
import UserProfile from "../../components/UserProfile";
import StatusBadge from "../../components/StatusBadge";
import { themeContext } from "../../contexts/themeContext";

// Enhanced interfaces for the order list
interface OrderItem {
  id: string;
  name: string;
  project: string;
  address: string;
  date: string;
  status: 'In Progress' | 'Complete' | 'Pending' | 'Approved' | 'Rejected';
  avatar: string;
  alt: string;
  priority?: 'Low' | 'Medium' | 'High';
  amount?: number;
}

interface FilterState {
  search: string;
  status: string[];
  dateRange: {
    from: string;
    to: string;
  };
  projectType: string[];
}

const tableProps = {
  checkboxSelection: true,
  hideFooter: false,
  className: "order-table",
  initialPageSize: 10,
  autoHeight: true,
  disableColumnResize: false,
  disableColumnMenu: true,
};

const Order = () => {
  const { theme } = useContext(themeContext);
  const [isVerySmall, setIsVerySmall] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  
  // Enhanced state management
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    dateRange: { from: '', to: '' },
    projectType: []
  });
  
  // Animation states
  const [animatedRows, setAnimatedRows] = useState<Set<string>>(new Set());
  const [rowsToAnimate, setRowsToAnimate] = useState<string[]>([]);
  
  // Search with debouncing
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);
  
  // Dynamic order list state
  const [orderList, setOrderList] = useState<OrderItem[]>(rows as OrderItem[]);

  // Filtered and sorted data
  const filteredAndSortedRows = useMemo(() => {
    let filtered = [...orderList];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(row => 
        row.name.toLowerCase().includes(searchLower) ||
        row.project.toLowerCase().includes(searchLower) ||
        row.id.toLowerCase().includes(searchLower) ||
        row.address.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(row => filters.status.includes(row.status));
    }
    
    // Apply sorting
    if (sortConfig) {
      filtered.sort((a: any, b: any) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [orderList, filters, sortConfig]);

  // Animation effects for new rows
  useEffect(() => {
    if (rowsToAnimate.length > 0) {
      const timer = setTimeout(() => {
        setAnimatedRows(prev => new Set([...prev, ...rowsToAnimate]));
        setRowsToAnimate([]);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [rowsToAnimate]);

  // Notification auto-dismiss
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const checkResponsiveState = () => {
      const width = window.innerWidth;
      const verySmall = width < 440;
      setIsVerySmall(verySmall);
      
      // Check if sidebar is expanded (look for the sidebar container state)
      const sidebarContainer = document.querySelector('.sidebar-container');
      const isExpanded = sidebarContainer?.classList.contains('drawer-open');
      setSidebarExpanded(!!isExpanded);
    };
    
    checkResponsiveState();
    window.addEventListener('resize', checkResponsiveState);
    
    // Also listen for sidebar state changes
    const observer = new MutationObserver(checkResponsiveState);
    const sidebarContainer = document.querySelector('.sidebar-container');
    if (sidebarContainer) {
      observer.observe(sidebarContainer, { attributes: true, attributeFilter: ['class'] });
    }
    
    return () => {
      window.removeEventListener('resize', checkResponsiveState);
      observer.disconnect();
    };
  }, []);

  // Utility functions
  const handleSearch = useCallback((searchTerm: string) => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debouncing
    const newTimeout = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 300);
    
    setSearchTimeout(newTimeout);
  }, [searchTimeout]);

  const handleSort = useCallback((column: string) => {
    setSortConfig(prev => {
      if (!prev || prev.key !== column) {
        return { key: column, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { key: column, direction: 'desc' };
      }
      return null; // Remove sorting
    });
  }, []);

  const handleBulkAction = useCallback(async (action: string) => {
    if (selectedRows.length === 0) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNotification({ 
        message: `${action} applied to ${selectedRows.length} orders`, 
        type: 'success' 
      });
      
      setSelectedRows([]);
    } catch (error) {
      setNotification({ 
        message: `Failed to ${action.toLowerCase()} orders`, 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedRows]);

  const handleExport = useCallback(() => {
    const dataToExport = selectedRows.length > 0 
      ? filteredAndSortedRows.filter(row => selectedRows.includes(row.id))
      : filteredAndSortedRows;
    
    const csvContent = [
      ['Order ID', 'Name', 'Project', 'Address', 'Date', 'Status'],
      ...dataToExport.map(row => [row.id, row.name, row.project, row.address, row.date, row.status])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    setNotification({ 
      message: 'Orders exported successfully', 
      type: 'success' 
    });
  }, [selectedRows, filteredAndSortedRows]);

  // Add order handler
  const handleAddOrder = useCallback((newOrderData: Omit<OrderItem, 'id'>) => {
    // Generate a new ID in the format #CM98XX
    const nextId = `#CM98${String(orderList.length + 1).padStart(2, '0')}`;
    
    const newOrder: OrderItem = {
      ...newOrderData,
      id: nextId,
      date: 'Just now'
    };

    // Add to the beginning of the list with animation
    setOrderList(prev => [newOrder, ...prev]);
    setRowsToAnimate([nextId]);
    
    // Close modal and show success notification
    setShowAddOrderModal(false);
    setNotification({ 
      message: 'Order added successfully!', 
      type: 'success' 
    });
  }, [orderList.length]);
  
  // Responsive column configuration based on screen size
  const getResponsiveColumns = () => {
    const isMobile = window.innerWidth < 440;
    const isSmallMobile = window.innerWidth >= 440 && window.innerWidth < 768;

    return [
      {
        field: "checkbox",
        headerName: "",
        width: 50,
        sortable: false,
        renderHeader: () => (
          <input
            type="checkbox"
            className="bulk-select-checkbox"
            checked={selectedRows.length === filteredAndSortedRows.length && filteredAndSortedRows.length > 0}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRows(filteredAndSortedRows.map(row => row.id));
              } else {
                setSelectedRows([]);
              }
            }}
          />
        ),
        renderCell: (params: any) => (
          <input
            type="checkbox"
            className="row-select-checkbox"
            checked={selectedRows.includes(params.row.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRows(prev => [...prev, params.row.id]);
              } else {
                setSelectedRows(prev => prev.filter(id => id !== params.row.id));
              }
            }}
          />
        ),
      },
      {
        field: "id",
        headerName: "Order ID",
        flex: isMobile ? 0.4 : 0.3,
        minWidth: isMobile ? 80 : 100,
        renderHeader: () => (
          <div 
            className="sortable-header" 
            onClick={() => handleSort('id')}
          >
            Order ID
            {sortConfig?.key === 'id' && (
              <Icon 
                type={sortConfig.direction === 'asc' ? "arrow-up-trend-icon" : "arrow-down-trend-icon"} 
                alt="Sort"
              />
            )}
          </div>
        ),
        renderCell: (params: any) => (
          <div 
            className={`order-id-cell ${animatedRows.has(params.row.id) ? 'row-animated' : ''}`}
            onClick={() => {
              setSelectedOrder(params.row);
              setShowOrderDetails(true);
            }}
          >
            {params.row.id}
          </div>
        ),
      },
      {
        field: "name",
        headerName: "User",
        flex: isMobile ? 0.6 : isSmallMobile ? 0.5 : 0.5,
        minWidth: isMobile ? 120 : 140,
        renderCell: (params: any) => (
          <div className={`user-cell ${animatedRows.has(params.row.id) ? 'row-animated' : ''}`}>
            <UserProfile
              name={params.row.name}
              avatar={params.row.avatar}
              alt={params.row.alt}
              compact={isMobile}
            />
          </div>
        ),
      },
      {
        field: "project",
        headerName: "Project",
        flex: isMobile ? 0.8 : isSmallMobile ? 0.7 : 0.7,
        minWidth: isMobile ? 100 : 120,
        hide: isMobile && window.innerWidth < 380,
        renderHeader: () => (
          <div 
            className="sortable-header" 
            onClick={() => handleSort('project')}
          >
            Project
            {sortConfig?.key === 'project' && (
              <Icon 
                type={sortConfig.direction === 'asc' ? "arrow-up-trend-icon" : "arrow-down-trend-icon"} 
                alt="Sort"
              />
            )}
          </div>
        ),
        renderCell: (params: any) => (
          <div className={`project-cell ${animatedRows.has(params.row.id) ? 'row-animated' : ''}`}>
            <span>{params.row.project}</span>
          </div>
        ),
      },
      {
        field: "address",
        headerName: "Address",
        flex: isMobile ? 1.2 : 1,
        minWidth: isMobile ? 120 : 150,
        hide: isMobile,
        renderCell: (params: any) => (
          <div className={`address-cell ${animatedRows.has(params.row.id) ? 'row-animated' : ''}`}>
            {params.row.address}
          </div>
        ),
      },
      {
        field: "date",
        headerName: "Date",
        flex: isMobile ? 0.6 : 0.5,
        minWidth: isMobile ? 90 : 110,
        align: "center",
        headerAlign: "center",
        renderHeader: () => (
          <div 
            className="sortable-header" 
            onClick={() => handleSort('date')}
          >
            Date
            {sortConfig?.key === 'date' && (
              <Icon 
                type={sortConfig.direction === 'asc' ? "arrow-up-trend-icon" : "arrow-down-trend-icon"} 
                alt="Sort"
              />
            )}
          </div>
        ),
        renderCell: (params: any) => (
          <div className={`date-field ${animatedRows.has(params.row.id) ? 'row-animated' : ''}`}>
            <Icon type="calendar-date-icon" />
            <span>{params.row.date}</span>
          </div>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        flex: isMobile ? 0.7 : 0.5,
        minWidth: isMobile ? 85 : 100,
        align: "center",
        headerAlign: "center",
        renderCell: (params: any) => {
          let color = "";
          const status = params.row.status;
          switch (status) {
            case "In Progress":
              color = "#8A8CD9";
              break;
            case "Complete":
              color = "#4AA785";
              break;
            case "Pending":
              color = "#59A8D4";
              break;
            case "Approved":
              color = "#FFC555";
              break;
            case "Rejected":
              theme == "light" ? (color = "#1C1C1C66") : (color = "#ffffff66");
              break;
          }
          
          return (
            <div className={`status-cell ${animatedRows.has(params.row.id) ? 'row-animated' : ''}`}>
              <StatusBadge
                label={status}
                labelColor={color}
                markerColor={color}
                compact={isMobile}
              />
            </div>
          );
        },
      },
      {
        field: "actions",
        headerName: "",
        width: 60,
        sortable: false,
        renderCell: (params: any) => (
          <div className="action-buttons">
            <button
              className="action-btn view-btn"
              onClick={() => {
                setSelectedOrder(params.row);
                setShowOrderDetails(true);
              }}
              title="View Details"
            >
              <Icon type="vector-graphic-icon" />
            </button>
          </div>
        ),
      },
    ].filter(col => !col.hide);
  };

  const columns = getResponsiveColumns();
  
  return (
    <section className="order-list-wrapper">
      {/* Enhanced Header */}
      <div className="order-list-header">
        <h6>Order List</h6>
        <div className="header-stats">
          <span className="total-orders">Total: {filteredAndSortedRows.length}</span>
          {selectedRows.length > 0 && (
            <span className="selected-count">{selectedRows.length} selected</span>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="action-bar">
        <div className="action-group">
          <button 
            className="action-btn primary"
            onClick={() => setShowAddOrderModal(true)}
            title="Add Order"
          >
            <Icon type="add-plus-icon" />
          </button>
          
          <button 
            className={`action-btn ${showAdvancedFilters ? 'active' : ''}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            title="Filters"
          >
            <Icon type="filter-funnel-icon" />
          </button>
          
          <button 
            className="action-btn"
            onClick={handleExport}
            title="Export CSV"
          >
            <Icon type="vector-graphic-icon" />
          </button>
        </div>

        <div className="search-group">
          <Search 
            showTextIcon={true} 
            compact={isVerySmall && sidebarExpanded}
            placeholder="Search orders..."
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="advanced-filters-panel">
          <div className="filter-row">
            <div className="filter-group">
              <label>Status:</label>
              <div className="status-filters">
                {['In Progress', 'Complete', 'Pending', 'Approved', 'Rejected'].map(status => (
                  <label key={status} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({ ...prev, status: [...prev.status, status] }));
                        } else {
                          setFilters(prev => ({ ...prev, status: prev.status.filter(s => s !== status) }));
                        }
                      }}
                    />
                    <span className="checkmark"></span>
                    {status}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="filter-actions">
            <button 
              className="clear-filters-btn"
              onClick={() => setFilters({ search: '', status: [], dateRange: { from: '', to: '' }, projectType: [] })}
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 && (
        <div className="bulk-actions-bar">
          <span className="bulk-info">{selectedRows.length} orders selected</span>
          <div className="bulk-buttons">
            <button 
              className="bulk-btn approve"
              onClick={() => handleBulkAction('Approve')}
              disabled={isLoading}
            >
              Approve Selected
            </button>
            <button 
              className="bulk-btn reject"
              onClick={() => handleBulkAction('Reject')}
              disabled={isLoading}
            >
              Reject Selected
            </button>
            <button 
              className="bulk-btn export"
              onClick={handleExport}
            >
              Export Selected
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Processing...</span>
        </div>
      )}

      {/* Enhanced Table */}
      <div className="order-list-table">
        <Table rows={filteredAndSortedRows} columns={columns} properties={tableProps} />
      </div>

      {/* Add Order Modal */}
      {showAddOrderModal && <AddOrderModal onClose={() => setShowAddOrderModal(false)} onSubmit={handleAddOrder} />}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderDetails(false)}>
          <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details - {selectedOrder.id}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowOrderDetails(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="detail-section">
                <h4>Customer Information</h4>
                <div className="detail-row">
                  <UserProfile
                    name={selectedOrder.name}
                    avatar={selectedOrder.avatar}
                    alt={selectedOrder.alt}
                  />
                </div>
                <div className="detail-row">
                  <strong>Address:</strong> {selectedOrder.address}
                </div>
              </div>

              <div className="detail-section">
                <h4>Project Details</h4>
                <div className="detail-row">
                  <strong>Project:</strong> {selectedOrder.project}
                </div>
                <div className="detail-row">
                  <strong>Date:</strong> {selectedOrder.date}
                </div>
                <div className="detail-row">
                  <strong>Status:</strong> 
                  <StatusBadge
                    label={selectedOrder.status}
                    labelColor={getStatusColor(selectedOrder.status)}
                    markerColor={getStatusColor(selectedOrder.status)}
                  />
                </div>
              </div>

              <div className="detail-section">
                <h4>Activity Timeline</h4>
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <strong>Order Created</strong>
                      <p>Initial order submission</p>
                      <span className="timeline-date">{selectedOrder.date}</span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-marker active"></div>
                    <div className="timeline-content">
                      <strong>Status: {selectedOrder.status}</strong>
                      <p>Current order status</p>
                      <span className="timeline-date">Now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn secondary"
                onClick={() => setShowOrderDetails(false)}
              >
                Close
              </button>
              <button 
                className="btn primary"
                onClick={() => {
                  setNotification({ message: 'Edit functionality coming soon!', type: 'info' });
                }}
              >
                Quick Actions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          <span>{notification.message}</span>
          <button 
            className="toast-close"
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}
    </section>
  );

  // Helper function for status colors
  function getStatusColor(status: string): string {
    switch (status) {
      case "In Progress": return "#8A8CD9";
      case "Complete": return "#4AA785";
      case "Pending": return "#59A8D4";
      case "Approved": return "#FFC555";
      case "Rejected": return theme === "light" ? "#1C1C1C66" : "#ffffff66";
      default: return "#8A8CD9";
    }
  }
};

// Add Order Modal Component
interface AddOrderModalProps {
  onClose: () => void;
  onSubmit: (orderData: Omit<OrderItem, 'id'>) => void;
}

const AddOrderModal = ({ onClose, onSubmit }: AddOrderModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    project: '',
    address: '',
    status: 'Pending' as OrderItem['status'],
    avatar: 'default-avatar',
    alt: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    amount: 0
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) newErrors.name = 'Customer name is required';
    if (!formData.project.trim()) newErrors.project = 'Project name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        ...formData,
        alt: formData.name, // Use name as alt text
        date: 'Just now' // Will be overridden in the handler
      };
      onSubmit(submitData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Order</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-section">
            <h4>Customer Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerName">Customer Name *</label>
                <input
                  id="customerName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter customer name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={errors.address ? 'error' : ''}
                  placeholder="Enter customer address"
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Project Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="project">Project Name *</label>
                <input
                  id="project"
                  type="text"
                  value={formData.project}
                  onChange={(e) => handleInputChange('project', e.target.value)}
                  className={errors.project ? 'error' : ''}
                  placeholder="Enter project name"
                />
                {errors.project && <span className="error-text">{errors.project}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="amount">Amount ($) *</label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  className={errors.amount ? 'error' : ''}
                  placeholder="0.00"
                />
                {errors.amount && <span className="error-text">{errors.amount}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Order Settings</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Approved">Approved</option>
                  <option value="Complete">Complete</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Add Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Order;
