import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import LeafyGreenButton, { Variant, Size } from "@leafygreen-ui/button";

interface Props {
  loading?: boolean;
  variant?: Variant;
  onClick?: () => void;
  disabled?: boolean;
  "data-cy"?: string;
  leftGlyph?: React.ReactElement;
  size?: Size;
  href?: string;
  target?: string;
}

export const Button: React.FC<Props> = ({
  children,
  loading,
  variant = "default",
  onClick,
  disabled,
  "data-cy": dataCy,
  leftGlyph,
  href,
  target,
  size,
}) => (
  <LeafyGreenButton
    data-cy={dataCy}
    variant={variant}
    onClick={onClick}
    disabled={disabled}
    leftGlyph={
      loading ? <LoadingOutlined style={{ marginRight: "8px" }} /> : leftGlyph
    }
    href={href}
    target={target}
    size={size}
  >
    {children}
  </LeafyGreenButton>
);
