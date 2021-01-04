import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import LeafyGreenButton, { Variant, Size } from "@leafygreen-ui/button";

interface ButtonType {
  danger: string;
  dark: string;
  default: string;
  info: string;
  primary: string;
}
type ButtonTypeKeys = keyof ButtonType;

interface Props {
  loading?: boolean;
  variant?: ButtonTypeKeys;
  onClick?: () => void;
  disabled?: boolean;
  "data-cy"?: string;
  glyph?: React.ReactElement;
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
  glyph,
  href,
  target,
  size,
}) => (
  <LeafyGreenButton
    data-cy={dataCy}
    variant={mapVariantToLeafyGreenVariant[variant]}
    onClick={onClick}
    disabled={disabled}
    glyph={loading ? <LoadingOutlined style={{ marginRight: "8px" }} /> : glyph}
    href={href}
    target={target}
    size={size}
  >
    {children}
  </LeafyGreenButton>
);

const mapVariantToLeafyGreenVariant: { [key: string]: ButtonTypeKeys } = {
  [Variant.Danger]: "danger",
  [Variant.Dark]: "dark",
  [Variant.Default]: "default",
  [Variant.Info]: "info",
  [Variant.Primary]: "primary",
};
