import { useRef, useEffect, useState } from "react";

interface VisibilityContainerProps {
  children: React.ReactNode;
}
/**
 * `VisibilityContainer` is a component that will only render its children when it is visible in the viewport.
 */
const VisibilityContainer: React.VFC<VisibilityContainerProps> = ({
  children,
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = containerRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });
    observer.observe(currentRef);
    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef}>{isVisible ? children : null}</div>;
};

export default VisibilityContainer;
