import { LineChart } from "@mui/x-charts/LineChart";
import { useState, useEffect } from "react";

const uData = [13, 18, 13, 3, 16, 9];
const pData = [18, 12, 6, 16, 14, 4];
const xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const useResponsiveSettings = () => {
  const [settings, setSettings] = useState({
    height: 365,
    itemMarkSize: 5,
    itemGap: 16,
    margins: { left: 40, right: 30, top: 60, bottom: 40 },
    labels: {
      current: "Current Week  $58,211",
      previous: "Previous Week  $68,768"
    }
  });

  useEffect(() => {
    const updateSettings = () => {
      if (window.innerWidth < 480) {
        setSettings({
          height: 260,
          itemMarkSize: 3,
          itemGap: 10,
          margins: { left: 30, right: 20, top: 50, bottom: 30 },
          labels: {
            current: "Current $58,211",
            previous: "Previous $68,768"
          }
        });
      } else if (window.innerWidth < 768) {
        setSettings({
          height: 280,
          itemMarkSize: 4,
          itemGap: 12,
          margins: { left: 35, right: 25, top: 55, bottom: 35 },
          labels: {
            current: "Current Week $58,211",
            previous: "Previous Week $68,768"
          }
        });
      } else if (window.innerWidth < 1200) {
        setSettings({
          height: 320,
          itemMarkSize: 4,
          itemGap: 14,
          margins: { left: 38, right: 28, top: 58, bottom: 38 },
          labels: {
            current: "Current Week  $58,211",
            previous: "Previous Week  $68,768"
          }
        });
      } else {
        setSettings({
          height: 365,
          itemMarkSize: 5,
          itemGap: 16,
          margins: { left: 40, right: 30, top: 60, bottom: 40 },
          labels: {
            current: "Current Week  $58,211",
            previous: "Previous Week  $68,768"
          }
        });
      }
    };

    updateSettings();
    window.addEventListener('resize', updateSettings);
    return () => window.removeEventListener('resize', updateSettings);
  }, []);

  return settings;
};

const CustomLineChart = ({ title }: Title) => {
  const { height, itemMarkSize, itemGap, margins, labels } = useResponsiveSettings();
    
  return (
    <div className="line-chart-wrapper">
      <h6 className="graph-title">{title}</h6>
      <LineChart
        height={height}
        className="line-chart"
        grid={{ horizontal: true }}
        series={[
          {
            data: pData,
            id: "pvId",
            stack: "total",
            curve: "natural",
            color: "#A8C5DA",
            label: labels.current,
            showMark: false,
          },
          {
            data: uData,
            id: "uvId",
            stack: "total",
            curve: "natural",
            color: "#C1C1C1",
            label: labels.previous,
            showMark: false,
          },
        ]}
        xAxis={[{ data: xLabels, scaleType: "band" }]}
        yAxis={[
          {
            valueFormatter: (value) => `${value}M`,
          },
        ]}
        leftAxis={{ disableLine: true, disableTicks: true }}
        bottomAxis={{ disableTicks: true }}
        margin={margins}
        slotProps={{
          legend: {
            itemMarkWidth: itemMarkSize,
            itemMarkHeight: itemMarkSize,
            position: { 
              horizontal: "middle", 
              vertical: "top" 
            },
            itemGap: itemGap,
          },
        }}
      />
    </div>
  );
  
}

export default CustomLineChart;
