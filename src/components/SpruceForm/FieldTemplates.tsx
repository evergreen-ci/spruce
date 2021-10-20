import { FieldTemplateProps } from "@rjsf/core";

// Custom field template that does not render fields' titles, as this is handled by LeafyGreen widgets
export const DefaultFieldTemplate: React.FC<FieldTemplateProps> = ({
  classNames,
  children,
}) => <div className={classNames}>{children}</div>;
