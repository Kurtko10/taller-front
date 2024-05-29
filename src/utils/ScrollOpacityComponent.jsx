import { useState, useEffect } from "react";

const useScrollOpacity = () => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timer;
    
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsScrolling(false);
      }, 200); 
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isScrolling;
};

export default useScrollOpacity;