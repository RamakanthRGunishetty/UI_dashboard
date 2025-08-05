import { useState, useEffect } from "react";
import Icon from "../Icon";

const Card = ({ id, title, value, change, icon, alt = "icon" }:ListItem) => {
  const [animatedValue, setAnimatedValue] = useState<string>("0");
  
  useEffect(() => {
    const extractNumber = (str: string) => {
      const hasPercent = str.includes('%');
      const hasDollar = str.includes('$');
      const hasComma = str.includes(',');
      
      const numericStr = str.replace(/[^\d.]/g, '');
      const targetNumber = parseFloat(numericStr);
      
      return { targetNumber, hasPercent, hasDollar, hasComma };
    };
    
    const { targetNumber, hasPercent, hasDollar, hasComma } = extractNumber(value);
    
    if (isNaN(targetNumber)) {
      setAnimatedValue(value);
      return;
    }
    
    const animationDuration = 2000;
    const steps = 60;
    const increment = targetNumber / steps;
    const stepDuration = animationDuration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const currentValue = increment * currentStep;
      
      let formattedValue = "";
      
      if (currentStep >= steps) {
        let finalValue = targetNumber.toString();
        
        if (hasComma && targetNumber >= 1000) {
          finalValue = targetNumber.toLocaleString();
        } else if (hasPercent && targetNumber % 1 !== 0) {
          finalValue = targetNumber.toFixed(1);
        }
        
        if (hasDollar) formattedValue = `$${finalValue}`;
        else if (hasPercent) formattedValue = `${finalValue}%`;
        else formattedValue = finalValue;
        
        setAnimatedValue(formattedValue);
        clearInterval(timer);
      } else {
        let displayValue = "";
        
        if (hasPercent && targetNumber % 1 !== 0) {
          displayValue = currentValue.toFixed(1);
        } else {
          displayValue = Math.floor(currentValue).toString();
        }
        
        if (hasComma && currentValue >= 1000) {
          displayValue = Math.floor(currentValue).toLocaleString();
        }
        
        if (hasDollar) formattedValue = `$${displayValue}`;
        else if (hasPercent) formattedValue = `${displayValue}%`;
        else formattedValue = displayValue;
        
        setAnimatedValue(formattedValue);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <div
      className={
        id == 1
          ? "card-wrapper blue"
          : id == 4
          ? "card-wrapper cyan"
          : "card-wrapper"
      }
    >
      <p>{title}</p>
      <p className="value"> {animatedValue} </p>
      <span>
        {change}
        <Icon type={icon} alt={alt} />
      </span>
    </div>
  );
  
};

export default Card;
