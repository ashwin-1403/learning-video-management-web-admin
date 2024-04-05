import { useState, useEffect } from "react";

const useDebounce = (value, delay, setCurrentPage) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setDebouncedValue(value);
      setCurrentPage(1);
    }, delay);
    return () => clearTimeout(timeoutID);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
