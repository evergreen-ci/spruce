import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import LeafyGreenButton, { Variant, Size } from "@leafygreen-ui/button";

interface ButtonType {
  danger: string;
  default: string;
  primary: string;
  primaryOutline: string;
}
type ButtonTypeKeys = keyof ButtonType;

interface Props {
  loading?: boolean;
  variant?: ButtonTypeKeys;
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
    variant={mapVariantToLeafyGreenVariant[variant]}
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

const mapVariantToLeafyGreenVariant: { [key: string]: ButtonTypeKeys } = {
  [Variant.Danger]: "danger",
  [Variant.Default]: "default",
  [Variant.Primary]: "primary",
  [Variant.PrimaryOutline]: "primaryOutline",
};
