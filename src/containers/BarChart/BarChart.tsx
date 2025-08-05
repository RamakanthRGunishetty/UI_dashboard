import { BarChart } from "@mui/x-charts/BarChart";
import { useState, useEffect } from "react";

const uData = [13, 18, 13, 12, 16, 9];
const pData = [7, 8, 6, 10, 14, 4];
const xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const useResponsiveHeight = () => {
  const [height, setHeight] = useState(262);

  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 768) {
        setHeight(220);
      } else if (window.innerWidth < 1200) {
        setHeight(240);
      } else {
        setHeight(262);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return height;
};

const CustomBarChart = ({ title }:Title) => {
  const chartHeight = useResponsiveHeight();
    
  return (
    <div className="bar-chart-wrapper">
      <h6 className="graph-title">{title}</h6>
      <BarChart
        height={chartHeight}
        borderRadius={4}
        className="bar-chart"
        grid={{ horizontal: true }}
        series={[
          { data: pData, id: "pvId", stack: "total", color: "#A8C5DA" },
          { data: uData, id: "uvId", stack: "total", color: "#CFDEEA" },
        ]}
        xAxis={[{ data: xLabels, scaleType: "band", categoryGapRatio: 0.6 }]}
        yAxis={[
          {
            valueFormatter: (value) => `${value}M`,
          },
        ]}
        leftAxis={{ disableLine: true, disableTicks: true }}
        bottomAxis={{ disableTicks: true, stroke: "#FF0000" }}
        margin={{ left: 40, right: 20, top: 50, bottom: 40 }}
      />
    </div>
  );
  
}

export default CustomBarChart;