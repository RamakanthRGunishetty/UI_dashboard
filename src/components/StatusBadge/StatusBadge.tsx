import Icon from "../Icon";

interface StatusBadgeProps {
  label?: string;
  markerColor?: string;
  labelColor?: string;
  compact?: boolean;
}

const StatusBadge = ({
  label = "",
  markerColor = "#FFFFFF33",
  labelColor = "",
  compact = false,
}: StatusBadgeProps) => {
    
  return (
    <div className={`bullet-list-wrapper ${compact ? 'compact' : ''}`}>
      <Icon type="bullet-dot-icon" color={markerColor} />
      <span style={{ color: labelColor }}>{label}</span>
    </div>
  );
  
};

export default StatusBadge;
