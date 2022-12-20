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
    observer.disconnect();
    return () => observer.unobserve(currentRef);
  }, []);

  return <div ref={containerRef}>{isVisible ? children : null}</div>;
};

export default VisibilityContainer;
