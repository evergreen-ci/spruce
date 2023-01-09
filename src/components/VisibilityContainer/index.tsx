import { useRef, useState } from "react";
import useIntersectionObserver from "hooks/useIntersectionObserver";

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

  useIntersectionObserver(containerRef, ([entry]) => {
    setIsVisible(entry.isIntersecting);
  });

  return <div ref={containerRef}>{isVisible ? children : null}</div>;
};

export default VisibilityContainer;
