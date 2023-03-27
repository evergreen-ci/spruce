interface ConditionalWrapperProps<T = any> {
  condition: boolean;
  wrapper: (children: T) => JSX.Element;
  altWrapper?: (children: T) => JSX.Element;
  children: T;
}
export const ConditionalWrapper: React.VFC<ConditionalWrapperProps> = ({
  condition,
  wrapper,
  altWrapper,
  children,
}) => {
  if (condition) {
    return wrapper(children);
  }
  return altWrapper ? altWrapper(children) : children;
};
