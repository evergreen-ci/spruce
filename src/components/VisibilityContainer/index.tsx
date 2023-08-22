import { useRef, useState } from "react";
import useIntersectionObserver from "hooks/useIntersectionObserver";

interface VisibilityContainerProps {
  children: React.ReactNode;
}
/**
 * `VisibilityContainer` is a component that will only render its children when it is visible in the viewport.
 * @param props - VisibilityContainerProps
 * @param props.children - The children to render when the component is visible
 * @returns The VisibilityContainer component
 */
const VisibilityContainer: React.FC<VisibilityContainerProps> = ({
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
