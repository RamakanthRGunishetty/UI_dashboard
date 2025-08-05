import { useState, useEffect } from "react";
import Icon from "../Icon";

interface SearchProps {
  showTextIcon: boolean;
  compact?: boolean;
  expanded?: boolean;
  onSearch?: (searchTerm: string) => void;
  placeholder?: string;
}

const Search = ({ showTextIcon = false, compact = false, expanded = false, onSearch, placeholder }: SearchProps) => {
  const [isVerySmall, setIsVerySmall] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsVerySmall(window.innerWidth < 440);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const getPlaceholderText = () => {
    if (placeholder) return placeholder;
    if (isVerySmall) {
      return isFocused ? "Search..." : "Search";
    }
    return "Search";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };
  
  return (
    <div className={`search ${isVerySmall ? 'very-small' : ''} ${compact ? 'compact' : ''} ${expanded ? 'expanded' : ''} ${isFocused ? 'focused' : ''}`}>
      <Icon type="search-magnifier-icon" />
      <input 
        type="text" 
        placeholder={getPlaceholderText()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleInputChange}
        aria-label="Search"
      />
      {showTextIcon && !isVerySmall && <Icon type="text-input-icon" />}
    </div>
  );
  
};

export default Search;
