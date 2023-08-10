interface ConditionalWrapperProps<T = any> {
  condition: boolean;
  wrapper: (children: T) => JSX.Element;
  altWrapper?: (children: T) => JSX.Element;
  children: T;
}
export const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({
  altWrapper,
  children,
  condition,
  wrapper,
}) => {
  if (condition) {
    return wrapper(children);
  }
  return altWrapper ? altWrapper(children) : children;
};
