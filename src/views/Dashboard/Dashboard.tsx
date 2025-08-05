import { useState, useEffect, useCallback, useMemo } from "react";
import CardStats from "../../data/dashboardCard.json";
import rows from "../../data/topProducts.json";
import Card from "../../components/Card";
import BarChart from "../../containers/BarChart";
import LineChart from "../../containers/LineChart";
import PieChart from "../../containers/PieChart";
import WorldMap from "../../containers/WorldMap";
import Table from "../../containers/Table";
import Icon from "../../components/Icon";

// Enhanced interfaces for dashboard
interface DashboardMetric {
  id: number;
  title: string;
  value: string;
  change: string;
  icon: string;
  alt: string;
  trend?: 'up' | 'down' | 'stable';
  target?: string;
  progress?: number;
}



const columns = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "price",
    headerName: "Price",
    flex: 0.5,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    type: "number",
    align: "left",
    headerAlign: "left",
    flex: 0.5,
  },
  {
    field: "amount",
    headerName: "Amount",
    flex: 0.5,
  },
];

const tableProps = {
  checkboxSelection: false,
  hideFooter: true,
  className: "dashboard-table",
};

const Dashboard = ({ pageTitle = "eCommerce" }) => {
  // Enhanced state management


  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetric[]>(CardStats);

  const [animatedComponents, setAnimatedComponents] = useState<Set<string>>(new Set());


  // Simulate real-time data updates
  const simulateDataUpdate = useCallback(() => {
    const updatedMetrics = dashboardMetrics.map(metric => {
      const randomChange = (Math.random() - 0.5) * 4; // ±2% change
      const currentValue = parseFloat(metric.value.replace(/[^0-9.-]/g, ''));
      const newValue = Math.max(0, currentValue + (currentValue * randomChange / 100));
      
      return {
        ...metric,
        value: metric.value.includes('$') 
          ? `$${newValue.toFixed(0)}` 
          : metric.value.includes('%')
          ? `${newValue.toFixed(1)}%`
          : `${Math.floor(newValue).toLocaleString()}`,
        change: `${randomChange > 0 ? '+' : ''}${randomChange.toFixed(2)}%`,
        icon: randomChange > 0 ? "arrow-up-trend-icon" : "arrow-down-trend-icon",
        trend: randomChange > 0 ? 'up' : randomChange < 0 ? 'down' : 'stable' as 'up' | 'down' | 'stable'
      };
    });
    
    setDashboardMetrics(updatedMetrics);
    
    // Trigger animations
    setAnimatedComponents(new Set(['cards', 'charts', 'table', 'map']));
    setTimeout(() => setAnimatedComponents(new Set()), 1000);
  }, [dashboardMetrics]);





  // Entry animations on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedComponents(new Set(['cards', 'charts', 'table', 'map']));
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    return rows;
  }, []);

  return (
    <section className="dashboard-wrapper">
      {/* Enhanced Header with Controls */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">{pageTitle}</h1>

        </div>
        
          
      </div>







      <section className="dashboard-content-wrapper">
        <div className="first-row-wrapper">
          <div className={`all-card-wrapper ${animatedComponents.has('cards') ? 'animate-in' : ''}`}>
            {dashboardMetrics?.map((item, index) => (
              <div 
                key={item.id} 
                className="card-container"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  transition: 'all 0.3s ease'
                }}
              >
                <Card {...item} />
                {item.trend && (
                  <div className={`trend-indicator ${item.trend}`}>
                    <Icon type={item.icon} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={`chart-container bar-chart ${animatedComponents.has('charts') ? 'animate-in' : ''}`}>
            <BarChart title="Projections vs Actuals" />
          </div>
        </div>
        
        <div className={`line-chart-wrapper ${animatedComponents.has('charts') ? 'animate-in' : ''}`}>
          <LineChart title="Revenue" />
        </div>
        
        <div className={`map-wrapper ${animatedComponents.has('map') ? 'animate-in' : ''}`}>
          <WorldMap title="Revenue by Location" />
        </div>
        
        <div className={`table-wrapper ${animatedComponents.has('table') ? 'animate-in' : ''}`}>
          <Table
            columns={columns}
            rows={filteredData}
            properties={tableProps}
          />
        </div>
        
        <div className={`pie-chart-wrapper ${animatedComponents.has('charts') ? 'animate-in' : ''}`}>
          <PieChart title="Total Sales" />
        </div>
      </section>
    </section>
  );
  
};

export default Dashboard;
