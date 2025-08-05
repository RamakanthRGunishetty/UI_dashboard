# Analytucs UI Dashboard Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Documentation](#component-documentation)
3. [State Management](#state-management)
4. [Responsive Design](#responsive-design)
5. [API Integration](#api-integration)
6. [Performance Optimization](#performance-optimization)
7. [Testing Guidelines](#testing-guidelines)
8. [Deployment](#deployment)

## Architecture Overview

### Design Patterns

The Snow Dashboard follows a modular architecture pattern with clear separation of concerns:

- **Components**: Pure, reusable UI components
- **Containers**: Business logic and data handling
- **Views**: Page-level components that compose containers
- **Contexts**: Global state management
- **Hooks**: Custom reusable logic

### File Organization

```
src/
├── components/          # Pure UI components
├── containers/          # Business logic components  
├── views/              # Page components
├── contexts/           # Global state
├── hooks/              # Custom hooks
├── data/               # Static data
├── styles/             # Global styles
├── types/              # TypeScript definitions
└── utils/              # Helper functions
```

## Component Documentation

### Core Components

#### Button Component
**Location**: `src/components/Button/Button.tsx`

**Props**:
```typescript
interface ButtonProps {
  title: string;
  style?: 'primary' | 'secondary' | 'lighter';
  action?: () => void;
  disabled?: boolean;
}
```

**Usage**:
```tsx
<Button 
  title="Save Changes" 
  style="primary" 
  action={() => handleSave()} 
/>
```

#### Card Component
**Location**: `src/components/Card/Card.tsx`

**Props**:
```typescript
interface CardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}
```

**Usage**:
```tsx
<Card 
  title="Total Revenue" 
  value="$45,231" 
  change="+12%" 
  trend="up" 
  icon="revenue-icon" 
/>
```

#### Search Component
**Location**: `src/components/Search/Search.tsx`

**Props**:
```typescript
interface SearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  compact?: boolean;
  expanded?: boolean;
}
```

**Features**:
- Real-time search with debouncing
- Responsive design with compact mode
- Keyboard navigation support
- Clear search functionality

### Container Components

#### LeftSidebar Container
**Location**: `src/containers/LeftSidebar/LeftSidebar.tsx`

**Responsive Behavior**:
- **Desktop (≥1400px)**: Full sidebar always visible
- **Medium (480px-1399px)**: Hidden by default, drawer on click
- **Mobile (<480px)**: Slide-out drawer with overlay

**Features**:
- Multi-level menu navigation
- Theme-aware styling
- Touch gestures for mobile
- Keyboard accessibility

#### Charts Containers

##### BarChart Container
**Location**: `src/containers/BarChart/BarChart.tsx`

**Props**:
```typescript
interface BarChartProps {
  title: string;
  data?: ChartData[];
  height?: number;
  responsive?: boolean;
}
```

**Features**:
- Responsive height adjustment
- Dynamic data loading
- Hover interactions
- Export functionality

##### LineChart Container
**Location**: `src/containers/LineChart/LineChart.tsx`

**Features**:
- Multi-line support
- Real-time data updates
- Zoom and pan functionality
- Responsive legend positioning

#### Table Container
**Location**: `src/containers/Table/Table.tsx`

**Features**:
- Sorting and filtering
- Pagination
- Responsive column hiding
- Export to CSV/Excel
- Selection and bulk actions

### View Components

#### Dashboard View
**Location**: `src/views/Dashboard/Dashboard.tsx`

**Layout Sections**:
1. **Stats Cards**: KPI overview widgets
2. **Chart Section**: Bar and line charts
3. **Map Section**: Geographic revenue data
4. **Table Section**: Top products listing
5. **Analytics Section**: Additional metrics

#### Orders View
**Location**: `src/views/Orders/Orders.tsx`

**Features**:
- Advanced data grid with MUI X
- Real-time order status updates
- Bulk operations
- Export functionality
- Responsive table design
- Add Order modal functionality

##### AddOrderModal Component
**Location**: `src/views/Orders/Orders.tsx` (internal component)

**Props**:
```typescript
interface AddOrderModalProps {
  onClose: () => void;
  onSubmit: (orderData: Omit<OrderItem, 'id'>) => void;
}
```

**Form Fields**:
- **Customer Name** (required): Text input for customer name
- **Address** (required): Text input for customer address  
- **Project Name** (required): Text input for project name
- **Amount** (required): Number input for order amount (must be > 0)
- **Status**: Dropdown selection (Pending, In Progress, Approved, Complete, Rejected)
- **Priority**: Dropdown selection (Low, Medium, High)

**Features**:
- Real-time form validation with error messages
- Auto-generated sequential order IDs (#CM98XX format)
- Responsive design with mobile optimization
- Keyboard navigation and accessibility support
- Smooth animations for order creation
- Instant feedback with success notifications

**Usage Workflow**:
1. User clicks "Add Order" button in action bar
2. Modal opens with empty form
3. User fills required fields with real-time validation
4. Form submission creates new order at top of list
5. Success notification and modal auto-close
6. New order appears with entry animation

## State Management

### Navigation Context
**Location**: `src/contexts/navigationContext.tsx`

**State Structure**:
```typescript
interface NavigationState {
  activeView: 'dashboard' | 'orders';
  activeMenuItem: string;
  activeSubMenuItem: string;
}
```

**Actions**:
- `setActiveView(view: string)`
- `setActiveMenuItem(item: string)`
- `setActiveSubMenuItem(subItem: string)`

### Theme Context
**Location**: `src/contexts/themeContext.tsx`

**State Structure**:
```typescript
interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}
```

**Features**:
- Persistent theme storage
- System preference detection
- CSS custom property updates

## Responsive Design

### Breakpoint System

```scss
// Mobile First Approach
$mobile: 480px;
$tablet: 768px;
$desktop: 1024px;
$large-desktop: 1400px;

// Usage
@media screen and (min-width: $tablet) {
  // Tablet and up styles
}
```

### Responsive Patterns

#### Sidebar Behavior
1. **Mobile (<480px)**: Slide-out drawer
2. **Small Tablet (480-767px)**: Icon-only with expand
3. **Large Tablet (768-1023px)**: Icon-only with expand
4. **Desktop (≥1024px)**: Full sidebar visible

#### Chart Responsiveness
- Dynamic height based on viewport
- Responsive legends and labels
- Touch-friendly interactions
- Optimized data density

#### Table Adaptations
- Progressive column hiding
- Horizontal scroll on mobile
- Compact row height
- Touch-friendly controls

### Custom Hooks for Responsiveness

#### useViewport Hook
```typescript
interface ViewportState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}
```

#### useResponsiveLayout Hook
```typescript
interface ResponsiveLayoutState {
  sidebarVisible: boolean;
  sidebarCollapsed: boolean;
  isDrawerMode: boolean;
  orderListFullWidth: boolean;
}
```

## API Integration

### Data Layer Architecture

#### Static Data
Current implementation uses JSON files for demo data:
- `src/data/dashboardCard.json` - KPI cards data
- `src/data/topProducts.json` - Product listings
- `src/data/activities.json` - Activity feed
- `src/data/contacts.json` - Contact information

#### Future API Integration

**Recommended Structure**:
```typescript
// services/api.ts
export const apiClient = {
  dashboard: {
    getStats: () => Promise<DashboardStats>,
    getChartData: (type: string) => Promise<ChartData>,
  },
  orders: {
    getAll: (filters?: OrderFilters) => Promise<Order[]>,
    getById: (id: string) => Promise<Order>,
    update: (id: string, data: Partial<Order>) => Promise<Order>,
  }
};
```

### Error Handling
```typescript
// hooks/useApiData.ts
export const useApiData = <T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Implementation with error boundaries
};
```

## Performance Optimization

### Code Splitting
```typescript
// Lazy loading for views
const Dashboard = lazy(() => import('./views/Dashboard'));
const Orders = lazy(() => import('./views/Orders'));

// Route-based splitting
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/orders" element={<Orders />} />
  </Routes>
</Suspense>
```

### Memoization Strategies
```typescript
// Component memoization
const ExpensiveComponent = memo(({ data, onAction }) => {
  return <ComplexVisualization data={data} onAction={onAction} />;
});

// Callback memoization
const handleSearch = useCallback((query: string) => {
  // Search logic
}, [dependencies]);

// Value memoization
const processedData = useMemo(() => {
  return expensiveDataProcessing(rawData);
}, [rawData]);
```

### Bundle Optimization
- Tree shaking for Material-UI components
- Dynamic imports for chart libraries
- Image optimization and lazy loading
- CSS purging for unused styles

## Testing Guidelines

### Unit Testing
```typescript
// Component testing with React Testing Library
describe('Button Component', () => {
  test('renders with correct text', () => {
    render(<Button title="Test Button" />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  test('calls action on click', () => {
    const mockAction = jest.fn();
    render(<Button title="Test" action={mockAction} />);
    fireEvent.click(screen.getByText('Test'));
    expect(mockAction).toHaveBeenCalled();
  });
});
```

### Integration Testing
```typescript
// Context provider testing
describe('Navigation Context', () => {
  test('updates active view correctly', () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });
    
    act(() => {
      result.current.setActiveView('orders');
    });
    
    expect(result.current.activeView).toBe('orders');
  });
});
```

### E2E Testing
```typescript
// Cypress example
describe('Dashboard Navigation', () => {
  it('should navigate between views', () => {
    cy.visit('/');
    cy.get('[data-testid="sidebar-menu"]').click();
    cy.get('[data-testid="orders-link"]').click();
    cy.url().should('include', '/orders');
  });
});
```

## Deployment

### Build Process
```bash
# Production build
npm run build

# Build output
dist/
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   └── vendor-[hash].js
├── index.html
└── manifest.json
```

### Environment Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/x-charts'],
        },
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
```

### Hosting Platforms

#### Vercel
```json
// vercel.json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Netlify
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Performance Monitoring
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Development Best Practices

### Code Style
- Use TypeScript strict mode
- Follow ESLint configuration
- Implement Prettier for formatting
- Use semantic commit messages

### Component Guidelines
- Keep components small and focused
- Use composition over inheritance
- Implement proper prop typing
- Add JSDoc comments for complex logic

### Performance Guidelines
- Avoid inline functions in render
- Use proper dependency arrays in hooks
- Implement proper error boundaries
- Optimize bundle size regularly

### Accessibility Guidelines
- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigation
- Test with screen readers
- Maintain proper color contrast
