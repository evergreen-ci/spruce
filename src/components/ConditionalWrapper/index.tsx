import React from "react";

interface ConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: any) => JSX.Element;
  altWrapper?: (children: any) => JSX.Element;
  children: JSX.Element;
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
