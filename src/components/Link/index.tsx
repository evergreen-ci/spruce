// Use a wrapper over React Router's Link so that native HTML props can be passed through LeafyGreen MenuItem.
// (i.e. convert "data-to" to "to")

import { Link as ReactRouterLink } from "react-router-dom";

interface LinkWrapperType
  extends Omit<React.ComponentProps<typeof ReactRouterLink>, "to"> {
  "data-to": string;
}

export const Link: React.FC<LinkWrapperType> = ({
  "data-to": dataTo,
  children,
  ...rest
}) => (
  <ReactRouterLink to={dataTo} {...rest}>
    {children}
  </ReactRouterLink>
);
