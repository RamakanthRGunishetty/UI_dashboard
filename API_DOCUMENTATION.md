# API Documentation

## Overview

This document outlines the data structures and interfaces used in the Analytics UI Dashboard application. Currently, the application uses static JSON data, but this documentation provides the foundation for future API integration.

## Data Models

### Dashboard Statistics

#### DashboardCard
```typescript
interface DashboardCard {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: string;
  period?: string;
}
```

**Example**:
```json
{
  "id": "total-customers",
  "title": "Total Customers",
  "value": "5,423",
  "change": "+16%",
  "changeType": "increase",
  "icon": "user-group-icon",
  "period": "from last week"
}
```

### Order Management

#### OrderItem (Current Implementation)
```typescript
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
```

**Example**:
```json
{
  "id": "#CM9801",
  "name": "Natali Craig",
  "project": "Landing Page",
  "address": "Meadow Lane Oakland",
  "date": "Just now",
  "status": "In Progress",
  "avatar": "natali-craig-avatar",
  "alt": "Natali Craig",
  "priority": "High",
  "amount": 2500.00
}
```

#### Add Order Operations
The application supports creating new orders through the Add Order modal with the following workflow:

1. **Form Validation**: Required fields (name, project, address, amount)
2. **ID Generation**: Auto-generated sequential IDs in format #CM98XX
3. **Real-time Updates**: New orders appear instantly at the top of the list
4. **Animation**: Smooth entry animations for new orders

**Add Order Form Data**:
```typescript
interface AddOrderFormData {
  name: string;           // Customer name (required)
  project: string;        // Project name (required)
  address: string;        // Customer address (required)
  status: OrderItem['status']; // Order status (default: 'Pending')
  avatar: string;         // Avatar reference (default: 'default-avatar')
  priority: 'Low' | 'Medium' | 'High'; // Order priority (default: 'Medium')
  amount: number;         // Order amount (required, > 0)
}
```

#### Future Order Interface (For API Integration)
```typescript
interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  product: string;
  orderDate: string;
  status: OrderStatus;
  amount: number;
  quantity: number;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
}

type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

type PaymentMethod = 
  | 'credit_card' 
  | 'debit_card' 
  | 'paypal' 
  | 'bank_transfer' 
  | 'cash_on_delivery';
```

### Product Analytics

#### Product
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  amount: number;
  category: string;
  imageUrl?: string;
  description?: string;
  sku: string;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
}
```

**Example**:
```json
{
  "id": "prod_1234567890",
  "name": "Wireless Bluetooth Headphones",
  "price": 199.99,
  "quantity": 150,
  "amount": 29998.50,
  "category": "Electronics",
  "imageUrl": "/products/headphones.jpg",
  "description": "Premium wireless headphones with noise cancellation",
  "sku": "WBH-001",
  "inStock": true,
  "rating": 4.5,
  "reviewCount": 1247
}
```

### Chart Data

#### ChartDataPoint
```typescript
interface ChartDataPoint {
  id: string;
  label: string;
  value: number;
  date?: string;
  category?: string;
  color?: string;
}

interface TimeSeriesData extends ChartDataPoint {
  timestamp: string;
  trend?: 'up' | 'down' | 'stable';
}

interface GeographicData {
  country: string;
  countryCode: string;
  value: number;
  coordinates: [number, number]; // [longitude, latitude]
  region?: string;
  currency?: string;
}
```

### User Management

#### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  joinDate: string;
  lastActive: string;
  preferences: UserPreferences;
  permissions: Permission[];
}

type UserRole = 'admin' | 'manager' | 'analyst' | 'viewer';

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  dashboardLayout: DashboardLayout;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}
```

### Activity Feed

#### Activity
```typescript
interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
}

type ActivityType = 
  | 'order_created'
  | 'order_updated'
  | 'payment_received'
  | 'user_registered'
  | 'product_updated'
  | 'system_alert'
  | 'report_generated';
```

## API Endpoints (Future Implementation)

### Authentication

#### POST /api/auth/login
```typescript
Request: {
  email: string;
  password: string;
  rememberMe?: boolean;
}

Response: {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string;
}
```

#### POST /api/auth/refresh
```typescript
Request: {
  refreshToken: string;
}

Response: {
  token: string;
  expiresAt: string;
}
```

### Dashboard

#### GET /api/dashboard/stats
```typescript
Query Parameters: {
  period?: 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}

Response: {
  cards: DashboardCard[];
  lastUpdated: string;
}
```

#### GET /api/dashboard/charts
```typescript
Query Parameters: {
  type: 'revenue' | 'sales' | 'traffic' | 'conversion';
  period?: 'day' | 'week' | 'month' | 'year';
  granularity?: 'hour' | 'day' | 'week' | 'month';
}

Response: {
  data: ChartDataPoint[];
  metadata: {
    total: number;
    change: number;
    changePercentage: number;
    trend: 'up' | 'down' | 'stable';
  };
}
```

### Orders

#### GET /api/orders
```typescript
Query Parameters: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
  sortBy?: 'date' | 'amount' | 'customer' | 'status';
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

Response: {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    statuses: OrderStatus[];
    dateRange: {
      min: string;
      max: string;
    };
  };
}
```

#### GET /api/orders/:id
```typescript
Response: {
  order: Order;
  timeline: ActivityEvent[];
  relatedOrders?: Order[];
}
```

#### PUT /api/orders/:id
```typescript
Request: {
  status?: OrderStatus;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

Response: {
  order: Order;
  updated: string[];
}
```

### Products

#### GET /api/products
```typescript
Query Parameters: {
  page?: number;
  limit?: number;
  category?: string;
  inStock?: boolean;
  search?: string;
  sortBy?: 'name' | 'price' | 'quantity' | 'amount';
  sortOrder?: 'asc' | 'desc';
  priceMin?: number;
  priceMax?: number;
}

Response: {
  products: Product[];
  pagination: PaginationInfo;
  filters: ProductFilters;
}
```

#### GET /api/products/analytics
```typescript
Query Parameters: {
  period?: 'day' | 'week' | 'month' | 'year';
  category?: string;
}

Response: {
  topProducts: Product[];
  categoryBreakdown: CategoryStats[];
  revenueByProduct: ChartDataPoint[];
  inventoryAlerts: InventoryAlert[];
}
```

### Geographic Data

#### GET /api/analytics/geographic
```typescript
Query Parameters: {
  metric: 'revenue' | 'orders' | 'customers';
  period?: 'day' | 'week' | 'month' | 'year';
  granularity?: 'country' | 'state' | 'city';
}

Response: {
  data: GeographicData[];
  total: number;
  topRegions: {
    country: string;
    value: number;
    percentage: number;
  }[];
}
```

### User Management

#### GET /api/users
```typescript
Query Parameters: {
  page?: number;
  limit?: number;
  role?: UserRole;
  department?: string;
  search?: string;
  active?: boolean;
}

Response: {
  users: User[];
  pagination: PaginationInfo;
}
```

#### GET /api/users/profile
```typescript
Response: {
  user: User;
  permissions: Permission[];
  recentActivity: Activity[];
}
```

#### PUT /api/users/profile
```typescript
Request: {
  name?: string;
  email?: string;
  preferences?: Partial<UserPreferences>;
}

Response: {
  user: User;
  updated: string[];
}
```

### Notifications

#### GET /api/notifications
```typescript
Query Parameters: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: ActivityType;
}

Response: {
  notifications: Activity[];
  unreadCount: number;
  pagination: PaginationInfo;
}
```

#### PUT /api/notifications/:id/read
```typescript
Response: {
  success: boolean;
  notification: Activity;
}
```

#### PUT /api/notifications/mark-all-read
```typescript
Response: {
  success: boolean;
  markedCount: number;
}
```

## Error Handling

### Error Response Format
```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    path: string;
  };
}
```

### Common Error Codes
- `UNAUTHORIZED` (401) - Invalid or expired token
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `VALIDATION_ERROR` (422) - Invalid request data
- `RATE_LIMITED` (429) - Too many requests
- `INTERNAL_ERROR` (500) - Server error

## Rate Limiting

### Limits
- **Authentication**: 5 requests per minute
- **Dashboard**: 60 requests per minute
- **Orders**: 100 requests per minute
- **Search**: 30 requests per minute

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

### Standard Pagination
```typescript
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

### Cursor-based Pagination (for real-time data)
```typescript
interface CursorPagination {
  cursor?: string;
  limit: number;
  hasNext: boolean;
  nextCursor?: string;
}
```

## WebSocket Events (Real-time Updates)

### Connection
```javascript
const ws = new WebSocket('wss://api.example.com/ws');
```

### Event Types
```typescript
interface WebSocketEvent {
  type: 'order_updated' | 'new_notification' | 'dashboard_update';
  data: any;
  timestamp: string;
}
```

### Examples
```javascript
// Order status update
{
  "type": "order_updated",
  "data": {
    "orderId": "ord_1234567890",
    "status": "shipped",
    "trackingNumber": "1Z999AA1234567890"
  },
  "timestamp": "2024-01-15T14:30:00Z"
}

// New notification
{
  "type": "new_notification",
  "data": {
    "id": "notif_1234567890",
    "title": "New Order Received",
    "message": "Order #12345 has been placed",
    "priority": "medium"
  },
  "timestamp": "2024-01-15T14:30:00Z"
}
```

This API documentation provides a comprehensive foundation for implementing backend services for the Snow Dashboard application.
