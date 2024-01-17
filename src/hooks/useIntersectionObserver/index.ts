import { useEffect, RefObject } from "react";

const useIntersectionObserver = (
  target: RefObject<HTMLElement>,
  onIntersect: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, options);
    if (target.current) {
      observer.observe(target.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [target, onIntersect, options]);
};

export default useIntersectionObserver;
